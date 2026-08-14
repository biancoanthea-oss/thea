// Zodiac sign definitions and helpers for computing a sign from a birth date.

export type Element = "Fire" | "Earth" | "Air" | "Water";

export interface Sign {
  name: string;
  symbol: string; // unicode glyph
  element: Element;
  ruler: string; // ruling planet
  // Date range is expressed as [startMonth, startDay]; the sign runs until the
  // next sign's start. Months are 1-indexed.
  start: [number, number];
  // A one-line focus persona used across the app.
  focusStyle: string;
}

// Ordered by the tropical calendar starting with Capricorn (covers Jan 1).
export const SIGNS: Sign[] = [
  {
    name: "Capricorn",
    symbol: "♑",
    element: "Earth",
    ruler: "Saturn",
    start: [12, 22],
    focusStyle: "the disciplined climber — you focus best with a clear summit in sight",
  },
  {
    name: "Aquarius",
    symbol: "♒",
    element: "Air",
    ruler: "Uranus",
    start: [1, 20],
    focusStyle: "the inventor — you focus best when the work feels original",
  },
  {
    name: "Pisces",
    symbol: "♓",
    element: "Water",
    ruler: "Neptune",
    start: [2, 19],
    focusStyle: "the dreamer — you focus best inside a calm, unhurried current",
  },
  {
    name: "Aries",
    symbol: "♈",
    element: "Fire",
    ruler: "Mars",
    start: [3, 21],
    focusStyle: "the starter — you focus best in short, high-energy sprints",
  },
  {
    name: "Taurus",
    symbol: "♉",
    element: "Earth",
    ruler: "Venus",
    start: [4, 20],
    focusStyle: "the steady hand — you focus best in long, comfortable stretches",
  },
  {
    name: "Gemini",
    symbol: "♊",
    element: "Air",
    ruler: "Mercury",
    start: [5, 21],
    focusStyle: "the quick mind — you focus best by rotating between a few tasks",
  },
  {
    name: "Cancer",
    symbol: "♋",
    element: "Water",
    ruler: "the Moon",
    start: [6, 21],
    focusStyle: "the nurturer — you focus best in a familiar, protected space",
  },
  {
    name: "Leo",
    symbol: "♌",
    element: "Fire",
    ruler: "the Sun",
    start: [7, 23],
    focusStyle: "the performer — you focus best when the work feels meaningful",
  },
  {
    name: "Virgo",
    symbol: "♍",
    element: "Earth",
    ruler: "Mercury",
    start: [8, 23],
    focusStyle: "the craftsperson — you focus best with a tidy list and small wins",
  },
  {
    name: "Libra",
    symbol: "♎",
    element: "Air",
    ruler: "Venus",
    start: [9, 23],
    focusStyle: "the harmonizer — you focus best in a balanced, pleasant rhythm",
  },
  {
    name: "Scorpio",
    symbol: "♏",
    element: "Water",
    ruler: "Pluto",
    start: [10, 23],
    focusStyle: "the deep diver — you focus best in long, immersive plunges",
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    element: "Fire",
    ruler: "Jupiter",
    start: [11, 22],
    focusStyle: "the explorer — you focus best when there's room to roam an idea",
  },
];

/** Return the zodiac sign for a given month (1-12) and day (1-31). */
export function signForDate(month: number, day: number): Sign {
  // Walk signs in calendar order; find the last sign whose start is <= date.
  // Capricorn wraps the new year, so we default to it.
  let current: Sign = SIGNS[0]; // Capricorn
  for (const sign of SIGNS) {
    const [m, d] = sign.start;
    if (month > m || (month === m && day >= d)) {
      current = sign;
    }
  }
  // Handle the December→Capricorn wrap: dates on/after Dec 22 are Capricorn,
  // which the loop already assigns; dates in early Jan before Jan 20 fall
  // through to the default (Capricorn). Both cases are covered.
  return current;
}

/** Parse an ISO date string (YYYY-MM-DD) into a sign. Returns null if invalid. */
export function signForISODate(iso: string): Sign | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return signForDate(month, day);
}

export const ELEMENT_META: Record<
  Element,
  { color: string; glow: string; word: string }
> = {
  Fire: { color: "#ff9d5c", glow: "rgba(255,157,92,0.45)", word: "spark" },
  Earth: { color: "#9ad48f", glow: "rgba(154,212,143,0.4)", word: "ground" },
  Air: { color: "#8fd0ff", glow: "rgba(143,208,255,0.4)", word: "clarity" },
  Water: { color: "#b39dff", glow: "rgba(179,157,255,0.45)", word: "flow" },
};
