// Shared, browser-safe configuration values.

export const COUPLE_NAME =
  process.env.NEXT_PUBLIC_COUPLE_NAME?.trim() || "Sarah & Lairkin";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const BUCKET = "uploads";

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
