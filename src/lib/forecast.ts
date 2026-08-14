// Generates a deterministic daily "focus forecast" for a given sign and date.
// Same sign + same day always yields the same reading, so the app feels stable
// across reloads without needing any backend or external horoscope API.

import type { Sign } from "./zodiac";

export interface Forecast {
  theme: string; // the day's focus theme
  intention: string; // a one-line intention to hold
  window: string; // the "cosmic focus window" — best time of day
  ritual: string; // a small pre-focus ritual
  suggestedMinutes: number; // recommended session length
  mantra: string; // short mantra shown on the timer
}

// A tiny string hash → 32-bit unsigned int. Stable across environments.
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Deterministic pick from a list, salted so different fields vary independently.
function pick<T>(list: T[], seed: number, salt: string): T {
  const idx = hash(`${seed}:${salt}`) % list.length;
  return list[idx];
}

const THEMES = [
  "Deep work over busywork",
  "One thing, finished",
  "Momentum through small starts",
  "Protecting your attention",
  "Clearing the mental clutter",
  "Following your curiosity down one path",
  "Steady progress, not perfection",
  "Closing an open loop",
  "Building quietly toward a bigger goal",
  "Trusting the boring middle of the task",
];

const INTENTIONS = [
  "Do the hard thing first, while your energy is high.",
  "Let 'good enough' be finished today.",
  "Guard your first hour like it's sacred.",
  "Say no to one distraction on purpose.",
  "Start before you feel ready.",
  "Work in one direction until it's done.",
  "Take the small win and keep moving.",
  "Silence the notifications; the world can wait.",
  "Return to the task each time your mind wanders — without judgment.",
  "Finish the sentence, the file, the thought — then rest.",
];

const WINDOWS = [
  "early morning, before the noise",
  "mid-morning, when your mind is sharp",
  "just after lunch, riding a second wind",
  "late afternoon, in the golden calm",
  "the quiet hour after sunset",
  "the still stretch before midday",
];

const RITUALS = [
  "Take three slow breaths and name the one task.",
  "Clear your desk of everything but the work.",
  "Put your phone in another room, face down.",
  "Write the single outcome you want on paper.",
  "Stretch, sip water, then begin.",
  "Close every tab that isn't the task.",
  "Set the timer before you can talk yourself out of it.",
];

const MANTRAS = [
  "One breath, one task.",
  "The stars align for the focused.",
  "Attention is my superpower.",
  "Slow is smooth, smooth is fast.",
  "This moment, this work.",
  "I begin, and that is enough.",
  "Quiet mind, clear sky.",
];

// Element nudges the suggested session length toward each sign's temperament.
const ELEMENT_MINUTES: Record<Sign["element"], number[]> = {
  Fire: [20, 25],
  Air: [25, 30],
  Earth: [30, 40],
  Water: [25, 35],
};

/** Build the forecast for a sign on a given ISO date (YYYY-MM-DD). */
export function forecastFor(sign: Sign, isoDate: string): Forecast {
  const seed = hash(`${sign.name}|${isoDate}`);
  const minuteChoices = ELEMENT_MINUTES[sign.element];
  return {
    theme: pick(THEMES, seed, "theme"),
    intention: pick(INTENTIONS, seed, "intention"),
    window: pick(WINDOWS, seed, "window"),
    ritual: pick(RITUALS, seed, "ritual"),
    suggestedMinutes: pick(minuteChoices, seed, "minutes"),
    mantra: pick(MANTRAS, seed, "mantra"),
  };
}

/** Local-date ISO string (YYYY-MM-DD) for "today" in the user's timezone. */
export function todayISO(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** A friendly long-form date, e.g. "Friday, July 10". */
export function prettyDate(date = new Date()): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
