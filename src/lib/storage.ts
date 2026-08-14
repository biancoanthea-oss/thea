// Small localStorage-backed persistence layer. Everything the app remembers —
// the user's sign and their focus history — lives in the browser. No accounts,
// no backend.

import { todayISO } from "./forecast";

const PROFILE_KEY = "thea.profile.v1";
const STATS_KEY = "thea.stats.v1";

export interface Profile {
  signName: string;
  birthday?: string; // ISO date, optional (may pick sign directly)
}

export interface Stats {
  totalSessions: number;
  totalMinutes: number;
  // Map of ISO date -> sessions completed that day. Used for today's count
  // and the streak.
  daily: Record<string, number>;
}

const EMPTY_STATS: Stats = { totalSessions: 0, totalMinutes: 0, daily: {} };

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? { ...fallback, ...(JSON.parse(raw) as T) } : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked — fail silently, the app still works in-memory
  }
}

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile): void {
  write(PROFILE_KEY, profile);
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFILE_KEY);
}

export function loadStats(): Stats {
  return read<Stats>(STATS_KEY, EMPTY_STATS);
}

/** Record one completed focus session of `minutes` length. Returns new stats. */
export function recordSession(minutes: number): Stats {
  const stats = loadStats();
  const today = todayISO();
  const next: Stats = {
    totalSessions: stats.totalSessions + 1,
    totalMinutes: stats.totalMinutes + minutes,
    daily: { ...stats.daily, [today]: (stats.daily[today] ?? 0) + 1 },
  };
  write(STATS_KEY, next);
  return next;
}

export function sessionsToday(stats: Stats): number {
  return stats.daily[todayISO()] ?? 0;
}

/** Consecutive days (ending today) with at least one session. */
export function currentStreak(stats: Stats): number {
  let streak = 0;
  const cursor = new Date();
  // Walk backwards day by day until we hit a day with no sessions.
  // Stop after a generous cap to avoid any pathological loop.
  for (let i = 0; i < 3650; i++) {
    const iso = todayISO(cursor);
    if ((stats.daily[iso] ?? 0) > 0) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
