"use client";

import { useMemo, useState } from "react";
import { useLibrary } from "@/lib/storage";
import { runAi } from "@/lib/ai";
import type { Block } from "@/lib/types";

interface Props {
  onClose: () => void;
  /** Insert a block's content directly as a new section. */
  onInsertBlock: (block: Block) => void;
  /** Insert an AI-drafted section: (heading, content). */
  onInsertDraft: (heading: string, content: string) => void;
}

type Tab = "insert" | "draft";

export function LibraryPicker({ onClose, onInsertBlock, onInsertDraft }: Props) {
  const { blocks } = useLibrary();
  const [tab, setTab] = useState<Tab>("insert");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blocks
      .filter((b) => {
        if (!q) return true;
        return (
          b.title.toLowerCase().includes(q) ||
          b.content.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => b.timesUsed - a.timesUsed || b.updatedAt - a.updatedAt);
  }, [blocks, query]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function generate() {
    if (!question.trim()) {
      setNote("Type the requirement or question you're answering.");
      return;
    }
    const context = blocks
      .filter((b) => selected.has(b.id))
      .map((b) => `## ${b.title}\n${b.content}`)
      .join("\n\n");
    setBusy(true);
    setNote(null);
    setDraft(null);
    const res = await runAi({
      task: "draft",
      text: question,
      instruction: question,
      context,
    });
    setBusy(false);
    if (res.ok && res.result) setDraft(res.result);
    else setNote(res.message || "The draft could not be generated.");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-ink/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card my-8 flex w-full max-w-2xl flex-col animate-fadeIn p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1 rounded-lg bg-paper p-1">
            <TabBtn active={tab === "insert"} onClick={() => setTab("insert")}>
              Insert block
            </TabBtn>
            <TabBtn active={tab === "draft"} onClick={() => setTab("draft")}>
              ✨ AI draft
            </TabBtn>
          </div>
          <button className="btn-ghost btn-sm" onClick={onClose}>
            Close
          </button>
        </div>

        {tab === "draft" && (
          <div className="mb-3">
            <label className="label">Requirement / question to answer</label>
            <textarea
              className="field min-h-[70px] resize-y"
              placeholder="e.g. Describe your approach to managing health & safety on site."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <p className="mt-1 text-xs text-mist">
              Tick the library blocks below to use as source material, then
              generate a tailored draft.
            </p>
          </div>
        )}

        <input
          className="field mb-3"
          placeholder="Search library…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="max-h-72 space-y-2 overflow-auto pr-1">
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-mist">
              No library blocks found.
            </p>
          )}
          {filtered.map((b) => (
            <div
              key={b.id}
              className={`rounded-lg border p-3 transition ${
                tab === "draft" && selected.has(b.id)
                  ? "border-accent bg-accent-soft/40"
                  : "border-line bg-surface"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="chip mb-1 border-transparent bg-paper text-mist">
                    {b.category}
                  </span>
                  <p className="truncate font-medium text-ink">{b.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-mist">
                    {b.content}
                  </p>
                </div>
                {tab === "insert" ? (
                  <button
                    className="btn-accent btn-sm shrink-0"
                    onClick={() => onInsertBlock(b)}
                  >
                    Insert
                  </button>
                ) : (
                  <label className="flex shrink-0 items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-accent"
                      checked={selected.has(b.id)}
                      onChange={() => toggle(b.id)}
                    />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>

        {note && (
          <p className="mt-3 rounded-lg bg-accent-soft px-3 py-2 text-xs text-accent-dark">
            {note}
          </p>
        )}

        {tab === "draft" && (
          <div className="mt-4 border-t border-line pt-4">
            {draft === null ? (
              <button
                className="btn-accent"
                disabled={busy}
                onClick={generate}
              >
                {busy
                  ? "Drafting…"
                  : `Draft answer${
                      selected.size ? ` from ${selected.size} block(s)` : ""
                    }`}
              </button>
            ) : (
              <div className="animate-fadeIn">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent-dark">
                  Draft
                </p>
                <div className="max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-paper p-3 text-sm leading-relaxed">
                  {draft}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    className="btn-accent btn-sm"
                    onClick={() =>
                      onInsertDraft(question.trim() || "Drafted section", draft)
                    }
                  >
                    Add as section
                  </button>
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => setDraft(null)}
                  >
                    Redo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
        active ? "bg-surface text-ink shadow-sm" : "text-mist hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
