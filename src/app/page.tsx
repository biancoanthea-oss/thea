import Link from "next/link";
import { TRENDS, CATEGORIES, allDupes } from "@/lib/data";
import { TrendExplorer } from "@/components/TrendExplorer";

export default function HomePage() {
  const dupeCount = allDupes().length;
  const topTrend = [...TRENDS].sort((a, b) => b.heat - a.heat)[0];

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-12 sm:pt-16">
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink/60">
          <span className="text-rose">●</span> {TRENDS.length} live trends ·{" "}
          {dupeCount} dupes tracked
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] sm:text-6xl">
          What&apos;s trending in fashion —{" "}
          <span className="text-rose">and how to get it for less.</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-ink/60 sm:text-lg">
          Trendr tracks the aesthetics blowing up right now, then finds the
          best-value dupes for every piece. Compare prices, save favourites,
          and shop the retailer directly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="#explore"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose"
          >
            Explore trends
          </Link>
          <Link
            href={`/trends/${topTrend.slug}`}
            className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-ink/30"
          >
            🔥 Hottest: {topTrend.title}
          </Link>
        </div>
      </section>

      <TrendExplorer trends={TRENDS} categories={CATEGORIES} />
    </div>
  );
}
