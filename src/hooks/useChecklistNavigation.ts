import { useCallback, useMemo, useState } from "react";
import { CHECKLIST, TOTAL_QUESTIONS } from "@/constants/checklist";
import { useDevcheckStore } from "@/store/devcheckStore";

export interface ChecklistNavigation {
  stepIndex: number;
  totalSteps: number;
  category: (typeof CHECKLIST)[number];
  isFirst: boolean;
  isLast: boolean;
  answeredCount: number;
  progressPct: number;
  next: () => void;
  back: () => void;
}

export function useChecklistNavigation(): ChecklistNavigation {
  const [stepIndex, setStepIndex] = useState(0);
  const answers = useDevcheckStore((state) => state.answers);

  const category = CHECKLIST[stepIndex];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progressPct = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  const next = useCallback(() => {
    setStepIndex((current) => Math.min(current + 1, CHECKLIST.length - 1));
  }, []);
  const back = useCallback(() => {
    setStepIndex((current) => Math.max(current - 1, 0));
  }, []);

  return {
    stepIndex,
    totalSteps: CHECKLIST.length,
    category,
    isFirst: stepIndex === 0,
    isLast: stepIndex === CHECKLIST.length - 1,
    answeredCount,
    progressPct,
    next,
    back,
  };
}
