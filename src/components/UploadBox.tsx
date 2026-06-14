"use client";

import { useCallback, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  BUCKET,
  COUPLE_NAME,
  MAX_UPLOAD_MB,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  publicUrl,
} from "@/lib/config";

type Status = "pending" | "uploading" | "done" | "error";

type FileEntry = {
  id: string;
  file: File;
  progress: number;
  status: Status;
  error?: string;
};

function randomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function fileType(file: File): "image" | "video" | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return null;
}

// Upload a single file straight to Supabase Storage via XHR so we get real
// per-file progress events (the JS client's upload() does not expose these).
function uploadToStorage(
  path: string,
  file: File,
  onProgress: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const endpoint = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURI(
      path,
    )}`;
    xhr.open("POST", endpoint, true);
    xhr.setRequestHeader("authorization", `Bearer ${SUPABASE_ANON_KEY}`);
    xhr.setRequestHeader("apikey", SUPABASE_ANON_KEY);
    xhr.setRequestHeader("x-upsert", "false");
    if (file.type) xhr.setRequestHeader("content-type", file.type);
    xhr.setRequestHeader("cache-control", "3600");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        let msg = `Upload failed (${xhr.status})`;
        try {
          const j = JSON.parse(xhr.responseText);
          if (j?.message) msg = j.message;
        } catch {
          /* ignore */
        }
        reject(new Error(msg));
      }
    };
    xhr.onerror = () =>
      reject(new Error("Network error — check your signal and try again."));
    xhr.send(file);
  });
}

export default function UploadBox({
  uploaderName,
}: {
  uploaderName: string;
}) {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const allDone =
    entries.length > 0 && entries.every((e) => e.status === "done");
  const anyUploading = entries.some((e) => e.status === "uploading");

  const startUpload = useCallback(
    async (entry: FileEntry) => {
      const type = fileType(entry.file);
      const ext = entry.file.name.includes(".")
        ? entry.file.name.split(".").pop()
        : "bin";
      const path = `${new Date().toISOString().slice(0, 10)}/${randomId()}.${ext}`;

      const setEntry = (patch: Partial<FileEntry>) =>
        setEntries((prev) =>
          prev.map((e) => (e.id === entry.id ? { ...e, ...patch } : e)),
        );

      try {
        setEntry({ status: "uploading", progress: 0, error: undefined });
        await uploadToStorage(path, entry.file, (pct) =>
          setEntry({ progress: pct }),
        );

        const { error } = await supabase.from("uploads").insert({
          file_url: publicUrl(path),
          file_type: type ?? "image",
          uploader_name: uploaderName.trim() || null,
        });
        if (error) throw new Error(error.message);

        setEntry({ status: "done", progress: 100 });
      } catch (err) {
        setEntry({
          status: "error",
          error: err instanceof Error ? err.message : "Upload failed",
        });
      }
    },
    [uploaderName],
  );

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const incoming: FileEntry[] = [];
      for (const file of Array.from(files)) {
        if (!fileType(file)) continue; // images & videos only
        if (MAX_UPLOAD_MB && file.size > MAX_UPLOAD_MB * 1024 * 1024) {
          incoming.push({
            id: randomId(),
            file,
            progress: 0,
            status: "error",
            error: `Too large (max ${MAX_UPLOAD_MB} MB)`,
          });
          continue;
        }
        incoming.push({
          id: randomId(),
          file,
          progress: 0,
          status: "pending",
        });
      }
      if (incoming.length === 0) return;
      setEntries((prev) => [...prev, ...incoming]);
      incoming
        .filter((e) => e.status === "pending")
        .forEach((e) => void startUpload(e));
    },
    [startUpload],
  );

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
        }
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
        }}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging
            ? "border-blush bg-blush/10"
            : "border-sage/50 bg-white/60 hover:bg-white/90"
        }`}
      >
        <div className="text-5xl">📷</div>
        <p className="mt-3 text-xl text-sage-dark">
          Tap to add photos &amp; videos
        </p>
        <p className="mt-1 text-sm text-stone-500">
          or drag them here — you can pick several at once
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {allDone && !anyUploading && (
        <div className="mt-5 rounded-xl bg-sage/15 px-4 py-3 text-center text-lg text-sage-dark animate-fadeIn">
          ✓ Thank you! Your memories are with {COUPLE_NAME}.
          <div className="text-sm text-stone-500">
            Add more anytime — just tap above.
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <ul className="mt-5 space-y-3">
          {entries.map((e) => (
            <li
              key={e.id}
              className="rounded-xl bg-white/70 px-4 py-3 text-sm shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-stone-700">{e.file.name}</span>
                <span className="shrink-0 text-stone-500">
                  {e.status === "done" && "✓ Done"}
                  {e.status === "uploading" && `${e.progress}%`}
                  {e.status === "pending" && "Waiting…"}
                  {e.status === "error" && "⚠ Error"}
                </span>
              </div>
              {e.status !== "error" && (
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-200">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      e.status === "done" ? "bg-sage" : "bg-blush"
                    }`}
                    style={{ width: `${e.progress}%` }}
                  />
                </div>
              )}
              {e.status === "error" && (
                <p className="mt-1 text-red-600">{e.error}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
