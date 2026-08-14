"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ELEMENT_META, type Sign } from "@/lib/zodiac";

type Mode = "focus" | "break";
const BREAK_MINUTES = 5;

// Gentle chime via the Web Audio API — no asset needed. Best-effort only.
function chime() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    const notes = [523.25, 659.25, 783.99]; // C5 · E5 · G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.16;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 1);
    });
    setTimeout(() => ctx.close(), 1400);
  } catch {
    // audio unavailable — silent is fine
  }
}

export default function Timer({
  sign,
  suggestedMinutes,
  mantra,
  onFocusComplete,
}: {
  sign: Sign;
  suggestedMinutes: number;
  mantra: string;
  onFocusComplete: (minutes: number) => void;
}) {
  const element = ELEMENT_META[sign.element];

  const [focusMinutes, setFocusMinutes] = useState(suggestedMinutes);
  const [mode, setMode] = useState<Mode>("focus");
  const [running, setRunning] = useState(false);
  const totalSeconds =
    (mode === "focus" ? focusMinutes : BREAK_MINUTES) * 60;
  const [remaining, setRemaining] = useState(totalSeconds);

  // Keep the timer accurate against wall-clock time rather than tick counting.
  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // If the timer isn't running and settings change, reflect the new total.
  useEffect(() => {
    if (!running) setRemaining(totalSeconds);
  }, [totalSeconds, running]);

  const finish = useCallback(() => {
    clearTick();
    endTimeRef.current = null;
    setRunning(false);
    chime();
    if (mode === "focus") {
      onFocusComplete(focusMinutes);
      setMode("break");
      setRemaining(BREAK_MINUTES * 60);
    } else {
      setMode("focus");
      setRemaining(focusMinutes * 60);
    }
  }, [mode, focusMinutes, onFocusComplete]);

  const tick = useCallback(() => {
    if (endTimeRef.current == null) return;
    const secsLeft = Math.round((endTimeRef.current - Date.now()) / 1000);
    if (secsLeft <= 0) {
      setRemaining(0);
      finish();
    } else {
      setRemaining(secsLeft);
    }
  }, [finish]);

  const start = () => {
    endTimeRef.current = Date.now() + remaining * 1000;
    setRunning(true);
    clearTick();
    intervalRef.current = setInterval(tick, 250);
  };

  const pause = () => {
    clearTick();
    endTimeRef.current = null;
    setRunning(false);
  };

  const reset = () => {
    clearTick();
    endTimeRef.current = null;
    setRunning(false);
    setRemaining(totalSeconds);
  };

  const switchMode = (next: Mode) => {
    clearTick();
    endTimeRef.current = null;
    setRunning(false);
    setMode(next);
    setRemaining((next === "focus" ? focusMinutes : BREAK_MINUTES) * 60);
  };

  // Cleanup on unmount.
  useEffect(() => () => clearTick(), []);

  const adjust = (delta: number) => {
    if (running || mode !== "focus") return;
    setFocusMinutes((m) => Math.min(90, Math.max(5, m + delta)));
  };

  const progress = totalSeconds > 0 ? 1 - remaining / totalSeconds : 0;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  // SVG ring geometry
  const R = 130;
  const C = 2 * Math.PI * R;
  const ringColor = mode === "focus" ? element.color : "#8fd0ff";

  return (
    <section className="glass animate-fadeIn rounded-3xl p-6 sm:p-8">
      <div className="mb-6 flex justify-center gap-2">
        {(["focus", "break"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition ${
              mode === m
                ? "bg-aura text-night"
                : "border border-aura/20 text-stardust-dim hover:text-stardust"
            }`}
          >
            {m === "focus" ? "Focus" : "Break"}
          </button>
        ))}
      </div>

      <div className="relative mx-auto flex h-[300px] w-[300px] items-center justify-center">
        <svg
          className="absolute inset-0 -rotate-90"
          viewBox="0 0 300 300"
          aria-hidden
        >
          <circle
            cx="150"
            cy="150"
            r={R}
            fill="none"
            stroke="rgba(179,157,255,0.12)"
            strokeWidth="10"
          />
          <circle
            cx="150"
            cy="150"
            r={R}
            fill="none"
            stroke={ringColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            style={{
              transition: "stroke-dashoffset 0.3s linear",
              filter: `drop-shadow(0 0 10px ${ringColor})`,
            }}
          />
        </svg>
        <div className="text-center">
          <div
            className="font-display text-7xl font-semibold tabular-nums text-stardust"
            aria-live="polite"
          >
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
          <p className="mt-1 text-sm uppercase tracking-widest text-stardust-dim">
            {mode === "focus" ? "Focusing" : "Resting"}
          </p>
        </div>
      </div>

      {mode === "focus" && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => adjust(-5)}
            disabled={running}
            className="h-9 w-9 rounded-full border border-aura/20 text-stardust-dim transition hover:text-stardust disabled:opacity-30"
            aria-label="Decrease minutes"
          >
            −
          </button>
          <span className="text-sm text-stardust-dim">
            {focusMinutes} min session
          </span>
          <button
            onClick={() => adjust(5)}
            disabled={running}
            className="h-9 w-9 rounded-full border border-aura/20 text-stardust-dim transition hover:text-stardust disabled:opacity-30"
            aria-label="Increase minutes"
          >
            +
          </button>
        </div>
      )}

      <div className="mt-6 flex justify-center gap-3">
        {!running ? (
          <button
            onClick={start}
            className="rounded-full bg-aura px-8 py-3 font-medium text-night transition hover:bg-aura-dark hover:text-stardust"
          >
            {remaining === totalSeconds ? "Begin" : "Resume"}
          </button>
        ) : (
          <button
            onClick={pause}
            className="rounded-full border border-aura/40 px-8 py-3 font-medium text-stardust transition hover:bg-cosmos"
          >
            Pause
          </button>
        )}
        <button
          onClick={reset}
          className="rounded-full border border-aura/20 px-6 py-3 font-medium text-stardust-dim transition hover:text-stardust"
        >
          Reset
        </button>
      </div>

      <p className="mt-6 text-center font-display text-xl italic text-aura">
        &ldquo;{mantra}&rdquo;
      </p>
    </section>
  );
}
