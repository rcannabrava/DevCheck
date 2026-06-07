import type { HistoryEntry } from "@/types";

export const HISTORY_KEY = "devcheck_history";
const MAX_ENTRIES = 50;

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadHistory(): HistoryEntry[] {
  const storage = getStorage();
  if (!storage) return [];
  const raw = storage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryEntry);
  } catch {
    return [];
  }
}

export function saveHistoryEntry(entry: HistoryEntry): HistoryEntry[] {
  const storage = getStorage();
  if (!storage) return [];
  const existing = loadHistory();
  const next = [entry, ...existing].slice(0, MAX_ENTRIES);
  storage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function clearHistory(): void {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(HISTORY_KEY);
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.projectName === "string" &&
    typeof record.createdAt === "string" &&
    typeof record.overall === "number" &&
    typeof record.answers === "object" &&
    Array.isArray(record.byCategory)
  );
}