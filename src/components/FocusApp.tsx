"use client";

import { useEffect, useMemo, useState } from "react";
import { SIGNS, type Sign } from "@/lib/zodiac";
import { forecastFor, prettyDate, todayISO } from "@/lib/forecast";
import {
  clearProfile,
  loadProfile,
  loadStats,
  recordSession,
  saveProfile,
  type Stats as StatsData,
} from "@/lib/storage";
import Onboarding from "./Onboarding";
import ForecastCard from "./Forecast";
import Timer from "./Timer";
import Stats from "./Stats";

export default function FocusApp() {
  const [sign, setSign] = useState<Sign | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage once, on the client only.
  useEffect(() => {
    const profile = loadProfile();
    if (profile) {
      const found = SIGNS.find((s) => s.name === profile.signName) ?? null;
      setSign(found);
    }
    setStats(loadStats());
    setReady(true);
  }, []);

  const forecast = useMemo(
    () => (sign ? forecastFor(sign, todayISO()) : null),
    [sign],
  );

  const handleChoose = (chosen: Sign, birthday?: string) => {
    setSign(chosen);
    saveProfile({ signName: chosen.name, birthday });
  };

  const handleComplete = (minutes: number) => {
    setStats(recordSession(minutes));
  };

  const handleReset = () => {
    clearProfile();
    setSign(null);
  };

  // Avoid a hydration flash: render nothing meaningful until we've read storage.
  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-stardust-dim">
        <span className="animate-pulseGlow font-display text-2xl">
          Consulting the stars…
        </span>
      </div>
    );
  }

  if (!sign || !forecast || !stats) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Onboarding onChoose={handleChoose} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="animate-float text-4xl text-gold">
            {sign.symbol}
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold leading-none text-stardust">
              Thea
            </h1>
            <p className="text-sm text-stardust-dim">
              {sign.name} · {sign.focusStyle.split(" — ")[0]}
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-stardust-dim underline-offset-4 transition hover:text-stardust hover:underline"
        >
          Change sign
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <ForecastCard
          sign={sign}
          forecast={forecast}
          dateLabel={prettyDate()}
        />
        <Timer
          sign={sign}
          suggestedMinutes={forecast.suggestedMinutes}
          mantra={forecast.mantra}
          onFocusComplete={handleComplete}
        />
      </div>

      <div className="mt-6">
        <Stats stats={stats} />
      </div>

      <footer className="mt-10 text-center text-xs text-stardust-dim">
        Your sign and focus history stay on this device. ✦
      </footer>
    </div>
  );
}
