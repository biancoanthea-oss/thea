"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function plusOneYear(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

// A letter written today, sealed in the database, and emailed back to the
// writer on the chosen date (one year from today by default).
export default function TimeCapsuleForm({ name }: { name: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [deliverDate, setDeliverDate] = useState(plusOneYear());
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());
  const ready = emailOk && message.trim().length > 0 && deliverDate;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    setStatus("saving");
    setError("");
    const { error } = await supabase.from("letters").insert({
      sender_name: name.trim() || null,
      email: email.trim(),
      message: message.trim(),
      deliver_at: `${deliverDate}T09:00:00.000Z`,
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
      <label className="mb-1 block text-lg text-sage-dark">
        Write a letter to the future ✉️
      </label>
      <p className="mb-3 text-sm text-stone-500">
        Write a letter today and we&apos;ll email it to you in one year — a
        little time capsule from the wedding. Nobody can read it before then,
        not even the happy couple.
      </p>
      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (status === "done") setStatus("idle");
        }}
        rows={5}
        placeholder="Dear future me…"
        className="w-full resize-none rounded-xl border border-sage/40 bg-white/70 px-4 py-3 text-stone-700 outline-none focus:border-sage focus:ring-2 focus:ring-sage/30"
      />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-stone-600">
            Your email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-sage/40 bg-white/70 px-4 py-3 text-stone-700 outline-none focus:border-sage focus:ring-2 focus:ring-sage/30"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-stone-600">
            Deliver on
          </label>
          <input
            type="date"
            value={deliverDate}
            min={tomorrow()}
            onChange={(e) => setDeliverDate(e.target.value)}
            className="w-full rounded-xl border border-sage/40 bg-white/70 px-4 py-3 text-stone-700 outline-none focus:border-sage focus:ring-2 focus:ring-sage/30"
          />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving" || !ready}
          className="rounded-full bg-sage px-6 py-2 text-cream transition-colors hover:bg-sage-dark disabled:opacity-50"
        >
          {status === "saving" ? "Sealing…" : "Seal the letter"}
        </button>
        {status === "done" && (
          <span className="text-sage-dark animate-fadeIn">
            ✓ Sealed! See you in the future.
          </span>
        )}
        {status === "error" && (
          <span className="text-red-600">{error || "Something went wrong"}</span>
        )}
      </div>
    </form>
  );
}
