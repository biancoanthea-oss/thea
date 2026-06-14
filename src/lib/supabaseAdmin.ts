import { createClient } from "@supabase/supabase-js";

// Server-only client using the SERVICE ROLE key. Never import this from a
// client component. It is used exclusively by the password-protected admin
// API routes to list uploads and guestbook messages.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function getAdminClient() {
  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
