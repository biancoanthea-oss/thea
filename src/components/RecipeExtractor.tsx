"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  encodeImageFile,
  extractVideoFrames,
  type EncodedImage,
} from "@/lib/media";
import {
  deleteList,
  getSavedLists,
  saveList,
  updateChecked,
} from "@/lib/storage";
import type { ExtractionResult, SavedList } from "@/lib/types";
import ShoppingList from "@/components/ShoppingList";

type Source = {
  id: string;
  label: string;
  kind: "image" | "video";
  images: EncodedImage[];
};

function rid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function RecipeExtractor() {
  const [sources, setSources] = useState<Source[]>([]);
  const [caption, setCaption] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [busy, setBusy] = useState<string | null>(null); // status text while reading files
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [justSaved, setJustSaved] = useState(false);

  const [saved, setSaved] = useState<SavedList[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSaved(getSavedLists());
  }, []);

  const allImages = sources.flatMap((s) => s.images);
  const canSubmit = (allImages.length > 0 || caption.trim().length > 0) && !loading;

  const addFiles = useCallback(async (files: FileList | File[]) => {
    setError(null);
    const arr = Array.from(files);
    for (const file of arr) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      if (!isImage && !isVideo) continue;
      try {
        if (isVideo) {
          setBusy(`Reading frames from ${file.name}…`);
          const images = await extractVideoFrames(file);
          if (images.length === 0) throw new Error("No frames could be read.");
          setSources((prev) => [
            ...prev,
            { id: rid(), label: file.name, kind: "video", images },
          ]);
        } else {
          setBusy(`Adding ${file.name}…`);
          const image = await encodeImageFile(file);
          setSources((prev) => [
            ...prev,
            { id: rid(), label: file.name, kind: "image", images: [image] },
          ]);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "That file couldn't be added.");
      }
    }
    setBusy(null);
  }, []);

  const removeSource = (id: string) =>
    setSources((prev) => prev.filter((s) => s.id !== id));

  const submit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setJustSaved(false);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          images: allImages.map(({ mediaType, data }) => ({ mediaType, data })),
          caption: caption.trim(),
          sourceUrl: sourceUrl.trim(),
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error ?? "Something went wrong.");
      const data = payload as ExtractionResult;
      setResult(data);
      setChecked(new Array(data.ingredients.length).fill(false));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSources([]);
    setCaption("");
    setSourceUrl("");
    setResult(null);
    setChecked([]);
    setError(null);
    setJustSaved(false);
  };

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });

  const onSave = () => {
    if (!result) return;
    saveList(result, checked);
    setSaved(getSavedLists());
    setJustSaved(true);
  };

  // ---- Saved-list interactions ----
  const toggleSaved = (list: SavedList, i: number) => {
    const next = [...list.checked];
    next[i] = !next[i];
    updateChecked(list.id, next);
    setSaved((prev) =>
      prev.map((l) => (l.id === list.id ? { ...l, checked: next } : l)),
    );
  };
  const removeSaved = (id: string) => {
    deleteList(id);
    setSaved(getSavedLists());
  };

  return (
    <div className="space-y-8">
      {/* Input card */}
      <section className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-herb/10 sm:p-6">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
          }
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files) void addFiles(e.dataTransfer.files);
          }}
          className="cursor-pointer rounded-xl border-2 border-dashed border-herb/40 bg-herb/5 p-8 text-center transition hover:bg-herb/10"
        >
          <div className="text-4xl">🍳</div>
          <p className="mt-2 text-lg font-medium text-herb-dark">
            Add a recipe video or screenshot
          </p>
          <p className="mt-1 text-sm text-stone-500">
            Tap to choose, or drop files here. Videos are scanned frame by frame.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) void addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {busy && (
          <p className="mt-3 text-sm text-carrot" aria-live="polite">
            {busy}
          </p>
        )}

        {sources.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-3">
            {sources.map((s) => (
              <li
                key={s.id}
                className="group relative overflow-hidden rounded-lg ring-1 ring-stone-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.images[0].preview}
                  alt={s.label}
                  className="h-20 w-20 object-cover"
                />
                {s.kind === "video" && (
                  <span className="absolute bottom-0 left-0 right-0 bg-black/55 px-1 py-0.5 text-center text-[10px] text-white">
                    🎬 {s.images.length} frames
                  </span>
                )}
                <button
                  onClick={() => removeSource(s.id)}
                  aria-label={`Remove ${s.label}`}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/55 text-xs text-white opacity-0 transition group-hover:opacity-100"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 space-y-3">
          <div>
            <label className="text-sm font-medium text-stone-600">
              Recipe caption or text{" "}
              <span className="font-normal text-stone-400">(optional)</span>
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              placeholder="Paste the video caption or any written ingredients here — it helps accuracy."
              className="mt-1 w-full resize-y rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-herb focus:ring-2 focus:ring-herb/20"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-stone-600">
              Source link{" "}
              <span className="font-normal text-stone-400">(optional)</span>
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://…  (where you found the recipe)"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-herb focus:ring-2 focus:ring-herb/20"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="rounded-full bg-herb px-6 py-3 font-medium text-white shadow-sm transition hover:bg-herb-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Reading the recipe…" : "Get my shopping list"}
          </button>
          {(sources.length > 0 || caption || result) && (
            <button
              onClick={reset}
              className="text-sm text-stone-500 underline-offset-2 hover:underline"
            >
              Start over
            </button>
          )}
        </div>
      </section>

      {/* Result */}
      {result && (
        <ShoppingList
          result={result}
          checked={checked}
          onToggle={toggle}
          actions={
            <button
              onClick={onSave}
              disabled={justSaved}
              className="rounded-full bg-carrot/15 px-4 py-2 text-sm font-medium text-carrot transition hover:bg-carrot/25 disabled:opacity-60"
            >
              {justSaved ? "✓ Saved" : "Save list"}
            </button>
          }
        />
      )}

      {/* Saved lists */}
      {saved.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-xl text-herb-dark">
            Saved lists
          </h2>
          <div className="space-y-6">
            {saved.map((list) => (
              <ShoppingList
                key={list.id}
                result={list}
                checked={list.checked}
                onToggle={(i) => toggleSaved(list, i)}
                actions={
                  <button
                    onClick={() => removeSaved(list.id)}
                    className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-500 transition hover:bg-stone-200"
                  >
                    Delete
                  </button>
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
