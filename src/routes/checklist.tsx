import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ProgressBar } from "@/components/ProgressBar";
import { SegmentedControl } from "@/components/SegmentedControl";
import { useChecklistNavigation } from "@/hooks/useChecklistNavigation";
import { useDevcheckStore } from "@/store/devcheckStore";

export const Route = createFileRoute("/checklist")({
  head: () => ({
    meta: [
      { title: "Checklist — DevCheck" },
      {
        name: "description",
        content:
          "Responda a auditoria DevCheck em múltiplas etapas, nas cinco categorias de engenharia.",
      },
    ],
  }),
  component: ChecklistPage,
});

function ChecklistPage() {
  const navigate = useNavigate();
  const answers = useDevcheckStore((s) => s.answers);
  const setAnswer = useDevcheckStore((s) => s.setAnswer);
  const prefilledIds = useDevcheckStore((s) => s.prefilledQuestionIds);
  const commitToHistory = useDevcheckStore((s) => s.commitToHistory);
  const projectName = useDevcheckStore((s) => s.projectName);

  const nav = useChecklistNavigation();
  const prefilledSet = useMemo(() => new Set(prefilledIds), [prefilledIds]);

  const allCurrentAnswered = nav.category.questions.every((question) => answers[question.id]);

  function handleFinish() {
    if (!projectName.trim()) {
      navigate({ to: "/setup" });
      return;
    }
    commitToHistory();
    navigate({ to: "/results" });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
            Categoria {nav.stepIndex + 1} de {nav.totalSteps}
          </span>
          <span className="font-mono text-xs text-[var(--color-text-muted)]">
            {nav.answeredCount} respondidas
          </span>
        </div>
        <ProgressBar value={nav.progressPct} label="Progresso" />
      </div>

      <Card>
        <h1 className="text-2xl">{nav.category.name}</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{nav.category.description}</p>

        <ul className="mt-8 space-y-8">
          {nav.category.questions.map((question, index) => {
            const isPrefilled = prefilledSet.has(question.id);
            return (
              <li key={question.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
                      Q{nav.stepIndex + 1}.{index + 1}
                    </span>
                    <p className="mt-1 text-sm text-[var(--color-text)] sm:text-base">
                      {question.text}
                    </p>
                  </div>
                  {isPrefilled ? (
                    <span className="shrink-0 rounded-md border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                      Auto
                    </span>
                  ) : null}
                </div>
                <div className="mt-3">
                  <SegmentedControl
                    name={question.id}
                    value={answers[question.id]}
                    onChange={(next) => setAnswer(question.id, next)}
                    label={question.text}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={nav.back} disabled={nav.isFirst}>
          ← Voltar
        </Button>
        {nav.isLast ? (
          <Button onClick={handleFinish} disabled={!allCurrentAnswered} size="lg">
            Ver resultados →
          </Button>
        ) : (
          <Button onClick={nav.next} disabled={!allCurrentAnswered} size="lg">
            Próxima categoria →
          </Button>
        )}
      </div>
    </div>
  );
}
