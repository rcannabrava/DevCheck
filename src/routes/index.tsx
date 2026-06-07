import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Card } from "@/components/Card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevCheck — Seu projeto está pronto para produção?" },
      {
        name: "description",
        content:
          "Um checklist de engenheiros sêniores que pontua seu projeto, diagnostica fraquezas e lista melhorias acionáveis.",
      },
    ],
  }),
  component: Index,
});

const FEATURES = [
  {
    code: "01",
    title: "Nota",
    body: "Uma pontuação ponderada de 0 a 100 sobre cinco pilares de engenharia: testes, documentação, CI/CD, qualidade de código e arquitetura.",
  },
  {
    code: "02",
    title: "Diagnóstico",
    body: "Um resumo narrativo conciso sobre a situação do projeto, com pontos fortes e fracos identificados por nome.",
  },
  {
    code: "03",
    title: "Dicas de Melhoria",
    body: "Próximos passos acionáveis e priorizados para cada lacuna — somente para itens respondidos como Parcial ou Não.",
  },
] as const;

function Index() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr] md:py-24">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
            v1.0 · DevCheck
          </span>
          <h1 className="mt-4 text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
            Seu projeto está
            <br />
            pronto para produção?
          </h1>
          <p className="mt-6 max-w-xl text-base text-[var(--color-text-muted)] sm:text-lg">
            O DevCheck audita qualquer projeto de software com base nas práticas que engenheiros
            sêniores realmente exigem — e te entrega uma nota, um diagnóstico e uma lista de
            correções que você pode entregar esta semana.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/setup"
              className="inline-flex h-11 items-center rounded-md bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]"
            >
              Iniciar Avaliação →
            </Link>
            <Link
              to="/history"
              className="inline-flex h-11 items-center rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-2)]"
            >
              Ver histórico
            </Link>
          </div>
        </div>

        <Card className="self-start">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
              project.json
            </span>
            <span className="font-mono text-xs text-[var(--color-accent)]">● pronto</span>
          </div>
          <pre className="mt-4 overflow-x-auto font-mono text-xs leading-6 text-[var(--color-text)]">
            {`{
  "testes":       "✓ unitário, integração",
  "cobertura":    "78%",
  "ci":           "✓ github actions",
  "linter":       "✓ eslint",
  "formatter":    "✓ prettier",
  "docs":         "△ somente readme",
  "nota":         82
}`}
          </pre>
        </Card>
      </section>

      <section className="border-t border-[var(--color-border)] py-16">
        <h2 className="text-2xl sm:text-3xl">O que você recebe</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Três entregáveis para cada avaliação.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.code}>
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                {feature.code}
              </span>
              <h3 className="mt-3 text-lg">{feature.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{feature.body}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
