import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="grid place-items-center rounded-md border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-16 text-center">
      <svg
        aria-hidden="true"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        className="mb-4"
      >
        <rect x="6" y="10" width="36" height="28" rx="3" stroke="#2e2e2e" strokeWidth="2" />
        <path
          d="M14 20h20M14 26h14M14 32h8"
          stroke="#6b7280"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <h3 className="text-base">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--color-text-muted)]">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
