import { describe, expect, it } from "vitest";
import {
  buildDiagnosis,
  buildImprovementTips,
  calculateScore,
  scoreAnswer,
  scoreColor,
} from "./scoreCalculator";

describe("scoreAnswer", () => {
  it("returns full points for yes", () => {
    expect(scoreAnswer("yes")).toBe(1);
  });
  it("returns half points for partial", () => {
    expect(scoreAnswer("partial")).toBe(0.5);
  });
  it("returns zero for no or undefined", () => {
    expect(scoreAnswer("no")).toBe(0);
    expect(scoreAnswer(undefined)).toBe(0);
  });
});

describe("scoreColor", () => {
  it("returns red for low scores", () => {
    expect(scoreColor(0)).toBe("red");
    expect(scoreColor(40)).toBe("red");
  });
  it("returns amber for mid scores", () => {
    expect(scoreColor(41)).toBe("amber");
    expect(scoreColor(70)).toBe("amber");
  });
  it("returns green for high scores", () => {
    expect(scoreColor(71)).toBe("green");
    expect(scoreColor(100)).toBe("green");
  });
});

describe("calculateScore", () => {
  it("returns 0 when nothing is answered", () => {
    const result = calculateScore({});
    expect(result.overall).toBe(0);
    expect(result.byCategory.every((c) => c.score === 0)).toBe(true);
  });

  it("returns 100 when all answers are yes", () => {
    const answers: Record<string, "yes"> = {
      "tests-unit": "yes",
      "tests-integration": "yes",
      "tests-coverage": "yes",
      "docs-readme": "yes",
      "docs-inline": "yes",
      "docs-api": "yes",
      "ci-pipeline": "yes",
      "ci-environments": "yes",
      "ci-deploy": "yes",
      "quality-linter": "yes",
      "quality-formatter": "yes",
      "quality-dead": "yes",
      "quality-naming": "yes",
      "arch-structure": "yes",
      "arch-commits": "yes",
      "arch-gitignore": "yes",
    };
    const result = calculateScore(answers);
    expect(result.overall).toBe(100);
  });

  it("scores partial as half points", () => {
    const result = calculateScore({
      "tests-unit": "partial",
      "tests-integration": "partial",
      "tests-coverage": "partial",
    });
    const testingCategory = result.byCategory.find(
      (entry) => entry.categoryId === "testing",
    );
    expect(testingCategory?.score).toBe(50);
  });
});

describe("buildImprovementTips", () => {
  it("only includes tips for partial and no answers", () => {
    const tips = buildImprovementTips({
      "tests-unit": "yes",
      "tests-integration": "no",
      "tests-coverage": "partial",
    });
    expect(tips).toHaveLength(2);
    expect(tips.find((tip) => tip.severity === "missing")).toBeDefined();
    expect(tips.find((tip) => tip.severity === "partial")).toBeDefined();
  });
});

describe("buildDiagnosis", () => {
  it("references the project name and overall score", () => {
    const result = calculateScore({ "tests-unit": "yes" });
    const text = buildDiagnosis("acme-api", result);
    expect(text).toContain("acme-api");
    expect(text).toContain(`${result.overall}/100`);
  });
});