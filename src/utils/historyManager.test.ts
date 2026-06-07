import { beforeEach, describe, expect, it } from "vitest";
import { HISTORY_KEY, clearHistory, loadHistory, saveHistoryEntry } from "./historyManager";
import type { HistoryEntry } from "@/types";

function makeEntry(overrides: Partial<HistoryEntry> = {}): HistoryEntry {
  return {
    id: "abc",
    projectName: "proj",
    createdAt: new Date("2024-01-01").toISOString(),
    overall: 72,
    answers: { "tests-unit": "yes" },
    byCategory: [],
    diagnosis: "ok",
    ...overrides,
  };
}

describe("historyManager", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns an empty array when nothing is stored", () => {
    expect(loadHistory()).toEqual([]);
  });

  it("saves and retrieves entries newest-first", () => {
    saveHistoryEntry(makeEntry({ id: "1", projectName: "first" }));
    saveHistoryEntry(makeEntry({ id: "2", projectName: "second" }));
    const history = loadHistory();
    expect(history.map((entry) => entry.id)).toEqual(["2", "1"]);
  });

  it("ignores corrupted storage", () => {
    window.localStorage.setItem(HISTORY_KEY, "not-json");
    expect(loadHistory()).toEqual([]);
  });

  it("clears history", () => {
    saveHistoryEntry(makeEntry());
    clearHistory();
    expect(loadHistory()).toEqual([]);
  });
});
