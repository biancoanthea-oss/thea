"use client";

import {
  currentStreak,
  sessionsToday,
  type Stats as StatsData,
} from "@/lib/storage";

export default function Stats({ stats }: { stats: StatsData }) {
  const today = sessionsToday(stats);
  const streak = currentStreak(stats);
  const hours = Math.floor(stats.totalMinutes / 60);
  const mins = stats.totalMinutes % 60;
  const focusedLabel =
    hours > 0 ? `${hours}h ${mins}m` : `${stats.totalMinutes}m`;

  const items = [
    { label: "Today", value: String(today), hint: "sessions" },
    { label: "Streak", value: String(streak), hint: streak === 1 ? "day" : "days" },
    { label: "All-time", value: String(stats.totalSessions), hint: "sessions" },
    { label: "Focused", value: focusedLabel, hint: "total" },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="glass animate-fadeIn rounded-2xl p-4 text-center"
        >
          <p className="text-xs uppercase tracking-widest text-stardust-dim">
            {item.label}
          </p>
          <p className="mt-1 font-display text-3xl font-semibold text-gold">
            {item.value}
          </p>
          <p className="text-xs text-stardust-dim">{item.hint}</p>
        </div>
      ))}
    </section>
  );
}
