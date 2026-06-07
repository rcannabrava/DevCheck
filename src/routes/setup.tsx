import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { fetchRepoData, answersFromRepo, GithubError } from "@/services/githubService";
import { useDevcheckStore } from "@/store/devcheckStore";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Configuração — DevCheck" },
      {
        name: "description",
        content:
          "Configure sua avaliação. Opcionalmente, importe dados de um repositório público do GitHub para pré-preencher respostas.",
      },
    ],
  }),
  component: SetupPage,
});

function errorMessage(kind: GithubError["kind"]): string {
  switch (kind) {
    case "invalid-url":
      return "Isso não parece uma URL do GitHub. Tente https://github.com/owner/repo.";
    case "not-found":
      return "Não encontramos esse repositório. Confira a URL e se ele é público.";
    case "rate-limited":
      return "Limite de requisições do GitHub atingido. Tente novamente em alguns minutos.";
    case "timeout":
      return "A requisição ao GitHub demorou demais. Tente novamente.";
    case "network":
    default:
      return "Não foi possível acessar o GitHub. Verifique sua conexão e tente novamente.";
  }
}

function SetupPage() {
  const navigate = useNavigate();
  const projectName = useDevcheckStore((s) => s.projectName);
  const githubUrl = useDevcheckStore((s) => s.githubUrl);
  const repoData = useDevcheckStore((s) => s.repoData);
  const setProjectName = useDevcheckStore((s) => s.setProjectName);
  const setGithubUrl = useDevcheckStore((s) => s.setGithubUrl);
  const applyRepoData = useDevcheckStore((s) => s.applyRepoData);
  const clearRepoData = useDevcheckStore((s) => s.clearRepoData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDetect() {
    if (!githubUrl.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRepoData(githubUrl);
      applyRepoData(data, answersFromRepo(data));
    } catch (cause) {
      const kind = cause instanceof GithubError ? cause.kind : "network";
      setError(errorMessage(kind));
      clearRepoData();
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    if (!projectName.trim()) {
      setError("O nome do projeto é obrigatório.");
      return;
    }
    navigate({ to: "/checklist" });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
        Passo 1 de 3
      </span>
      <h1 className="mt-3 text-3xl sm:text-4xl">Configurar avaliação</h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        Nos diga o que estamos auditando. Os dados do GitHub são opcionais e usados apenas para
        pré-preencher sugestões.
      </p>

      <Card className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="projectName"
            className="mb-2 block font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]"
          >
            Nome do projeto
          </label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="meu-servico"
            className="w-full rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="githubUrl"
            className="mb-2 block font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]"
          >
            URL do GitHub (opcional)
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="githubUrl"
              type="url"
              value={githubUrl}
              onChange={(event) => setGithubUrl(event.target.value)}
              placeholder="https://github.com/owner/repo"
              className="w-full rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
            />
            <Button variant="ghost" onClick={handleDetect} disabled={loading || !githubUrl.trim()}>
              {loading ? "Detectando…" : "Detectar"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Os dados do GitHub são opcionais e usados apenas para pré-preencher sugestões.
          </p>
          {error ? (
            <p
              role="alert"
              className="mt-3 rounded-md border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-3 py-2 text-xs text-[var(--color-error)]"
            >
              {error}
            </p>
          ) : null}
        </div>

        {repoData ? (
          <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
                ● Detectado automaticamente do GitHub
              </span>
              <span className="font-mono text-xs text-[var(--color-text-muted)]">
                {repoData.owner}/{repoData.repo}
              </span>
            </div>
            {repoData.description ? (
              <p className="mt-2 text-sm text-[var(--color-text)]">{repoData.description}</p>
            ) : null}
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <RepoStat label="Estrelas" value={repoData.stars} />
              <RepoStat label="Forks" value={repoData.forks} />
              <RepoStat label="Issues abertas" value={repoData.openIssues} />
              <RepoStat label="Workflows" value={repoData.hasWorkflows ? "sim" : "não"} />
              <RepoStat label="README" value={repoData.hasReadme ? "sim" : "não"} />
              <RepoStat label="Licença" value={repoData.license ?? "—"} />
              <RepoStat
                label="Último push"
                value={
                  repoData.lastPush ? new Date(repoData.lastPush).toLocaleDateString("pt-BR") : "—"
                }
              />
              <RepoStat label="Tópicos" value={repoData.topics.length} />
            </dl>
          </div>
        ) : null}
      </Card>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleContinue} size="lg">
          Continuar →
        </Button>
      </div>
    </div>
  );
}

function RepoStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-sm text-[var(--color-text)]">{value}</dd>
    </div>
  );
}
