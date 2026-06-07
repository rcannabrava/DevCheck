import { scoreColor } from "@/utils/scoreCalculator";

const SIZE = 180;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const COLOR_MAP: Record<"red" | "amber" | "green", string> = {
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#00c896",
};

interface ScoreGaugeProps {
  score: number;
  forceLightTrack?: boolean;
}

export function ScoreGauge({ score, forceLightTrack = false }: ScoreGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const color = COLOR_MAP[scoreColor(clamped)];
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;
  const trackColor = forceLightTrack ? "#e5e5e5" : "#222222";
  const valueColor = forceLightTrack ? "#0a0a0a" : "#ffffff";
  const labelColor = forceLightTrack ? "#6b7280" : "#6b7280";

  return (
    <div
      className="relative"
      style={{ width: SIZE, height: SIZE }}
      role="img"
      aria-label={`Overall score ${clamped} out of 100`}
    >
      <svg width={SIZE} height={SIZE}>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={trackColor}
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ color: valueColor }}
      >
        <span className="font-mono text-5xl font-bold tracking-tight">{clamped}</span>
        <span className="font-mono text-xs uppercase tracking-widest" style={{ color: labelColor }}>
          / 100
        </span>
      </div>
    </div>
  );
}
