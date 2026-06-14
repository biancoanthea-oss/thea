"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { COUPLE_NAME } from "@/lib/config";
import type { GuestMessage } from "@/lib/types";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function GuestbookPage() {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/messages", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load messages");
        const json = await res.json();
        setMessages(json.messages ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <AdminNav active="/guestbook" />
      <main className="mx-auto max-w-2xl px-5 py-8">
        <header className="mb-8 text-center">
          <h1 className="font-script text-5xl text-sage-dark">{COUPLE_NAME}</h1>
          <p className="text-stone-600">Guestbook</p>
        </header>

        {loading && <p className="text-stone-500">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && messages.length === 0 && (
          <p className="text-center text-stone-500">No messages yet.</p>
        )}

        <ul className="space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className="rounded-2xl bg-white/60 p-5 shadow-sm ring-1 ring-sage/10"
            >
              <p className="whitespace-pre-wrap text-lg text-stone-700">
                {m.message}
              </p>
              <p className="mt-3 text-sm text-stone-500">
                — {m.guest_name?.trim() || "A guest"} ·{" "}
                {formatDate(m.created_at)}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
