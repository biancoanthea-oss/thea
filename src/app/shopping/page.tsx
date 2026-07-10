"use client";

import { useCallback, useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { COUPLE_NAME } from "@/lib/config";
import { supabase } from "@/lib/supabaseClient";
import type { ShoppingItem } from "@/lib/types";

const NAME_KEY = "wedding_shopper_name";

export default function ShoppingPage() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("shopping_items")
      .select("id, item, quantity, note, added_by, is_purchased, created_at")
      .order("created_at", { ascending: true });
    if (error) {
      setError(error.message);
    } else {
      setItems(data ?? []);
      setError("");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setName(window.localStorage.getItem(NAME_KEY) ?? "");
    }
    load();
  }, [load]);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = item.trim();
    if (!trimmed || adding) return;
    setAdding(true);
    setError("");
    const cleanName = name.trim();
    if (typeof window !== "undefined") {
      window.localStorage.setItem(NAME_KEY, cleanName);
    }
    const { data, error } = await supabase
      .from("shopping_items")
      .insert({
        item: trimmed,
        quantity: quantity.trim() || null,
        added_by: cleanName || null,
      })
      .select("id, item, quantity, note, added_by, is_purchased, created_at")
      .single();
    if (error) {
      setError(error.message);
    } else if (data) {
      setItems((prev) => [...prev, data]);
      setItem("");
      setQuantity("");
    }
    setAdding(false);
  }

  async function togglePurchased(target: ShoppingItem) {
    const next = !target.is_purchased;
    // Optimistic update.
    setItems((prev) =>
      prev.map((i) => (i.id === target.id ? { ...i, is_purchased: next } : i)),
    );
    const { error } = await supabase
      .from("shopping_items")
      .update({ is_purchased: next })
      .eq("id", target.id);
    if (error) {
      // Revert on failure.
      setItems((prev) =>
        prev.map((i) =>
          i.id === target.id ? { ...i, is_purchased: !next } : i,
        ),
      );
      setError(error.message);
    }
  }

  async function removeItem(target: ShoppingItem) {
    if (!window.confirm(`Remove "${target.item}" from the list?`)) return;
    const prev = items;
    setItems((cur) => cur.filter((i) => i.id !== target.id));
    const { error } = await supabase
      .from("shopping_items")
      .delete()
      .eq("id", target.id);
    if (error) {
      setItems(prev); // Restore on failure.
      setError(error.message);
    }
  }

  const remaining = items.filter((i) => !i.is_purchased).length;

  return (
    <div className="min-h-screen bg-cream">
      <AdminNav active="/shopping" />
      <main className="mx-auto max-w-2xl px-5 py-8">
        <header className="mb-8 text-center">
          <h1 className="font-script text-5xl text-sage-dark">{COUPLE_NAME}</h1>
          <p className="text-stone-600">Shopping List</p>
        </header>

        <form
          onSubmit={addItem}
          className="mb-8 rounded-2xl bg-white/60 p-5 shadow-sm ring-1 ring-sage/10"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="What do we need? (e.g. Prosecco)"
              className="flex-1 rounded-xl border border-sage/40 bg-white/70 px-4 py-3 text-stone-700 outline-none focus:border-sage focus:ring-2 focus:ring-sage/30"
            />
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Qty"
              className="w-full rounded-xl border border-sage/40 bg-white/70 px-4 py-3 text-stone-700 outline-none focus:border-sage focus:ring-2 focus:ring-sage/30 sm:w-28"
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="flex-1 rounded-xl border border-sage/40 bg-white/70 px-4 py-2 text-sm text-stone-700 outline-none focus:border-sage focus:ring-2 focus:ring-sage/30"
            />
            <button
              type="submit"
              disabled={adding || !item.trim()}
              className="rounded-full bg-sage px-6 py-2 text-cream transition-colors hover:bg-sage-dark disabled:opacity-50"
            >
              {adding ? "Adding…" : "Add item"}
            </button>
          </div>
        </form>

        {loading && <p className="text-stone-500">Loading…</p>}
        {error && <p className="mb-4 text-red-600">{error}</p>}
        {!loading && items.length === 0 && (
          <p className="text-center text-stone-500">
            The list is empty — add the first thing you need above.
          </p>
        )}

        {!loading && items.length > 0 && (
          <>
            <p className="mb-3 text-sm text-stone-500">
              {remaining} of {items.length}{" "}
              {items.length === 1 ? "item" : "items"} still to buy
            </p>
            <ul className="space-y-2">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center gap-3 rounded-2xl bg-white/60 p-4 shadow-sm ring-1 ring-sage/10"
                >
                  <input
                    type="checkbox"
                    checked={i.is_purchased}
                    onChange={() => togglePurchased(i)}
                    aria-label={`Mark ${i.item} as bought`}
                    className="h-5 w-5 shrink-0 accent-sage"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-lg ${
                        i.is_purchased
                          ? "text-stone-400 line-through"
                          : "text-stone-700"
                      }`}
                    >
                      {i.item}
                      {i.quantity && (
                        <span className="ml-2 text-sm text-stone-500">
                          × {i.quantity}
                        </span>
                      )}
                    </p>
                    {i.added_by?.trim() && (
                      <p className="text-xs text-stone-400">
                        added by {i.added_by.trim()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(i)}
                    aria-label={`Remove ${i.item}`}
                    title="Remove"
                    className="shrink-0 rounded-full px-2 py-1 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
