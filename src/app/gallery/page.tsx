"use client";

import { useCallback, useEffect, useState } from "react";
import JSZip from "jszip";
import AdminNav from "@/components/AdminNav";
import Lightbox from "@/components/Lightbox";
import { COUPLE_NAME } from "@/lib/config";
import type { MediaItem } from "@/lib/types";

export default function GalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/media", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load gallery");
      const json = await res.json();
      setMedia(json.media ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function downloadAll() {
    if (media.length === 0 || downloading) return;
    setDownloading(true);
    setDownloadMsg("Preparing ZIP…");
    try {
      const zip = new JSZip();
      let i = 0;
      for (const item of media) {
        i++;
        setDownloadMsg(`Adding ${i} / ${media.length}…`);
        const res = await fetch(item.file_url);
        if (!res.ok) continue;
        const blob = await res.blob();
        const name = item.file_url.split("/").pop() || `file-${i}`;
        zip.file(name, blob);
      }
      setDownloadMsg("Zipping…");
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wedding-photos.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadMsg("");
    } catch {
      setDownloadMsg("Download failed — try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <AdminNav active="/gallery" />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-script text-5xl text-sage-dark">
              {COUPLE_NAME}
            </h1>
            <p className="text-stone-600">
              {media.length} {media.length === 1 ? "memory" : "memories"} shared
            </p>
          </div>
          <button
            onClick={downloadAll}
            disabled={downloading || media.length === 0}
            className="rounded-full bg-blush px-5 py-2 text-cream transition-colors hover:bg-blush-dark disabled:opacity-50"
          >
            {downloading ? downloadMsg || "Working…" : "Download all"}
          </button>
        </div>

        {loading && <p className="text-stone-500">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && media.length === 0 && (
          <p className="text-stone-500">
            No photos yet — they&apos;ll appear here as guests upload.
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {media.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setLightbox(i)}
              className="group relative aspect-square overflow-hidden rounded-lg bg-stone-200"
            >
              {item.file_type === "video" ? (
                <>
                  <video
                    src={item.file_url}
                    className="h-full w-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-4xl text-white/90 drop-shadow">
                    ▶
                  </span>
                </>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.file_url}
                  alt={item.uploader_name || "Wedding photo"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              )}
            </button>
          ))}
        </div>
      </main>

      {lightbox !== null && (
        <Lightbox
          items={media}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNavigate={(i) => setLightbox(i)}
        />
      )}
    </div>
  );
}
