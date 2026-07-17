"use client";

import { useMemo, useState } from "react";
import type { Trend } from "@/lib/types";
import { TrendCard } from "./TrendCard";

type SortKey = "heat" | "savings" | "az";

export function TrendExplorer({
  trends,
  categories,
}: {
  trends: Trend[];
  categories: string[];
}) {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("heat");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = trends.filter((t) => {
      if (category !== "All" && t.category !== category) return false;
      if (!q) return true;
      const haystack = [t.title, t.blurb, t.category, ...t.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    list = [...list].sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "heat") return b.heat - a.heat;
      // savings: crude proxy — bigger original-to-dupe gap sorts first
      const gap = (t: Trend) =>
        t.pieces.reduce(
          (s, p) =>
            s + (p.original.price - Math.min(...p.dupes.map((d) => d.price))),
          0,
        );
      return gap(b) - gap(a);
    });
    return list;
  }, [trends, category, query, sort]);

  const chips = ["All", ...categories];

  return (
    <section id="explore" className="mx-auto max-w-6xl px-5">
      <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">Trending now</h2>
          <p className="mt-1 text-sm text-ink/55">
            {filtered.length} {filtered.length === 1 ? "trend" : "trends"}
            {category !== "All" ? ` in ${category}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trends, tags…"
            className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-rose sm:w-56"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-line bg-white px-3 py-2 text-sm outline-none focus:border-rose"
            aria-label="Sort trends"
          >
            <option value="heat">Hottest</option>
            <option value="savings">Biggest savings</option>
            <option value="az">A–Z</option>
          </select>
        </div>
      </div>

      <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition ${
              category === c
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-ink/70 hover:border-ink/30"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-ink/50">
          No trends match “{query}”.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TrendCard key={t.slug} trend={t} />
          ))}
        </div>
      )}
    </section>
  );
}
