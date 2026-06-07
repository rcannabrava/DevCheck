export type AnswerValue = "yes" | "partial" | "no";

export interface ChecklistQuestion {
  id: string;
  text: string;
  tip: string;
}

export interface ChecklistCategory {
  id: string;
  name: string;
  description: string;
  questions: ChecklistQuestion[];
}

export type ChecklistAnswers = Record<string, AnswerValue>;

export interface CategoryScore {
  categoryId: string;
  categoryName: string;
  score: number;
  answered: number;
  total: number;
}

export interface ScoreResult {
  overall: number;
  byCategory: CategoryScore[];
}

export interface ImprovementTip {
  categoryName: string;
  questionText: string;
  tip: string;
  severity: "partial" | "missing";
}

export interface GithubRepoData {
  owner: string;
  repo: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  lastPush: string | null;
  hasReadme: boolean;
  license: string | null;
  topics: readonly string[];
  hasWorkflows: boolean;
}

export interface HistoryEntry {
  id: string;
  projectName: string;
  createdAt: string;
  overall: number;
  answers: ChecklistAnswers;
  byCategory: CategoryScore[];
  diagnosis: string;
}
