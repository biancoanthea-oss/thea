"use client";

import { useMemo, useState } from "react";
import { PRICES_UPDATED, STORES } from "@/lib/prices";
import {
  BasketResult,
  MatchedItem,
  buildBasket,
  euro,
  matchLine,
  parseAndMatch,
} from "@/lib/shopping";

const EXAMPLE = `2 milk
sliced pan
a dozen eggs
chicken fillets
6 apples
teabags
toilet roll`;

export default function ShoppingList() {
  const [text, setText] = useState("");
  const [budget, setBudget] = useState("");
  const [basket, setBasket] = useState<BasketResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [usedAi, setUsedAi] = useState(false);

  const budgetNum = useMemo(() => {
    const n = Number(budget);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [budget]);

  async function build() {
    if (!text.trim()) return;
    setLoading(true);

    let items: MatchedItem[] | null = null;
    // Try the optional AI parser first; fall back to the local one.
    try {
      const res = await fetch("/api/parse-list", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items) && data.items.length) {
          items = data.items.map((it: { qty: number; query: string }) =>
            matchLine({ raw: it.query, qty: it.qty, query: it.query }),
          );
          setUsedAi(true);
        }
      }
    } catch {
      /* ignore — fall back below */
    }

    if (!items) {
      items = parseAndMatch(text);
      setUsedAi(false);
    }

    setBasket(buildBasket(items));
    setLoading(false);
  }

  const cheapest = basket?.cheapestStore ?? null;
  const dearest = basket?.dearestStore ?? null;
  const storeSaving =
    cheapest && dearest ? dearest.total - cheapest.total : 0;

  const overBudget =
    budgetNum != null && cheapest != null && cheapest.total > budgetNum;
  const budgetPct =
    budgetNum != null && cheapest != null
      ? Math.min(100, (cheapest.total / budgetNum) * 100)
      : 0;

  return (
    <div className="w-full">
      {/* ── Input ─────────────────────────────────────────── */}
      <label className="mb-2 block text-lg text-sage-dark">
        Your shopping list
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={7}
        placeholder={EXAMPLE}
        className="w-full resize-none rounded-xl border border-sage/40 bg-white/70 px-4 py-3 font-body text-stone-700 outline-none focus:border-sage focus:ring-2 focus:ring-sage/30"
      />
      <p className="mt-2 text-sm text-stone-500">
        Type one item per line (or separate with commas). Quantities like{" "}
        <span className="font-semibold">“2 milk”</span> or{" "}
        <span className="font-semibold">“a dozen eggs”</span> are understood.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm text-sage-dark">
            Budget <span className="text-stone-400">(optional, €)</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="1"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 40"
            className="w-full rounded-xl border border-sage/40 bg-white/70 px-4 py-3 text-stone-700 outline-none focus:border-sage focus:ring-2 focus:ring-sage/30"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={build}
            disabled={loading || !text.trim()}
            className="rounded-full bg-sage px-7 py-3 text-lg text-cream shadow-sm transition-colors hover:bg-sage-dark disabled:opacity-50"
          >
            {loading ? "Working…" : "🛒 Find cheapest"}
          </button>
          {!text && (
            <button
              onClick={() => setText(EXAMPLE)}
              className="rounded-full border-2 border-sage px-5 py-3 text-sage-dark transition-colors hover:bg-sage/10"
            >
              Try an example
            </button>
          )}
        </div>
      </div>

      {/* ── Results ───────────────────────────────────────── */}
      {basket && cheapest && (
        <div className="mt-8 animate-fadeIn">
          {/* Headline recommendation */}
          <div className="rounded-2xl bg-white/60 p-5 ring-1 ring-sage/15">
            <p className="text-sm uppercase tracking-widest text-blush">
              Cheapest place to shop
            </p>
            <p className="mt-1 text-3xl font-semibold text-sage-dark">
              {cheapest.store} · {euro(cheapest.total)}
            </p>
            {storeSaving > 0.005 && (
              <p className="mt-1 text-sage">
                Save {euro(storeSaving)} vs. the dearest option ({dearest?.store}
                ).
              </p>
            )}
            {basket.mixedTotal > 0 &&
              basket.mixedTotal < cheapest.total - 0.005 && (
                <p className="mt-1 text-sm text-stone-500">
                  Or {euro(basket.mixedTotal)} if you split the shop and buy each
                  item at its cheapest store.
                </p>
              )}
          </div>

          {/* Budget bar */}
          {budgetNum != null && (
            <div className="mt-4 rounded-2xl bg-white/60 p-5 ring-1 ring-sage/15">
              <div className="flex items-baseline justify-between">
                <span className="text-sage-dark">
                  Budget: {euro(budgetNum)}
                </span>
                <span
                  className={
                    overBudget
                      ? "font-semibold text-blush-dark"
                      : "font-semibold text-sage-dark"
                  }
                >
                  {overBudget
                    ? `Over by ${euro(cheapest.total - budgetNum)}`
                    : `${euro(budgetNum - cheapest.total)} to spare`}
                </span>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-sage/15">
                <div
                  className={`h-full rounded-full transition-all ${
                    overBudget ? "bg-blush" : "bg-sage"
                  }`}
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-stone-500">
                {overBudget
                  ? `The cheapest basket at ${cheapest.store} is over your budget. Try trimming a few items.`
                  : `You're within budget at ${cheapest.store}. 🎉`}
              </p>
            </div>
          )}

          {/* Store comparison */}
          <div className="mt-4 rounded-2xl bg-white/60 p-5 ring-1 ring-sage/15">
            <p className="mb-3 text-sage-dark">Whole shop, store by store</p>
            <ul className="space-y-2">
              {basket.storeTotals.map((st, i) => {
                const pct =
                  dearest && dearest.total > 0
                    ? (st.total / dearest.total) * 100
                    : 0;
                return (
                  <li key={st.store}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-700">
                        {i === 0 && "🏆 "}
                        {st.store}
                      </span>
                      <span
                        className={
                          i === 0
                            ? "font-semibold text-sage-dark"
                            : "text-stone-600"
                        }
                      >
                        {euro(st.total)}
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-sage/10">
                      <div
                        className={`h-full rounded-full ${
                          i === 0 ? "bg-sage" : "bg-sage/40"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Item breakdown */}
          <div className="mt-4 rounded-2xl bg-white/60 p-5 ring-1 ring-sage/15">
            <p className="mb-3 text-sage-dark">
              Your basket ({basket.items.filter((i) => i.product).length} priced)
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-400">
                  <th className="pb-2 font-normal">Item</th>
                  <th className="pb-2 text-center font-normal">Qty</th>
                  <th className="pb-2 text-right font-normal">Cheapest</th>
                </tr>
              </thead>
              <tbody>
                {basket.items
                  .filter((i) => i.product)
                  .map((i, idx) => (
                    <tr key={idx} className="border-t border-sage/10">
                      <td className="py-2 text-stone-700">
                        {i.product!.name}
                        <span className="block text-xs text-stone-400">
                          you typed: “{i.raw}”
                        </span>
                      </td>
                      <td className="py-2 text-center text-stone-600">
                        {i.qty}
                      </td>
                      <td className="py-2 text-right text-stone-700">
                        {euro((i.bestUnitPrice ?? 0) * i.qty)}
                        <span className="block text-xs text-stone-400">
                          {i.bestStore}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {basket.unmatched.length > 0 && (
              <div className="mt-4 rounded-xl bg-blush/10 p-3 text-sm text-stone-600">
                <p className="font-semibold text-blush-dark">
                  Couldn&apos;t price {basket.unmatched.length} item
                  {basket.unmatched.length > 1 ? "s" : ""}:
                </p>
                <p className="mt-1">
                  {basket.unmatched.map((i) => `“${i.raw}”`).join(", ")}
                </p>
                <p className="mt-1 text-stone-500">
                  These aren&apos;t in the price list yet, so they&apos;re left
                  out of the totals.
                </p>
              </div>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-stone-400">
            Prices are an indicative {PRICES_UPDATED} snapshot for{" "}
            {STORES.join(", ")} in Dublin — a planning guide, not a guarantee at
            the till.{" "}
            {usedAi ? "List understood with AI ✨" : "List parsed on-device."}
          </p>
        </div>
      )}
    </div>
  );
}
