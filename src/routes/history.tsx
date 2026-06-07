import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { useDevcheckStore } from "@/store/devcheckStore";
import { scoreColor } from "@/utils/scoreCalculator";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Histórico — DevCheck" },
      {
        name: "description",
        content: "Avaliações DevCheck anteriores armazenadas localmente neste dispositivo.",
      },
    ],
  }),
  component: HistoryPage,
});

const COLORS = {
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#00c896",
} as const;

function HistoryPage() {
  const navigate = useNavigate();
  const history = useDevcheckStore((s) => s.history);
  const removeAllHistory = useDevcheckStore((s) => s.removeAllHistory);
  const setProjectName = useDevcheckStore((s) => s.setProjectName);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleView(entry: (typeof history)[number]) {
    setProjectName(entry.projectName);
    useDevcheckStore.setState({ answers: entry.answers });
    navigate({ to: "/results" });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
            Histórico local
          </span>
          <h1 className="mt-1 text-3xl sm:text-4xl">Avaliações anteriores</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Armazenadas no seu navegador. Não são sincronizadas em lugar algum.
          </p>
        </div>
        {history.length > 0 ? (
          <Button variant="ghost" onClick={() => setConfirmOpen(true)}>
            Limpar histórico
          </Button>
        ) : null}
      </div>

      <div className="mt-8">
        {history.length === 0 ? (
          <EmptyState
            title="Nenhuma avaliação ainda"
            description="Rode sua primeira auditoria DevCheck e ela aparecerá aqui."
            action={
              <Link
                to="/setup"
                className="inline-flex h-10 items-center rounded-md bg-[var(--color-accent)] px-4 text-sm font-semibold text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]"
              >
                Iniciar avaliação
              </Link>
            }
          />
        ) : (
          <ul className="space-y-3">
            {history.map((entry) => {
              const color = COLORS[scoreColor(entry.overall)];
              return (
                <li key={entry.id}>
                  <Card className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-base">{entry.projectName}</h2>
                      <p className="font-mono text-xs text-[var(--color-text-muted)]">
                        {new Date(entry.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-mono text-2xl font-bold" style={{ color }}>
                          {entry.overall}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
                          / 100
                        </div>
                      </div>
                      <Button variant="ghost" onClick={() => handleView(entry)}>
                        Ver detalhes
                      </Button>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Limpar todo o histórico?"
        description="Isso remove permanentemente todas as avaliações armazenadas localmente neste navegador."
        confirmLabel="Limpar histórico"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          removeAllHistory();
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}
