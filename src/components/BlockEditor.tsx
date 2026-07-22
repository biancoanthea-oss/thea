"use client";

import { useEffect, useState } from "react";
import type { Block } from "@/lib/types";
import { CATEGORIES } from "@/lib/seed";
import { AiAssist } from "@/components/AiAssist";

interface Props {
  initial?: Block | null;
  onClose: () => void;
  onSave: (data: Partial<Block> & { id?: string }) => void;
}

export function BlockEditor({ initial, onClose, onSave }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [content, setContent] = useState(initial?.content ?? "");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function save() {
    onSave({
      id: initial?.id,
      title: title.trim() || "Untitled block",
      category,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      content,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-ink/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card my-8 w-full max-w-2xl animate-fadeIn p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">
            {initial ? "Edit block" : "New library block"}
          </h2>
          <button className="btn-ghost btn-sm" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input
              className="field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Health & safety commitment"
              autoFocus
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Category</label>
              <input
                className="field"
                list="category-options"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <datalist id="category-options">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="label">Tags (comma-separated)</label>
              <input
                className="field"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ISO 9001, quality, boilerplate"
              />
            </div>
          </div>

          <div>
            <label className="label">Content</label>
            <textarea
              className="field min-h-[220px] resize-y leading-relaxed"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or write the reusable text here…"
            />
            <AiAssist value={content} onApply={setContent} compact />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-accent" onClick={save}>
            {initial ? "Save changes" : "Add to library"}
          </button>
        </div>
      </div>
    </div>
  );
}
