"use client";

import { useEffect } from "react";
import type { MediaItem } from "@/lib/types";

export default function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const item = items[index];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % items.length);
      if (e.key === "ArrowLeft")
        onNavigate((index - 1 + items.length) % items.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onNavigate]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        className="absolute right-4 top-4 text-3xl text-white/80 hover:text-white"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>
      <button
        className="absolute left-2 text-4xl text-white/70 hover:text-white sm:left-6"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index - 1 + items.length) % items.length);
        }}
        aria-label="Previous"
      >
        ‹
      </button>
      <div
        className="max-h-[85vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {item.file_type === "video" ? (
          <video
            src={item.file_url}
            controls
            autoPlay
            className="max-h-[85vh] max-w-[90vw] rounded-lg"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.file_url}
            alt={item.uploader_name || "Wedding photo"}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
          />
        )}
        {item.uploader_name && (
          <p className="mt-2 text-center text-sm text-white/70">
            Shared by {item.uploader_name}
          </p>
        )}
      </div>
      <button
        className="absolute right-2 text-4xl text-white/70 hover:text-white sm:right-6"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index + 1) % items.length);
        }}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}
