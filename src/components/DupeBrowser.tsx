"use client";

import { useMemo, useState } from "react";
import type { Dupe, Piece, Trend } from "@/lib/types";
import { DupeCard } from "./DupeCard";

interface Row {
  trend: Trend;
  piece: Piece;
  dupe: Dupe;
}

type SortKey = "match" | "price-asc" | "price-desc";

export function DupeBrowser({ rows }: { rows: Row[] }) {
  const retailers = useMemo(
    () => Array.from(new Set(rows.map((r) => r.dupe.retailer))).sort(),
    [rows],
  );

  const [retailer, setRetailer] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("match");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => {
      if (retailer !== "All" && r.dupe.retailer !== retailer) return false;
      if (maxPrice !== "" && r.dupe.price > maxPrice) return false;
      if (!q) return true;
      const hay = [
        r.dupe.name,
        r.dupe.retailer,
        r.piece.name,
        r.piece.category,
        r.trend.title,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });

    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.dupe.price - b.dupe.price;
      if (sort === "price-desc") return b.dupe.price - a.dupe.price;
      return b.dupe.matchPercent - a.dupe.matchPercent;
    });
    return list;
  }, [rows, retailer, query, sort, maxPrice]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search dupes…"
          className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-rose sm:w-52"
        />
        <select
          value={retailer}
          onChange={(e) => setRetailer(e.target.value)}
          className="rounded-full border border-line bg-white px-3 py-2 text-sm outline-none focus:border-rose"
          aria-label="Filter by retailer"
        >
          <option value="All">All retailers</option>
          {retailers.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={maxPrice === "" ? "" : String(maxPrice)}
          onChange={(e) =>
            setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="rounded-full border border-line bg-white px-3 py-2 text-sm outline-none focus:border-rose"
          aria-label="Max price"
        >
          <option value="">Any price</option>
          <option value="25">Under $25</option>
          <option value="50">Under $50</option>
          <option value="100">Under $100</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full border border-line bg-white px-3 py-2 text-sm outline-none focus:border-rose"
          aria-label="Sort dupes"
        >
          <option value="match">Best match</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <p className="mt-3 text-sm text-ink/55">{filtered.length} dupes</p>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-ink/50">No dupes match your filters.</p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <div key={r.dupe.id}>
              <p className="mb-1 px-1 text-[11px] uppercase tracking-wide text-ink/40">
                {r.trend.title} · {r.piece.name}
              </p>
              <DupeCard trend={r.trend} piece={r.piece} dupe={r.dupe} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
