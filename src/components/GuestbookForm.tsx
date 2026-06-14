"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function GuestbookForm({ name }: { name: string }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("saving");
    setError("");
    const { error } = await supabase.from("messages").insert({
      guest_name: name.trim() || null,
      message: message.trim(),
    });
    if (error) {
      setStatus("error");
      setError(error.message);
      return;
    }
    setMessage("");
    setStatus("done");
  }

  return (
    <form onSubmit={submit} className="w-full">
      <label className="mb-2 block text-lg text-sage-dark">
        Leave a message <span className="text-stone-400">(optional)</span>
      </label>
      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (status === "done") setStatus("idle");
        }}
        rows={3}
        placeholder="Wishing you both a lifetime of happiness…"
        className="w-full resize-none rounded-xl border border-sage/40 bg-white/70 px-4 py-3 text-stone-700 outline-none focus:border-sage focus:ring-2 focus:ring-sage/30"
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving" || !message.trim()}
          className="rounded-full bg-sage px-6 py-2 text-cream transition-colors hover:bg-sage-dark disabled:opacity-50"
        >
          {status === "saving" ? "Sending…" : "Send message"}
        </button>
        {status === "done" && (
          <span className="text-sage-dark animate-fadeIn">✓ Sent, thank you!</span>
        )}
        {status === "error" && (
          <span className="text-red-600">{error || "Something went wrong"}</span>
        )}
      </div>
    </form>
  );
}
