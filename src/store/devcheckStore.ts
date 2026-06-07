import { create } from "zustand";
import type { AnswerValue, ChecklistAnswers, GithubRepoData, HistoryEntry } from "@/types";
import { loadHistory, saveHistoryEntry, clearHistory } from "@/utils/historyManager";
import { buildDiagnosis, buildImprovementTips, calculateScore } from "@/utils/scoreCalculator";

interface DevcheckState {
  projectName: string;
  githubUrl: string;
  repoData: GithubRepoData | null;
  prefilledQuestionIds: string[];
  answers: ChecklistAnswers;
  history: HistoryEntry[];
  setProjectName: (value: string) => void;
  setGithubUrl: (value: string) => void;
  applyRepoData: (data: GithubRepoData, prefilled: ChecklistAnswers) => void;
  clearRepoData: () => void;
  setAnswer: (questionId: string, value: AnswerValue) => void;
  resetEvaluation: () => void;
  commitToHistory: () => HistoryEntry | null;
  refreshHistory: () => void;
  removeAllHistory: () => void;
}

export const useDevcheckStore = create<DevcheckState>((set, get) => ({
  projectName: "",
  githubUrl: "",
  repoData: null,
  prefilledQuestionIds: [],
  answers: {},
  history: loadHistory(),

  setProjectName: (value) => set({ projectName: value }),
  setGithubUrl: (value) => set({ githubUrl: value }),

  applyRepoData: (data, prefilled) =>
    set((state) => ({
      repoData: data,
      prefilledQuestionIds: Object.keys(prefilled),
      answers: { ...state.answers, ...prefilled },
    })),

  clearRepoData: () => set({ repoData: null, prefilledQuestionIds: [] }),

  setAnswer: (questionId, value) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: value } })),

  resetEvaluation: () =>
    set({
      projectName: "",
      githubUrl: "",
      repoData: null,
      prefilledQuestionIds: [],
      answers: {},
    }),

  commitToHistory: () => {
    const { projectName, answers } = get();
    const trimmed = projectName.trim();
    if (!trimmed) return null;
    const score = calculateScore(answers);
    const entry: HistoryEntry = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      projectName: trimmed,
      createdAt: new Date().toISOString(),
      overall: score.overall,
      answers,
      byCategory: score.byCategory,
      diagnosis: buildDiagnosis(trimmed, score),
    };
    const next = saveHistoryEntry(entry);
    set({ history: next });
    return entry;
  },

  refreshHistory: () => set({ history: loadHistory() }),

  removeAllHistory: () => {
    clearHistory();
    set({ history: [] });
  },
}));

export function getDerivedResults(answers: ChecklistAnswers, projectName: string) {
  const score = calculateScore(answers);
  return {
    score,
    diagnosis: buildDiagnosis(projectName || "This project", score),
    tips: buildImprovementTips(answers),
  };
}
