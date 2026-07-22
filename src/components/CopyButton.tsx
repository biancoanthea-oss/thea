"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  label,
  className = "",
}: {
  text: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API can be unavailable (http, permissions) — fall back.
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      onClick={copy}
      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
        copied
          ? "bg-emerald-500/20 text-emerald-300"
          : "bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/30"
      } ${className}`}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
