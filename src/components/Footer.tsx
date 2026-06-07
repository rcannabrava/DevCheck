import { EnvBadge } from "@/components/EnvBadge";

export function Footer() {
  const version = import.meta.env.VITE_APP_VERSION ?? "1.0.0";
  const appName = import.meta.env.VITE_APP_NAME ?? "DevCheck";

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap items-center gap-3 font-mono">
          <span>
            {appName} v{version}
          </span>
          <EnvBadge />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-[var(--color-border-strong)] px-2 py-1 font-mono uppercase tracking-widest">
            ODS 4 · Educação de Qualidade
          </span>
          <span className="rounded-md border border-[var(--color-border-strong)] px-2 py-1 font-mono uppercase tracking-widest">
            ODS 9 · Indústria, Inovação e Infraestrutura
          </span>
        </div>
      </div>
    </footer>
  );
}
