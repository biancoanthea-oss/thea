"use client";

import { useRef, useState } from "react";
import { exportData, importData } from "@/lib/storage";
import type { StudioData } from "@/lib/types";

export function BackupControls() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function doExport() {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `tender-studio-backup-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text) as StudioData;
      const replace = window.confirm(
        "Import backup:\n\nOK = replace everything with this file.\nCancel = merge it into what you already have."
      );
      importData(data, replace ? "replace" : "merge");
      setMsg("Backup imported.");
    } catch {
      setMsg("That file could not be read as a Tender Studio backup.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="card p-5">
      <h2 className="font-display text-lg font-semibold">Backup &amp; restore</h2>
      <p className="mt-1 text-sm text-mist">
        Your library and tenders live in this browser. Export a backup file
        regularly, or to move to another computer.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="btn-ghost btn-sm" onClick={doExport}>
          Export backup
        </button>
        <button
          className="btn-ghost btn-sm"
          onClick={() => fileRef.current?.click()}
        >
          Import backup
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={onFile}
        />
      </div>
      {msg && <p className="mt-2 text-xs text-accent-dark">{msg}</p>}
    </div>
  );
}
