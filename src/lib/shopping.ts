// ─────────────────────────────────────────────────────────────
// Shopping-list intelligence: turn free-typed text into structured
// line items, match them to the price catalog, and work out the
// cheapest way to buy the basket across the Dublin supermarkets.
//
// Everything here is pure and runs in the browser — no API key needed.
// (An optional Claude-powered parser lives at /api/parse-list and, when a
//  key is configured, hands cleaner item names to matchLine below.)
// ─────────────────────────────────────────────────────────────

import { CATALOG, Product, Store, STORES } from "./prices";

export interface ParsedItem {
  /** The raw text the shopper typed for this line. */
  raw: string;
  /** How many units they want (defaults to 1). */
  qty: number;
  /** The cleaned-up name we searched the catalog with. */
  query: string;
}

export interface MatchedItem extends ParsedItem {
  /** The catalog product we matched, or null if we couldn't find one. */
  product: Product | null;
  /** Cheapest single-store unit price for this product. */
  bestUnitPrice: number | null;
  /** The store offering that cheapest price. */
  bestStore: Store | null;
}

export interface StoreTotal {
  store: Store;
  /** Total for buying every matched item at this one store. */
  total: number;
}

export interface BasketResult {
  items: MatchedItem[];
  /** Items we couldn't price. */
  unmatched: MatchedItem[];
  /** Per-store total if you did the whole shop in one place, sorted cheapest first. */
  storeTotals: StoreTotal[];
  /** Cheapest single store to do the whole shop. */
  cheapestStore: StoreTotal | null;
  /** Dearest single store — used to show the potential saving. */
  dearestStore: StoreTotal | null;
  /** Total if you cherry-picked each item at its cheapest store. */
  mixedTotal: number;
}

// A number word → digit lookup for quantities like "a dozen eggs".
const NUMBER_WORDS: Record<string, number> = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10, dozen: 12,
  couple: 2, few: 3,
};

// Words that carry no meaning for matching and should be stripped.
const STOPWORDS = new Set([
  "of", "the", "a", "an", "some", "please", "fresh", "large", "small",
  "pack", "packet", "bag", "box", "tin", "can", "bottle", "carton",
]);

/** Split raw multi-line / comma text into individual line strings. */
export function splitLines(text: string): string[] {
  return text
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Pull a quantity and a clean search query out of one typed line. */
export function parseLine(raw: string): ParsedItem {
  let working = raw.trim().toLowerCase();
  let qty = 1;

  // "2x milk" / "milk x2" / "milk x 2"
  const xMatch =
    working.match(/^\s*(\d+)\s*x\s+/) || working.match(/\bx\s*(\d+)\b/);
  if (xMatch) {
    qty = parseInt(xMatch[1], 10);
    working = working.replace(xMatch[0], " ");
  } else {
    // Leading digit: "3 apples", "2 milk"
    const numMatch = working.match(/^\s*(\d+)\s+/);
    if (numMatch) {
      qty = parseInt(numMatch[1], 10);
      working = working.slice(numMatch[0].length);
    } else {
      // Leading number word: "a dozen eggs", "two loaves"
      const first = working.split(/\s+/)[0];
      if (first in NUMBER_WORDS && working.split(/\s+/).length > 1) {
        qty = NUMBER_WORDS[first];
        working = working.replace(/^\s*\S+\s+/, "");
      }
    }
  }

  const query = working
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w))
    .join(" ")
    .trim();

  return { raw: raw.trim(), qty: qty > 0 ? qty : 1, query: query || working.trim() };
}

/** Score how well a query matches a product (higher = better; 0 = no match). */
function scoreProduct(query: string, product: Product): number {
  const haystacks = [product.name.toLowerCase(), ...product.aliases];
  const qTokens = query.split(/\s+/).filter(Boolean);
  if (qTokens.length === 0) return 0;

  let best = 0;
  for (const hay of haystacks) {
    // Exact alias hit is the strongest signal.
    if (hay === query) {
      best = Math.max(best, 100);
      continue;
    }
    const hayTokens = hay.split(/\s+/).filter(Boolean);
    let shared = 0;
    for (const qt of qTokens) {
      if (
        hayTokens.some(
          (ht) => ht === qt || ht.startsWith(qt) || qt.startsWith(ht),
        )
      ) {
        shared++;
      }
    }
    if (shared > 0) {
      // Reward matching a high fraction of both sides.
      const score =
        (shared / qTokens.length) * 40 + (shared / hayTokens.length) * 20;
      best = Math.max(best, score);
    }
  }
  return best;
}

/** Find the best catalog product for a parsed line, if any. */
export function matchLine(item: ParsedItem): MatchedItem {
  let bestProduct: Product | null = null;
  let bestScore = 0;

  for (const product of CATALOG) {
    const score = scoreProduct(item.query, product);
    if (score > bestScore) {
      bestScore = score;
      bestProduct = product;
    }
  }

  // Require a minimum confidence so gibberish stays unmatched.
  if (!bestProduct || bestScore < 15) {
    return { ...item, product: null, bestUnitPrice: null, bestStore: null };
  }

  let bestStore: Store | null = null;
  let bestUnitPrice = Infinity;
  for (const store of STORES) {
    const p = bestProduct.prices[store];
    if (p < bestUnitPrice) {
      bestUnitPrice = p;
      bestStore = store;
    }
  }

  return { ...item, product: bestProduct, bestUnitPrice, bestStore };
}

/** Full pipeline: raw text → priced basket with store comparison. */
export function buildBasket(items: MatchedItem[]): BasketResult {
  const matched = items.filter((i) => i.product);
  const unmatched = items.filter((i) => !i.product);

  const storeTotals: StoreTotal[] = STORES.map((store) => {
    const total = matched.reduce(
      (sum, i) => sum + (i.product ? i.product.prices[store] * i.qty : 0),
      0,
    );
    return { store, total };
  }).sort((a, b) => a.total - b.total);

  const mixedTotal = matched.reduce(
    (sum, i) => sum + (i.bestUnitPrice ?? 0) * i.qty,
    0,
  );

  return {
    items,
    unmatched,
    storeTotals,
    cheapestStore: matched.length ? storeTotals[0] : null,
    dearestStore: matched.length ? storeTotals[storeTotals.length - 1] : null,
    mixedTotal,
  };
}

/** Convenience: raw text → parsed → matched line items. */
export function parseAndMatch(text: string): MatchedItem[] {
  return splitLines(text).map((line) => matchLine(parseLine(line)));
}

export function euro(n: number): string {
  return `€${n.toFixed(2)}`;
}
