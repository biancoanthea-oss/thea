"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useWishlist } from "@/components/WishlistProvider";
import { Thumb } from "@/components/Thumb";
import { money } from "@/lib/format";

export default function WishlistPage() {
  const { items, remove, clear, ready } = useWishlist();

  const total = useMemo(
    () => items.reduce((s, i) => s + i.price, 0),
    [items],
  );

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center text-ink/40">
        Loading your wishlist…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            Your wishlist
          </h1>
          <p className="mt-1 text-ink/60">
            {items.length === 0
              ? "Nothing saved yet."
              : `${items.length} ${items.length === 1 ? "item" : "items"} · ${money(
                  total,
                )} to buy them all`}
          </p>
        </div>
        {items.length > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink/60 transition hover:border-rose/40 hover:text-rose"
          >
            Clear all
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-line bg-white/60 px-6 py-16 text-center">
          <p className="text-5xl">♡</p>
          <p className="mt-3 text-ink/60">
            Save dupes you love and they&apos;ll show up here to buy later.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose"
          >
            Browse trends
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.dupeId}
              className="flex gap-3 rounded-2xl border border-line bg-white p-3"
            >
              <Thumb
                palette={item.palette}
                className="h-20 w-20 shrink-0"
                rounded="rounded-xl"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  href={`/trends/${item.trendSlug}`}
                  className="truncate text-[11px] uppercase tracking-wide text-ink/40 hover:text-rose"
                >
                  {item.trendTitle}
                </Link>
                <p className="truncate text-sm font-semibold">{item.retailer}</p>
                <p className="truncate text-sm text-ink/60">{item.name}</p>
                <p className="mt-1 text-lg font-semibold">{money(item.price)}</p>

                <div className="mt-auto flex items-center gap-2 pt-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-rose"
                  >
                    Buy ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(item.dupeId)}
                    className="text-xs text-ink/45 transition hover:text-rose"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
