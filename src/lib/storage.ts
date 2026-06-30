// Saved shopping lists live in the browser — no account or database needed.

import type { ExtractionResult, SavedList } from "@/lib/types";

const KEY = "recipe-shopping-lists/v1";

function read(): SavedList[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedList[]) : [];
  } catch {
    return [];
  }
}

function write(lists: SavedList[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(lists));
}

export function getSavedLists(): SavedList[] {
  return read().sort((a, b) => b.savedAt - a.savedAt);
}

export function saveList(result: ExtractionResult, checked: boolean[]): SavedList {
  const entry: SavedList = {
    ...result,
    checked,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    savedAt: Date.now(),
  };
  write([entry, ...read()]);
  return entry;
}

export function updateChecked(id: string, checked: boolean[]): void {
  write(read().map((l) => (l.id === id ? { ...l, checked } : l)));
}

export function deleteList(id: string): void {
  write(read().filter((l) => l.id !== id));
}
