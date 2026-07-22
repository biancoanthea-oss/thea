"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import JSZip from "jszip";
import AdminNav from "@/components/AdminNav";
import Lightbox from "@/components/Lightbox";
import { COUPLE_NAME } from "@/lib/config";
import type { MediaItem } from "@/lib/types";

type Filter = "all" | "image" | "video";
type Sort = "newest" | "oldest";

const UNNAMED = "Unnamed guest";

function guestName(item: MediaItem) {
  return item.uploader_name?.trim() || UNNAMED;
}

// "Sarah & Tom" -> "sarah-tom", empty -> "unnamed-guest"
function folderName(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "unnamed-guest";
}

function fileExt(url: string) {
  const last = url.split("?")[0].split("/").pop() || "";
  return last.includes(".") ? last.split(".").pop() || "bin" : "bin";
}

export default function GalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [byGuest, setByGuest] = useState(false);

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

  const photoCount = useMemo(
    () => media.filter((m) => m.file_type === "image").length,
    [media],
  );
  const videoCount = media.length - photoCount;

  // Filtered + sorted (and optionally grouped by guest). `ordered` is the flat
  // list in display order, so lightbox indexes stay in sync with the grid.
  const groups = useMemo(() => {
    const filtered =
      filter === "all" ? media : media.filter((m) => m.file_type === filter);
    const sorted = [...filtered].sort((a, b) =>
      sort === "newest"
        ? b.created_at.localeCompare(a.created_at)
        : a.created_at.localeCompare(b.created_at),
    );
    if (!byGuest) return [{ name: null as string | null, items: sorted }];
    const map = new Map<string, MediaItem[]>();
    for (const item of sorted) {
      const name = guestName(item);
      const list = map.get(name);
      if (list) list.push(item);
      else map.set(name, [item]);
    }
    return Array.from(map, ([name, items]) => ({
      name: name as string | null,
      items,
    }));
  }, [media, filter, sort, byGuest]);

  const ordered = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  async function deleteItem(item: MediaItem) {
    if (deletingId) return;
    if (!window.confirm("Delete this photo? This can't be undone.")) return;
    setDeletingId(item.id);
    try {
      const key =
        typeof window !== "undefined"
          ? window.localStorage.getItem("wedding_admin_key") ?? ""
          : "";
      let res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "content-type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ id: item.id, file_url: item.file_url }),
      });
      // If protected, ask for the key once and retry.
      if (res.status === 401) {
        const entered = window.prompt("Enter the admin key to delete:") ?? "";
        if (!entered) return;
        window.localStorage.setItem("wedding_admin_key", entered);
        res = await fetch("/api/media", {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            "x-admin-key": entered,
          },
          body: JSON.stringify({ id: item.id, file_url: item.file_url }),
        });
      }
      if (!res.ok) throw new Error("Delete failed");
      setMedia((prev) => prev.filter((m) => m.id !== item.id));
      setLightbox(null);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  // Downloads everything (regardless of the current filter), arranged into a
  // folder per guest with chronological, readable filenames like
  // sarah/003_2026-07-22_14-30.jpg
  async function downloadAll() {
    if (media.length === 0 || downloading) return;
    setDownloading(true);
    setDownloadMsg("Preparing ZIP…");
    try {
      const zip = new JSZip();
      const chronological = [...media].sort((a, b) =>
        a.created_at.localeCompare(b.created_at),
      );
      const counters = new Map<string, number>();
      let i = 0;
      for (const item of chronological) {
        i++;
        setDownloadMsg(`Adding ${i} / ${chronological.length}…`);
        const res = await fetch(item.file_url);
        if (!res.ok) continue;
        const blob = await res.blob();
        const folder = folderName(guestName(item));
        const n = (counters.get(folder) ?? 0) + 1;
        counters.set(folder, n);
        const date = item.created_at.slice(0, 10);
        const time = item.created_at.slice(11, 16).replace(":", "-");
        const name = `${String(n).padStart(3, "0")}_${date}_${time}.${fileExt(
          item.file_url,
        )}`;
        zip.file(`${folder}/${name}`, blob);
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

  function tile(item: MediaItem, index: number) {
    return (
      <div
        key={item.id}
        className="group relative aspect-square overflow-hidden rounded-lg bg-stone-200"
      >
        <button
          onClick={() => setLightbox(index)}
          className="block h-full w-full"
          aria-label="Open photo"
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
        <button
          onClick={() => deleteItem(item)}
          disabled={deletingId === item.id}
          aria-label="Delete photo"
          title="Delete photo"
          className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white opacity-80 transition hover:bg-red-600 hover:opacity-100 disabled:opacity-40"
        >
          {deletingId === item.id ? "…" : "🗑"}
        </button>
      </div>
    );
  }

  const filterTabs: { key: Filter; label: string }[] = [
    { key: "all", label: `All (${media.length})` },
    { key: "image", label: `Photos (${photoCount})` },
    { key: "video", label: `Videos (${videoCount})` },
  ];

  let offset = 0;

  return (
    <div className="min-h-screen bg-cream">
      <AdminNav active="/gallery" />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
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
            title="Everything, in a folder per guest"
          >
            {downloading ? downloadMsg || "Working…" : "Download all"}
          </button>
        </div>

        {media.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
            <div className="flex overflow-hidden rounded-full border border-sage/40 bg-white/60">
              {filterTabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  className={`px-4 py-1.5 transition-colors ${
                    filter === t.key
                      ? "bg-sage text-cream"
                      : "text-stone-600 hover:bg-sage/10"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setSort((s) => (s === "newest" ? "oldest" : "newest"))
              }
              className="rounded-full border border-sage/40 bg-white/60 px-4 py-1.5 text-stone-600 transition-colors hover:bg-sage/10"
            >
              {sort === "newest" ? "Newest first ↓" : "Oldest first ↑"}
            </button>
            <button
              onClick={() => setByGuest((v) => !v)}
              className={`rounded-full border border-sage/40 px-4 py-1.5 transition-colors ${
                byGuest
                  ? "bg-sage text-cream"
                  : "bg-white/60 text-stone-600 hover:bg-sage/10"
              }`}
            >
              By guest
            </button>
          </div>
        )}

        {loading && <p className="text-stone-500">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && media.length === 0 && (
          <p className="text-stone-500">
            No photos yet — they&apos;ll appear here as guests upload.
          </p>
        )}
        {!loading && !error && media.length > 0 && ordered.length === 0 && (
          <p className="text-stone-500">
            Nothing in this category yet — try another tab.
          </p>
        )}

        {groups.map((group) => {
          const start = offset;
          offset += group.items.length;
          return (
            <section key={group.name ?? "__all__"} className="mb-8">
              {group.name && (
                <h2 className="mb-3 text-lg text-sage-dark">
                  {group.name}
                  <span className="ml-2 text-sm text-stone-500">
                    {group.items.length}{" "}
                    {group.items.length === 1 ? "memory" : "memories"}
                  </span>
                </h2>
              )}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {group.items.map((item, i) => tile(item, start + i))}
              </div>
            </section>
          );
        })}
      </main>

      {lightbox !== null && ordered[lightbox] && (
        <Lightbox
          items={ordered}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNavigate={(i) => setLightbox(i)}
        />
      )}
    </div>
  );
}
