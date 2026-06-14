"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COUPLE_NAME } from "@/lib/config";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/gallery";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push(next);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j?.error || "Incorrect password");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl bg-white/60 p-8 text-center shadow-sm ring-1 ring-sage/10"
      >
        <h1 className="font-script text-5xl text-sage-dark">{COUPLE_NAME}</h1>
        <p className="mt-2 text-stone-600">Private area — please sign in</p>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-6 w-full rounded-xl border border-sage/40 bg-white px-4 py-3 text-stone-700 outline-none focus:border-sage focus:ring-2 focus:ring-sage/30"
        />
        {error && <p className="mt-3 text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-sage px-6 py-3 text-cream transition-colors hover:bg-sage-dark disabled:opacity-50"
        >
          {loading ? "Checking…" : "Enter"}
        </button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
