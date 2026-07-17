import type { Trend } from "@/lib/types";

const ARROW: Record<Trend["direction"], string> = {
  up: "▲",
  steady: "▬",
  down: "▼",
};

const COLOR: Record<Trend["direction"], string> = {
  up: "text-rose",
  steady: "text-ink/50",
  down: "text-ink/40",
};

/** Little "🔥 94 ▲" pill showing a trend's heat and direction. */
export function HeatBadge({
  heat,
  direction,
}: {
  heat: number;
  direction: Trend["direction"];
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold shadow-sm">
      <span aria-hidden>🔥</span>
      <span>{heat}</span>
      <span className={COLOR[direction]} aria-hidden>
        {ARROW[direction]}
      </span>
      <span className="sr-only">
        heat {heat}, trending {direction}
      </span>
    </span>
  );
}
