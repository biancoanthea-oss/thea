// Shared, browser-safe configuration values.

export const COUPLE_NAME =
  process.env.NEXT_PUBLIC_COUPLE_NAME?.trim() || "Sarah & Lairkin";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const BUCKET = "uploads";

// ── SEO / sharing ────────────────────────────────────────────────
// Canonical, absolute URL of the deployed site (no trailing slash).
// Used for metadataBase, Open Graph / Twitter card URLs, and robots.txt.
// On Vercel, VERCEL_PROJECT_PRODUCTION_URL is injected automatically.
export const SITE_URL = (() => {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "");
  return raw.replace(/\/+$/, "");
})();

// Optional override for the link-preview (OG) card image. When empty, the
// site auto-generates a branded 1200×630 card at /opengraph-image (see
// src/app/opengraph-image.tsx). Set this to a real photo URL to override.
export const OG_IMAGE = process.env.NEXT_PUBLIC_OG_IMAGE?.trim() || "";

// A wedding gallery is private by default: guests reach it by link/QR,
// and their photos & messages should stay OUT of search engines.
// Set NEXT_PUBLIC_ALLOW_INDEXING=true to make the site publicly indexable.
export const ALLOW_INDEXING =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING?.trim().toLowerCase() === "true";

// Optional per-file upload cap (MB). Empty / invalid → no cap.
export const MAX_UPLOAD_MB = (() => {
  const raw = process.env.NEXT_PUBLIC_MAX_UPLOAD_MB;
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
})();

// Public URL for a stored object (bucket is public-read).
export function publicUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}
