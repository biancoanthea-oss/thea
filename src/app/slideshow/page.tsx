"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { COUPLE_NAME } from "@/lib/config";
import type { MediaItem } from "@/lib/types";

const ADVANCE_MS = 6000; // time each photo is shown
const REFRESH_MS = 20000; // pull in new uploads

export default function SlideshowPage() {
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const photosRef = useRef<MediaItem[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/media", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      // Slideshow shows photos only; videos are skipped for smooth projection.
      const imgs: MediaItem[] = (json.media ?? []).filter(
        (m: MediaItem) => m.file_type === "image",
      );
      // Oldest → newest feels nicer for a reception montage.
      imgs.reverse();
      photosRef.current = imgs;
      setPhotos(imgs);
    } catch {
      /* keep showing what we have */
    }
  }, []);

  useEffect(() => {
    load();
    const refresh = setInterval(load, REFRESH_MS);
    return () => clearInterval(refresh);
  }, [load]);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => {
        const n = photosRef.current.length;
        return n === 0 ? 0 : (c + 1) % n;
      });
    }, ADVANCE_MS);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  function goFullscreen() {
    document.documentElement.requestFullscreen?.().catch(() => {});
  }

  return (
    <div
      onClick={goFullscreen}
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black"
    >
      {photos.length === 0 && (
        <div className="text-center text-cream">
          <h1 className="font-script text-6xl">{COUPLE_NAME}</h1>
          <p className="mt-3 text-stone-400">
            Photos will appear here as guests upload them…
          </p>
        </div>
      )}

      {photos.map((p, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={p.id}
          src={p.file_url}
          alt=""
          className="absolute inset-0 m-auto max-h-screen max-w-screen object-contain transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}

      {photos.length > 0 && (
        <div className="pointer-events-none absolute bottom-6 left-0 right-0 text-center">
          <span className="font-script text-4xl text-cream/90 drop-shadow-lg">
            {COUPLE_NAME}
          </span>
        </div>
      )}

      {showHint && (
        <div className="absolute right-4 top-4 flex gap-3 text-sm text-cream/60">
          <span>Tap for fullscreen</span>
          <Link href="/gallery" className="underline hover:text-cream">
            Gallery
          </Link>
        </div>
      )}
    </div>
  );
}
