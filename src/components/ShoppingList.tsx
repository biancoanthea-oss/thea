"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, type Category, type ExtractionResult } from "@/lib/types";

type Props = {
  result: ExtractionResult;
  checked: boolean[];
  onToggle: (index: number) => void;
  /** Shown in the header actions row, e.g. a Save or Delete button. */
  actions?: React.ReactNode;
};

function plainText(result: ExtractionResult, checked: boolean[]): string {
  const lines: string[] = [];
  if (result.title) lines.push(result.title);
  if (result.servings) lines.push(result.servings);
  lines.push("");
  result.ingredients.forEach((ing, i) => {
    const box = checked[i] ? "[x]" : "[ ]";
    const qty = ing.quantity ? `${ing.quantity} ` : "";
    const note = ing.note ? ` (${ing.note})` : "";
    lines.push(`${box} ${qty}${ing.name}${note}`);
  });
  return lines.join("\n");
}

export default function ShoppingList({
  result,
  checked,
  onToggle,
  actions,
}: Props) {
  const [copied, setCopied] = useState(false);

  // Group ingredient indices by category, preserving CATEGORIES order.
  const grouped = useMemo(() => {
    const map = new Map<Category, number[]>();
    result.ingredients.forEach((ing, i) => {
      const cat = (CATEGORIES as readonly string[]).includes(ing.category)
        ? ing.category
        : "Other";
      const list = map.get(cat) ?? [];
      list.push(i);
      map.set(cat, list);
    });
    return CATEGORIES.map((cat) => [cat, map.get(cat) ?? []] as const).filter(
      ([, idxs]) => idxs.length > 0,
    );
  }, [result.ingredients]);

  const total = result.ingredients.length;
  const done = checked.filter(Boolean).length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(plainText(result, checked));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be blocked; ignore */
    }
  };

  return (
    <div className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-herb/10 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-herb-dark">
            {result.title || "Your shopping list"}
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {result.servings ? `${result.servings} · ` : ""}
            {done} of {total} ticked off
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copy}
            className="rounded-full bg-herb/10 px-4 py-2 text-sm font-medium text-herb-dark transition hover:bg-herb/20"
          >
            {copied ? "✓ Copied" : "Copy list"}
          </button>
          {actions}
        </div>
      </div>

      {result.notes.length > 0 && (
        <ul className="mt-4 space-y-1 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {result.notes.map((note, i) => (
            <li key={i}>• {note}</li>
          ))}
        </ul>
      )}

      <div className="mt-5 space-y-6">
        {grouped.map(([category, indices]) => (
          <section key={category}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-carrot">
              {category}
            </h3>
            <ul className="mt-2 divide-y divide-stone-100">
              {indices.map((i) => {
                const ing = result.ingredients[i];
                const isChecked = checked[i] ?? false;
                return (
                  <li key={i}>
                    <label className="flex cursor-pointer items-start gap-3 py-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggle(i)}
                        className="mt-1 h-5 w-5 shrink-0 accent-herb"
                      />
                      <span
                        className={
                          isChecked ? "text-stone-400 line-through" : "text-stone-800"
                        }
                      >
                        <span className="font-medium">{ing.name}</span>
                        {ing.quantity && (
                          <span className="text-stone-500"> — {ing.quantity}</span>
                        )}
                        {ing.note && (
                          <span className="text-stone-400"> ({ing.note})</span>
                        )}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
