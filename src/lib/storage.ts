"use client";

import { useEffect, useState, useCallback } from "react";
import type { Block, Tender, StudioData, TenderSection } from "./types";
import { seedBlocks } from "./seed";

const BLOCKS_KEY = "tender-studio:blocks:v1";
const TENDERS_KEY = "tender-studio:tenders:v1";
const SEEDED_KEY = "tender-studio:seeded:v1";

export function uid() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

// --- low-level read/write ---------------------------------------------------

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  // Notify listeners in this tab (storage event only fires cross-tab).
  window.dispatchEvent(new CustomEvent("tender-studio:change", { detail: key }));
}

function loadBlocks(): Block[] {
  // Seed the library once, on first ever load.
  if (typeof window !== "undefined" && !window.localStorage.getItem(SEEDED_KEY)) {
    const seeded = seedBlocks();
    write(BLOCKS_KEY, seeded);
    window.localStorage.setItem(SEEDED_KEY, "1");
    return seeded;
  }
  return read<Block[]>(BLOCKS_KEY, []);
}

// --- subscription hook ------------------------------------------------------

function useStore<T>(key: string, loader: () => T): [T, () => void] {
  const [value, setValue] = useState<T>(loader);

  const refresh = useCallback(() => setValue(loader()), [loader]);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("tender-studio:change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("tender-studio:change", handler);
      window.removeEventListener("storage", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, refresh];
}

// --- Library (blocks) -------------------------------------------------------

export function useLibrary() {
  const [blocks] = useStore<Block[]>(BLOCKS_KEY, loadBlocks);

  const saveBlock = useCallback((input: Partial<Block> & { id?: string }) => {
    const all = read<Block[]>(BLOCKS_KEY, []);
    const now = Date.now();
    if (input.id) {
      const next = all.map((b) =>
        b.id === input.id ? { ...b, ...input, updatedAt: now } : b
      );
      write(BLOCKS_KEY, next);
      return input.id;
    }
    const block: Block = {
      id: uid(),
      title: input.title?.trim() || "Untitled block",
      category: input.category || "Company Overview",
      tags: input.tags || [],
      content: input.content || "",
      timesUsed: 0,
      createdAt: now,
      updatedAt: now,
    };
    write(BLOCKS_KEY, [block, ...all]);
    return block.id;
  }, []);

  const deleteBlock = useCallback((id: string) => {
    const all = read<Block[]>(BLOCKS_KEY, []);
    write(
      BLOCKS_KEY,
      all.filter((b) => b.id !== id)
    );
  }, []);

  const incrementUse = useCallback((id: string) => {
    const all = read<Block[]>(BLOCKS_KEY, []);
    write(
      BLOCKS_KEY,
      all.map((b) => (b.id === id ? { ...b, timesUsed: b.timesUsed + 1 } : b))
    );
  }, []);

  return { blocks, saveBlock, deleteBlock, incrementUse };
}

// --- Tenders ----------------------------------------------------------------

function loadTenders(): Tender[] {
  return read<Tender[]>(TENDERS_KEY, []);
}

export function useTenders() {
  const [tenders] = useStore<Tender[]>(TENDERS_KEY, loadTenders);

  const createTender = useCallback((partial?: Partial<Tender>) => {
    const all = read<Tender[]>(TENDERS_KEY, []);
    const now = Date.now();
    const tender: Tender = {
      id: uid(),
      title: partial?.title?.trim() || "Untitled tender",
      client: partial?.client || "",
      reference: partial?.reference || "",
      dueDate: partial?.dueDate || "",
      status: partial?.status || "draft",
      notes: partial?.notes || "",
      sections: partial?.sections || [],
      createdAt: now,
      updatedAt: now,
    };
    write(TENDERS_KEY, [tender, ...all]);
    return tender.id;
  }, []);

  const updateTender = useCallback((id: string, patch: Partial<Tender>) => {
    const all = read<Tender[]>(TENDERS_KEY, []);
    write(
      TENDERS_KEY,
      all.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t))
    );
  }, []);

  const deleteTender = useCallback((id: string) => {
    const all = read<Tender[]>(TENDERS_KEY, []);
    write(
      TENDERS_KEY,
      all.filter((t) => t.id !== id)
    );
  }, []);

  return { tenders, createTender, updateTender, deleteTender };
}

/** Read a single tender without subscribing (used inside the editor's initial load). */
export function getTender(id: string): Tender | undefined {
  return read<Tender[]>(TENDERS_KEY, []).find((t) => t.id === id);
}

export function newSection(partial?: Partial<TenderSection>): TenderSection {
  return {
    id: uid(),
    heading: partial?.heading || "New section",
    content: partial?.content || "",
    sourceBlockId: partial?.sourceBlockId,
  };
}

// --- Backup / restore -------------------------------------------------------

export function exportData(): StudioData {
  return {
    version: 1,
    blocks: read<Block[]>(BLOCKS_KEY, []),
    tenders: read<Tender[]>(TENDERS_KEY, []),
  };
}

export function importData(data: StudioData, mode: "replace" | "merge") {
  if (!data || data.version !== 1) throw new Error("Unrecognised backup file.");
  if (mode === "replace") {
    write(BLOCKS_KEY, data.blocks || []);
    write(TENDERS_KEY, data.tenders || []);
    return;
  }
  const blocks = read<Block[]>(BLOCKS_KEY, []);
  const tenders = read<Tender[]>(TENDERS_KEY, []);
  const blockIds = new Set(blocks.map((b) => b.id));
  const tenderIds = new Set(tenders.map((t) => t.id));
  write(BLOCKS_KEY, [
    ...blocks,
    ...(data.blocks || []).filter((b) => !blockIds.has(b.id)),
  ]);
  write(TENDERS_KEY, [
    ...tenders,
    ...(data.tenders || []).filter((t) => !tenderIds.has(t.id)),
  ]);
}
