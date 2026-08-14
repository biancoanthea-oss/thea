"use client";

import { useState } from "react";
import { SIGNS, signForISODate, type Sign } from "@/lib/zodiac";

export default function Onboarding({
  onChoose,
}: {
  onChoose: (sign: Sign, birthday?: string) => void;
}) {
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleBirthday = () => {
    const sign = signForISODate(birthday);
    if (!sign) {
      setError("Please enter a valid date.");
      return;
    }
    setError(null);
    onChoose(sign, birthday);
  };

  return (
    <div className="mx-auto w-full max-w-lg animate-fadeIn">
      <div className="glass rounded-3xl p-8 shadow-2xl">
        <h1 className="text-center font-display text-5xl font-semibold text-stardust">
          Welcome to Thea
        </h1>
        <p className="mt-3 text-center text-stardust-dim">
          Your stars, tuned for focus. First, let&apos;s find your sign.
        </p>

        <div className="mt-8">
          <label
            htmlFor="birthday"
            className="block text-sm font-medium text-stardust-dim"
          >
            Enter your birthday
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="flex-1 rounded-xl border border-aura/20 bg-night/60 px-4 py-3 text-stardust outline-none focus:border-aura"
            />
            <button
              onClick={handleBirthday}
              disabled={!birthday}
              className="rounded-xl bg-aura px-5 py-3 font-medium text-night transition hover:bg-aura-dark hover:text-stardust disabled:opacity-40"
            >
              Reveal
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-blush">{error}</p>}
        </div>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-stardust-dim">
          <span className="h-px flex-1 bg-aura/15" />
          or pick your sign
          <span className="h-px flex-1 bg-aura/15" />
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {SIGNS.map((sign) => (
            <button
              key={sign.name}
              onClick={() => onChoose(sign)}
              className="group flex flex-col items-center rounded-xl border border-aura/10 bg-night/40 px-2 py-3 transition hover:border-aura/50 hover:bg-cosmos"
            >
              <span className="text-2xl text-gold transition group-hover:scale-110">
                {sign.symbol}
              </span>
              <span className="mt-1 text-xs text-stardust-dim group-hover:text-stardust">
                {sign.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
