import type { CategoryScore } from "@/types";
import { scoreColor } from "@/utils/scoreCalculator";

const COLORS = {
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#00c896",
} as const;

interface CategoryBreakdownProps {
  scores: readonly CategoryScore[];
  light?: boolean;
}

export function CategoryBreakdown({ scores, light = false }: CategoryBreakdownProps) {
  return (
    <ul className="space-y-4">
      {scores.map((entry) => {
        const color = COLORS[scoreColor(entry.score)];
        return (
          <li key={entry.categoryId}>
            <div className="mb-1 flex items-center justify-between">
              <span
                className="text-sm font-medium"
                style={{ color: light ? "#0a0a0a" : "#ffffff" }}
              >
                {entry.categoryName}
              </span>
              <span className="font-mono text-xs" style={{ color: light ? "#6b7280" : "#6b7280" }}>
                {entry.score} / 100
              </span>
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-md"
              style={{ background: light ? "#e5e5e5" : "#222222" }}
            >
              <div
                className="h-full transition-[width] duration-500"
                style={{ width: `${entry.score}%`, background: color }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
