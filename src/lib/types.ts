// ─────────────────────────────────────────────────────────────
// Core data model for the Trendr fashion-trends + dupes app.
// ─────────────────────────────────────────────────────────────

/** A cheaper alternative ("dupe") to an original/designer piece. */
export interface Dupe {
  id: string;
  /** Store/brand that sells this dupe, e.g. "ASOS", "Amazon", "Zara". */
  retailer: string;
  /** Product name as it appears at the retailer. */
  name: string;
  /** Price in the piece's currency (see Piece.currency). */
  price: number;
  /** Outbound link to the retailer's real product/search page. */
  url: string;
  /** How close it is to the original, 0–100. */
  matchPercent: number;
  /** A couple of quick selling points. */
  notes?: string;
}

/** The original (usually pricier / designer) item people are chasing. */
export interface Original {
  brand: string;
  name: string;
  price: number;
}

/** A single garment/accessory within a trend, plus its dupes. */
export interface Piece {
  id: string;
  name: string;
  /** e.g. "Bags", "Denim", "Outerwear". */
  category: string;
  /** Two hex colors used to render the gradient thumbnail. */
  palette: [string, string];
  original: Original;
  dupes: Dupe[];
}

/** A trend (aesthetic / moment) that groups several pieces. */
export interface Trend {
  slug: string;
  title: string;
  /** Short one-liner shown on cards. */
  blurb: string;
  /** Longer paragraph shown on the detail page. */
  description: string;
  /** e.g. "Aesthetic", "Streetwear", "Red carpet". */
  category: string;
  /** Trending score 0–100 — drives the "heat" badge and sort order. */
  heat: number;
  /** Which way the trend is moving right now. */
  direction: "up" | "steady" | "down";
  tags: string[];
  /** Two hex colors for the trend's hero gradient. */
  palette: [string, string];
  pieces: Piece[];
}

/** Currency is USD across the seed data; kept here so it's easy to change. */
export const CURRENCY = "USD";
export const CURRENCY_SYMBOL = "$";

/** Minimal shape stored in the wishlist (localStorage). */
export interface WishlistItem {
  dupeId: string;
  retailer: string;
  name: string;
  price: number;
  url: string;
  trendSlug: string;
  trendTitle: string;
  pieceName: string;
  palette: [string, string];
  savedAt: number;
}
