"use client";

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

// Browser client — uses the ANON key only. With RLS in place this key can
// INSERT uploads/messages but cannot read or delete other guests' data.
// Fallbacks keep `next build` from throwing when env vars aren't present at
// build time; the real values are injected at runtime.
export const supabase = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "placeholder-anon-key",
  {
    auth: { persistSession: false },
  },
);
