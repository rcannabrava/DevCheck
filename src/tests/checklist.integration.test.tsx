import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SegmentedControl } from "@/components/SegmentedControl";
import { ProgressBar } from "@/components/ProgressBar";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { useDevcheckStore } from "@/store/devcheckStore";
import { calculateScore, buildImprovementTips } from "@/utils/scoreCalculator";
import { CHECKLIST } from "@/constants/checklist";

function resetStore() {
  useDevcheckStore.setState({
    projectName: "",
    githubUrl: "",
    repoData: null,
    prefilledQuestionIds: [],
    answers: {},
  });
}

describe("checklist integration", () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetStore();
  });

  it("records answers via the segmented control", async () => {
    const user = userEvent.setup();
    function Harness() {
      const value = useDevcheckStore((s) => s.answers["tests-unit"]);
      const setAnswer = useDevcheckStore((s) => s.setAnswer);
      return (
        <SegmentedControl
          name="tests-unit"
          value={value}
          onChange={(next) => setAnswer("tests-unit", next)}
          label="Has unit tests"
        />
      );
    }
    render(<Harness />);
    await user.click(screen.getByRole("radio", { name: "Parcial" }));
    expect(useDevcheckStore.getState().answers["tests-unit"]).toBe("partial");
    await user.click(screen.getByRole("radio", { name: "Sim" }));
    expect(useDevcheckStore.getState().answers["tests-unit"]).toBe("yes");
  });

  it("updates the progress bar as answers accumulate", () => {
    const { rerender } = render(<ProgressBar value={0} label="Progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    rerender(<ProgressBar value={50} label="Progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
  });

  it("renders results from computed scores and tips", () => {
    const answers = {
      [CHECKLIST[0].questions[0].id]: "yes" as const,
      [CHECKLIST[0].questions[1].id]: "no" as const,
    };
    const score = calculateScore(answers);
    const tips = buildImprovementTips(answers);

    render(<CategoryBreakdown scores={score.byCategory} />);
    expect(screen.getByText("Testes Automatizados")).toBeInTheDocument();

    expect(tips.length).toBeGreaterThan(0);
    expect(tips[0].severity).toBe("missing");
  });
});
