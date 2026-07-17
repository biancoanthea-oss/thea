import Link from "next/link";
import type { Trend } from "@/lib/types";
import { trendStats } from "@/lib/data";
import { money } from "@/lib/format";
import { Thumb } from "./Thumb";
import { HeatBadge } from "./HeatBadge";

export function TrendCard({ trend }: { trend: Trend }) {
  const stats = trendStats(trend);

  return (
    <Link
      href={`/trends/${trend.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/5"
    >
      <div className="relative">
        <Thumb
          palette={trend.palette}
          rounded="rounded-none"
          className="h-44 w-full"
        />
        <div className="absolute left-3 top-3">
          <HeatBadge heat={trend.heat} direction={trend.direction} />
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-ink/70">
          {trend.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-xl font-semibold">{trend.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink/60">{trend.blurb}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {trend.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] text-ink/55"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-ink/55">
          <span>
            {stats.pieceCount} pieces · {stats.dupeCount} dupes
          </span>
          <span className="font-semibold text-gold">
            up to {stats.savingsPercent}% off
          </span>
        </div>
        <p className="mt-1 text-xs text-ink/45">
          Dupes from {money(stats.cheapest)}
        </p>
      </div>
    </Link>
  );
}
