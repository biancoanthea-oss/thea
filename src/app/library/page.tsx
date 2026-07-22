"use client";

import { useMemo, useState } from "react";
import { useLibrary } from "@/lib/storage";
import { BlockEditor } from "@/components/BlockEditor";
import type { Block } from "@/lib/types";

export default function LibraryPage() {
  const { blocks, saveBlock, deleteBlock } = useLibrary();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [editing, setEditing] = useState<Block | null | undefined>(undefined);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    blocks.forEach((b) => set.add(b.category));
    return Array.from(set).sort();
  }, [blocks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blocks
      .filter((b) => (activeCat ? b.category === activeCat : true))
      .filter((b) => {
        if (!q) return true;
        return (
          b.title.toLowerCase().includes(q) ||
          b.content.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [blocks, query, activeCat]);

  async function copy(block: Block) {
    try {
      await navigator.clipboard.writeText(block.content);
      setCopiedId(block.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* clipboard may be unavailable */
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Content Library
          </h1>
          <p className="mt-1 text-mist">
            Your reusable tender building blocks. Search, refine and drop them
            into new bids.
          </p>
        </div>
        <button className="btn-accent" onClick={() => setEditing(null)}>
          + New block
        </button>
      </div>

      <div className="card p-4">
        <input
          className="field"
          placeholder="Search titles, content or tags…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          <FilterChip
            active={activeCat === null}
            onClick={() => setActiveCat(null)}
          >
            All ({blocks.length})
          </FilterChip>
          {categories.map((c) => (
            <FilterChip
              key={c}
              active={activeCat === c}
              onClick={() => setActiveCat(c)}
            >
              {c}
            </FilterChip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-mist">
          {blocks.length === 0
            ? "Your library is empty. Add your first reusable block to get started."
            : "No blocks match your search."}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((b) => (
            <article key={b.id} className="card flex flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="chip mb-1 border-transparent bg-accent-soft text-accent-dark">
                    {b.category}
                  </span>
                  <h3 className="font-medium text-ink">{b.title}</h3>
                </div>
                {b.timesUsed > 0 && (
                  <span className="chip shrink-0">used ×{b.timesUsed}</span>
                )}
              </div>

              <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-ink/80">
                {b.content || <span className="text-mist">No content yet.</span>}
              </p>

              {b.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {b.tags.map((t) => (
                    <span key={t} className="chip">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                <button className="btn-ghost btn-sm" onClick={() => copy(b)}>
                  {copiedId === b.id ? "Copied ✓" : "Copy"}
                </button>
                <button className="btn-ghost btn-sm" onClick={() => setEditing(b)}>
                  Edit
                </button>
                <button
                  className="btn-ghost btn-sm text-accent-dark"
                  onClick={() => {
                    if (window.confirm(`Delete “${b.title}”?`)) deleteBlock(b.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing !== undefined && (
        <BlockEditor
          initial={editing}
          onClose={() => setEditing(undefined)}
          onSave={(data) => {
            saveBlock(data);
            setEditing(undefined);
          }}
        />
      )}
    </div>
  );
}

function FilterChip({
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
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-ink text-white"
          : "border border-line bg-paper text-mist hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
