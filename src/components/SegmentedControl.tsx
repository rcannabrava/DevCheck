import type { AnswerValue } from "@/types";
import { cn } from "@/utils/cn";

interface Option {
  value: AnswerValue;
  label: string;
}

const OPTIONS: readonly Option[] = [
  { value: "yes", label: "Sim" },
  { value: "partial", label: "Parcial" },
  { value: "no", label: "Não" },
];

interface SegmentedControlProps {
  name: string;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  label: string;
}

export function SegmentedControl({ name, value, onChange, label }: SegmentedControlProps) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex w-full max-w-md rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] p-1"
    >
      {OPTIONS.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            name={name}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-[var(--color-accent)] text-[var(--color-text-inverse)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
