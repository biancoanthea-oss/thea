# Thea — Astrology Focus ✦

An astrology-guided focus companion. Read your **daily focus forecast**, then
work in the flow with a **celestial focus timer**. Thea reads your zodiac sign,
tunes each day's guidance and suggested session length to it, and tracks your
focus streak — all in a calm, starlit interface.

Built with **Next.js (App Router, TypeScript)** and **Tailwind CSS**. Runs
entirely in the browser — **no accounts, no backend, no API keys**. Your sign
and focus history are stored locally on your device.

## What it does

- **Find your sign** — enter your birthday (or pick a sign directly) and Thea
  computes your zodiac sign.
- **Daily focus forecast** — a focus theme, an intention, your "cosmic focus
  window", a small pre-focus ritual, and a mantra. It's deterministic per sign
  per day, so it's stable across reloads but fresh each morning.
- **Celestial focus timer** — a Pomodoro-style timer with a glowing progress
  ring, adjustable session length (pre-set from your forecast), automatic
  focus → break cycling, and a gentle chime when time is up.
- **Streak & stats** — sessions today, current streak, all-time sessions, and
  total time focused.

## How it works

There's no external horoscope service. Each day's reading is generated from a
small seeded hash of `sign + date`, so the same sign always gets the same
reading on a given day and a new one the next day. Everything persists in
`localStorage` under the `thea.*` keys.

Key files:

| File                          | Purpose                                        |
| ----------------------------- | ---------------------------------------------- |
| `src/lib/zodiac.ts`           | Sign definitions + date → sign logic           |
| `src/lib/forecast.ts`         | Deterministic daily forecast generator         |
| `src/lib/storage.ts`          | localStorage: profile + focus stats/streak     |
| `src/components/FocusApp.tsx` | Client orchestrator (onboarding vs. main view) |
| `src/components/Timer.tsx`    | The focus timer + progress ring + chime        |
| `src/components/Forecast.tsx` | The daily forecast card                        |

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. That's it — no configuration needed.

To test from your **phone** on the same Wi-Fi, run
`npm run dev -- -H 0.0.0.0` and visit `http://YOUR-COMPUTER-IP:3000`.

## Build

```bash
npm run build
npm start
```

## Deploy

Any static-friendly Next.js host works (e.g. Vercel: **Add New → Project** →
import the repo → **Deploy**). No environment variables are required.

## Notes on the astrology

Thea is a focus tool with an astrology theme, meant to add a little ritual and
delight to sitting down to work. The readings are for encouragement, not
prediction. 🌙
