"use client";

import { useState } from "react";
import { runAi, type AiTask } from "@/lib/ai";

interface Props {
  /** Current text to operate on. */
  value: string;
  /** Called when the user accepts an AI suggestion. */
  onApply: (text: string) => void;
  /** Optional context (e.g. library material) for drafting. */
  context?: string;
  compact?: boolean;
}

const QUICK: { task: AiTask; label: string }[] = [
  { task: "improve", label: "Improve" },
  { task: "formal", label: "More formal" },
  { task: "concise", label: "Shorten" },
  { task: "expand", label: "Expand" },
];

export function AiAssist({ value, onApply, context, compact }: Props) {
  const [busy, setBusy] = useState<AiTask | null>(null);
  const [tailorFor, setTailorFor] = useState("");
  const [showTailor, setShowTailor] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function go(task: AiTask, instruction?: string) {
    if (!value.trim() && task !== "draft") {
      setNote("Write something first, then let AI polish it.");
      return;
    }
    setBusy(task);
    setNote(null);
    setSuggestion(null);
    const res = await runAi({ task, text: value, instruction, context });
    setBusy(null);
    if (res.ok && res.result) {
      setSuggestion(res.result);
    } else {
      setNote(res.message || "Something went wrong.");
    }
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-accent">
          ✨ AI
        </span>
        {QUICK.map((q) => (
          <button
            key={q.task}
            type="button"
            className="btn-ghost btn-sm"
            disabled={busy !== null}
            onClick={() => go(q.task)}
          >
            {busy === q.task ? "Working…" : q.label}
          </button>
        ))}
        <button
          type="button"
          className="btn-ghost btn-sm"
          disabled={busy !== null}
          onClick={() => setShowTailor((s) => !s)}
        >
          Tailor to client…
        </button>
      </div>

      {showTailor && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            className="field max-w-xs"
            placeholder="e.g. NHS Trust, focus on infection control"
            value={tailorFor}
            onChange={(e) => setTailorFor(e.target.value)}
          />
          <button
            type="button"
            className="btn-accent btn-sm"
            disabled={busy !== null}
            onClick={() => go("tailor", tailorFor)}
          >
            {busy === "tailor" ? "Tailoring…" : "Tailor"}
          </button>
        </div>
      )}

      {note && (
        <p className="mt-2 rounded-lg bg-accent-soft px-3 py-2 text-xs text-accent-dark">
          {note}
        </p>
      )}

      {suggestion !== null && (
        <div className="mt-2 rounded-lg border border-accent/30 bg-accent-soft/40 p-3 animate-fadeIn">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent-dark">
            AI suggestion
          </p>
          <div
            className={`whitespace-pre-wrap rounded-md bg-surface p-3 text-sm leading-relaxed text-ink ${
              compact ? "max-h-48 overflow-auto" : ""
            }`}
          >
            {suggestion}
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              className="btn-accent btn-sm"
              onClick={() => {
                onApply(suggestion);
                setSuggestion(null);
              }}
            >
              Use this
            </button>
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => setSuggestion(null)}
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
