import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TRENDS, getTrend, trendStats } from "@/lib/data";
import { money } from "@/lib/format";
import { Thumb } from "@/components/Thumb";
import { HeatBadge } from "@/components/HeatBadge";
import { DupeCard } from "@/components/DupeCard";

export function generateStaticParams() {
  return TRENDS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const trend = getTrend(params.slug);
  if (!trend) return { title: "Trend not found — Trendr" };
  return {
    title: `${trend.title} — Trendr`,
    description: trend.blurb,
  };
}

export default function TrendPage({ params }: { params: { slug: string } }) {
  const trend = getTrend(params.slug);
  if (!trend) notFound();

  const stats = trendStats(trend);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <Link
        href="/"
        className="text-sm text-ink/50 transition hover:text-ink"
      >
        ← All trends
      </Link>

      {/* Header */}
      <div className="mt-4 grid gap-6 md:grid-cols-[1.1fr_1fr] md:items-stretch">
        <div className="relative overflow-hidden rounded-3xl">
          <Thumb palette={trend.palette} rounded="rounded-3xl" className="h-56 w-full md:h-full" />
          <div className="absolute left-4 top-4">
            <HeatBadge heat={trend.heat} direction={trend.direction} />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-sm font-medium text-rose">{trend.category}</span>
          <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
            {trend.title}
          </h1>
          <p className="mt-3 text-ink/65">{trend.description}</p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat label="Pieces" value={String(stats.pieceCount)} />
            <Stat label="Dupes" value={String(stats.dupeCount)} />
            <Stat label="Max saving" value={`${stats.savingsPercent}%`} accent />
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {trend.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-ink/5 px-2.5 py-1 text-xs text-ink/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pieces */}
      <div className="mt-10 space-y-8">
        {trend.pieces.map((piece) => (
          <section key={piece.id}>
            <div className="flex items-center gap-4">
              <Thumb
                palette={piece.palette}
                className="h-16 w-16 shrink-0"
                rounded="rounded-xl"
              />
              <div className="min-w-0">
                <span className="text-xs font-medium uppercase tracking-wide text-ink/45">
                  {piece.category}
                </span>
                <h2 className="font-display text-xl font-semibold">
                  {piece.name}
                </h2>
                <p className="text-sm text-ink/55">
                  Original: {piece.original.brand} {piece.original.name} ·{" "}
                  <span className="font-medium text-ink/70">
                    {money(piece.original.price)}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[...piece.dupes]
                .sort((a, b) => a.price - b.price)
                .map((dupe) => (
                  <DupeCard
                    key={dupe.id}
                    trend={trend}
                    piece={piece}
                    dupe={dupe}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white px-3 py-2.5 text-center">
      <p
        className={`font-display text-2xl font-semibold ${
          accent ? "text-gold" : ""
        }`}
      >
        {value}
      </p>
      <p className="text-[11px] uppercase tracking-wide text-ink/45">{label}</p>
    </div>
  );
}
