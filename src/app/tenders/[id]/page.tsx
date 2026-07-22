"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getTender,
  useTenders,
  useLibrary,
  newSection,
} from "@/lib/storage";
import type { Tender, TenderSection, TenderStatus, Block } from "@/lib/types";
import { AiAssist } from "@/components/AiAssist";
import { LibraryPicker } from "@/components/LibraryPicker";
import { downloadTenderDocx } from "@/lib/docxExport";

const STATUSES: TenderStatus[] = [
  "draft",
  "in-progress",
  "submitted",
  "won",
  "lost",
];
const STATUS_LABEL: Record<TenderStatus, string> = {
  draft: "Draft",
  "in-progress": "In progress",
  submitted: "Submitted",
  won: "Won",
  lost: "Lost",
};

export default function TenderEditor() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { updateTender } = useTenders();
  const { incrementUse } = useLibrary();

  const [tender, setTender] = useState<Tender | null | undefined>(undefined);
  const [showPicker, setShowPicker] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTender(getTender(params.id) ?? null);
  }, [params.id]);

  function patch(next: Partial<Tender>) {
    setTender((cur) => {
      if (!cur) return cur;
      const merged = { ...cur, ...next };
      updateTender(cur.id, next);
      return merged;
    });
    setSaved(true);
    window.clearTimeout((patch as any)._t);
    (patch as any)._t = window.setTimeout(() => setSaved(false), 1200);
  }

  function updateSection(id: string, next: Partial<TenderSection>) {
    if (!tender) return;
    patch({
      sections: tender.sections.map((s) =>
        s.id === id ? { ...s, ...next } : s
      ),
    });
  }

  function removeSection(id: string) {
    if (!tender) return;
    patch({ sections: tender.sections.filter((s) => s.id !== id) });
  }

  function moveSection(index: number, dir: -1 | 1) {
    if (!tender) return;
    const arr = [...tender.sections];
    const j = index + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[index], arr[j]] = [arr[j], arr[index]];
    patch({ sections: arr });
  }

  function addBlankSection() {
    if (!tender) return;
    patch({ sections: [...tender.sections, newSection()] });
  }

  function insertBlock(block: Block) {
    if (!tender) return;
    incrementUse(block.id);
    patch({
      sections: [
        ...tender.sections,
        newSection({
          heading: block.title,
          content: block.content,
          sourceBlockId: block.id,
        }),
      ],
    });
    setShowPicker(false);
  }

  function insertDraft(heading: string, content: string) {
    if (!tender) return;
    patch({
      sections: [...tender.sections, newSection({ heading, content })],
    });
    setShowPicker(false);
  }

  async function copyAll() {
    if (!tender) return;
    const text = tender.sections
      .map((s, i) => `${i + 1}. ${s.heading}\n\n${s.content}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    } catch {
      /* ignore */
    }
  }

  if (tender === undefined) {
    return <p className="text-mist">Loading…</p>;
  }
  if (tender === null) {
    return (
      <div className="card p-10 text-center">
        <p className="text-mist">That tender could not be found.</p>
        <Link href="/tenders" className="mt-3 inline-block text-accent hover:underline">
          ← Back to tenders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <Link href="/tenders" className="text-sm text-mist hover:text-ink">
          ← All tenders
        </Link>
        <span className="text-xs text-moss">{saved ? "Saved ✓" : ""}</span>
      </div>

      {/* Header / metadata */}
      <div className="card p-5">
        <input
          className="w-full border-none bg-transparent font-display text-2xl font-semibold text-ink outline-none placeholder:text-mist"
          value={tender.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Tender title"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label">Client</label>
            <input
              className="field"
              value={tender.client}
              onChange={(e) => patch({ client: e.target.value })}
              placeholder="Client / buyer"
            />
          </div>
          <div>
            <label className="label">Reference</label>
            <input
              className="field"
              value={tender.reference}
              onChange={(e) => patch({ reference: e.target.value })}
              placeholder="Tender ref."
            />
          </div>
          <div>
            <label className="label">Due date</label>
            <input
              type="date"
              className="field"
              value={tender.dueDate}
              onChange={(e) => patch({ dueDate: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="field"
              value={tender.status}
              onChange={(e) =>
                patch({ status: e.target.value as TenderStatus })
              }
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3">
          <label className="label">Notes (not exported)</label>
          <textarea
            className="field min-h-[60px] resize-y"
            value={tender.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            placeholder="Reminders, evaluation criteria, word limits…"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button className="btn-accent" onClick={() => setShowPicker(true)}>
          + Add from library
        </button>
        <button className="btn-ghost" onClick={addBlankSection}>
          + Blank section
        </button>
        <div className="flex-1" />
        <button className="btn-ghost" onClick={copyAll}>
          Copy all text
        </button>
        <button
          className="btn-primary"
          onClick={() => downloadTenderDocx(tender)}
        >
          Export to Word
        </button>
      </div>

      {/* Sections */}
      {tender.sections.length === 0 ? (
        <div className="card p-10 text-center text-mist">
          No sections yet. Add one from your library or start a blank section.
        </div>
      ) : (
        <div className="space-y-4">
          {tender.sections.map((s, i) => (
            <div key={s.id} className="card p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-paper text-sm font-semibold text-mist">
                  {i + 1}
                </span>
                <input
                  className="flex-1 border-none bg-transparent font-medium text-ink outline-none"
                  value={s.heading}
                  onChange={(e) =>
                    updateSection(s.id, { heading: e.target.value })
                  }
                  placeholder="Section heading"
                />
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    className="btn-ghost btn-sm px-2"
                    disabled={i === 0}
                    onClick={() => moveSection(i, -1)}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    className="btn-ghost btn-sm px-2"
                    disabled={i === tender.sections.length - 1}
                    onClick={() => moveSection(i, 1)}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    className="btn-ghost btn-sm px-2 text-accent-dark"
                    onClick={() => removeSection(s.id)}
                    aria-label="Delete section"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <textarea
                className="field mt-3 min-h-[160px] resize-y leading-relaxed"
                value={s.content}
                onChange={(e) =>
                  updateSection(s.id, { content: e.target.value })
                }
                placeholder="Write this section, or drop in a library block…"
              />
              <AiAssist
                value={s.content}
                onApply={(text) => updateSection(s.id, { content: text })}
                compact
              />
            </div>
          ))}
        </div>
      )}

      {showPicker && (
        <LibraryPicker
          onClose={() => setShowPicker(false)}
          onInsertBlock={insertBlock}
          onInsertDraft={insertDraft}
        />
      )}
    </div>
  );
}
