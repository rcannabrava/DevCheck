import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { ScoreGauge } from "@/components/ScoreGauge";
import { exportReportPdf } from "@/services/pdfExport";
import { getDerivedResults, useDevcheckStore } from "@/store/devcheckStore";
import { logger } from "@/utils/logger";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Resultados — DevCheck" },
      {
        name: "description",
        content: "Sua nota DevCheck, diagnóstico e dicas acionáveis de melhoria.",
      },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const navigate = useNavigate();
  const projectName = useDevcheckStore((s) => s.projectName);
  const answers = useDevcheckStore((s) => s.answers);
  const resetEvaluation = useDevcheckStore((s) => s.resetEvaluation);

  const printableRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  const hasAnswers = Object.keys(answers).length > 0;

  const derived = useMemo(() => getDerivedResults(answers, projectName), [answers, projectName]);

  async function handleExport() {
    if (!printableRef.current) return;
    setExporting(true);
    try {
      await exportReportPdf(printableRef.current, projectName || "report");
    } catch (cause) {
      logger.error(cause);
    } finally {
      setExporting(false);
    }
  }

  function handleNewEvaluation() {
    resetEvaluation();
    navigate({ to: "/setup" });
  }

  if (!hasAnswers) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl">Nenhuma avaliação ainda</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Inicie uma nova avaliação para ver seus resultados aqui.
        </p>
        <div className="mt-6">
          <Link
            to="/setup"
            className="inline-flex h-11 items-center rounded-md bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]"
          >
            Iniciar avaliação
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
            Relatório
          </span>
          <h1 className="mt-1 text-3xl sm:text-4xl">{projectName || "Projeto sem título"}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={handleNewEvaluation}>
            Nova avaliação
          </Button>
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? "Exportando…" : "Exportar PDF"}
          </Button>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-[auto_1fr]">
        <Card className="flex items-center justify-center">
          <ScoreGauge score={derived.score.overall} />
        </Card>
        <Card>
          <h2 className="text-lg">Detalhamento por categoria</h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Cada categoria contribui igualmente para a nota geral.
          </p>
          <div className="mt-6">
            <CategoryBreakdown scores={derived.score.byCategory} />
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-lg">Diagnóstico</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text)]">{derived.diagnosis}</p>

        <button
          type="button"
          onClick={() => setShowMethodology((prev) => !prev)}
          className="mt-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] hover:underline"
          aria-expanded={showMethodology}
        >
          {showMethodology ? "− Ocultar metodologia" : "+ Como é calculada a nota?"}
        </button>
        {showMethodology ? (
          <div className="mt-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 text-xs text-[var(--color-text-muted)]">
            <ul className="list-disc space-y-1 pl-5">
              <li>Sim = pontuação total, Parcial = metade, Não = zero.</li>
              <li>Cada categoria é normalizada em uma nota de 0 a 100.</li>
              <li>A nota geral é a média com pesos iguais entre todas as categorias.</li>
              <li>0–40 vermelho · 41–70 âmbar · 71–100 verde.</li>
            </ul>
          </div>
        ) : null}
      </Card>

      <Card className="mt-6">
        <h2 className="text-lg">Dicas de melhoria</h2>
        {derived.tips.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            Nada a melhorar — todos os itens são Sim. Pode subir.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--color-border)]">
            {derived.tips.map((tip, index) => (
              <li key={`${tip.questionText}-${index}`} className="py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
                    {tip.categoryName}
                  </span>
                  <span
                    className={
                      tip.severity === "missing"
                        ? "font-mono text-[10px] uppercase tracking-widest text-[var(--color-error)]"
                        : "font-mono text-[10px] uppercase tracking-widest text-[var(--color-warning)]"
                    }
                  >
                    {tip.severity === "missing" ? "Ausente" : "Parcial"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--color-text)]">{tip.questionText}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">→ {tip.tip}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Offscreen printable report with white background for PDF export */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: "-10000px",
          top: 0,
          width: "800px",
          background: "#ffffff",
          color: "#0a0a0a",
        }}
      >
        <div ref={printableRef} style={{ padding: "32px", background: "#ffffff" }}>
          <PrintableReport
            projectName={projectName || "Projeto sem título"}
            score={derived.score.overall}
            byCategory={derived.score.byCategory}
            diagnosis={derived.diagnosis}
            tips={derived.tips}
          />
        </div>
      </div>
    </div>
  );
}

interface PrintableProps {
  projectName: string;
  score: number;
  byCategory: ReturnType<typeof getDerivedResults>["score"]["byCategory"];
  diagnosis: string;
  tips: ReturnType<typeof getDerivedResults>["tips"];
}

function PrintableReport({ projectName, score, byCategory, diagnosis, tips }: PrintableProps) {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#0a0a0a" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e5e5",
          paddingBottom: "16px",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Relatório DevCheck
          </div>
          <h1 style={{ margin: "8px 0 0", fontSize: "28px" }}>{projectName}</h1>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "48px", fontWeight: 700, lineHeight: 1 }}>{score}</div>
          <div
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "10px",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
            }}
          >
            / 100
          </div>
        </div>
      </div>

      <section style={{ marginTop: "24px" }}>
        <h2 style={{ fontSize: "16px", margin: 0 }}>Detalhamento por categoria</h2>
        <div style={{ marginTop: "12px" }}>
          <CategoryBreakdown scores={byCategory} light />
        </div>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2 style={{ fontSize: "16px", margin: 0 }}>Diagnóstico</h2>
        <p style={{ marginTop: "8px", fontSize: "14px", lineHeight: 1.6 }}>{diagnosis}</p>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2 style={{ fontSize: "16px", margin: 0 }}>Dicas de melhoria</h2>
        {tips.length === 0 ? (
          <p style={{ marginTop: "8px", fontSize: "14px", color: "#6b7280" }}>
            Nenhuma melhoria necessária.
          </p>
        ) : (
          <ul style={{ marginTop: "8px", paddingLeft: "20px", fontSize: "13px" }}>
            {tips.map((tip, index) => (
              <li key={`${tip.questionText}-${index}`} style={{ marginBottom: "10px" }}>
                <div style={{ fontWeight: 600 }}>
                  {tip.categoryName} — {tip.questionText}
                </div>
                <div style={{ color: "#6b7280" }}>→ {tip.tip}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
