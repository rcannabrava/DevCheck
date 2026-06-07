export function EnvBadge() {
  const env = (import.meta.env.VITE_APP_ENV ?? "development") as string;
  if (env === "production") return null;

  const label = env === "staging" ? "STAGING" : "DEV";
  return (
    <span className="font-mono text-[10px] uppercase tracking-widest rounded-sm border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-2 py-0.5 text-[var(--color-accent)]">
      {label}
    </span>
  );
}
