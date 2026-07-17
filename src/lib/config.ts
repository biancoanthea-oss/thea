// Shared, browser-safe configuration values.

export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME?.trim() || "Free Marketing Suite";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Deal pipeline stages (HubSpot-lite). Order matters — this is left→right on
// the board and the funnel order in reports.
export const DEAL_STAGES = [
  "lead",
  "qualified",
  "proposal",
  "won",
  "lost",
] as const;
export type DealStage = (typeof DEAL_STAGES)[number];

export const STAGE_LABELS: Record<DealStage, string> = {
  lead: "Lead",
  qualified: "Qualified",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

// Contact lifecycle statuses.
export const CONTACT_STATUSES = [
  "subscriber",
  "lead",
  "customer",
  "churned",
] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];
