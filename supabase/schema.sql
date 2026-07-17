-- ============================================================================
--  Free Marketing Suite — Supabase schema + Row Level Security
--  Run this once in: Supabase Dashboard → SQL Editor → New query → Run.
--
--  Security model: all reads/writes go through server-side API routes that use
--  the service_role key (which bypasses RLS and never reaches the browser).
--  RLS is enabled with NO anon policies, so the public anon key can touch
--  nothing. (Add auth + policies later if you want per-user data.)
-- ============================================================================

-- ── CRM (HubSpot-lite) ──────────────────────────────────────────────────────

create table if not exists public.contacts (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,
  company    text,
  phone      text,
  status     text not null default 'lead'
             check (status in ('subscriber', 'lead', 'customer', 'churned')),
  notes      text,
  created_at timestamptz not null default now()
);

create table if not exists public.deals (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  value      numeric not null default 0,
  stage      text not null default 'lead'
             check (stage in ('lead', 'qualified', 'proposal', 'won', 'lost')),
  contact_id uuid references public.contacts (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id         uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  type       text not null default 'note'
             check (type in ('note', 'call', 'email', 'task')),
  body       text not null,
  created_at timestamptz not null default now()
);

-- ── SEO (SEMrush-lite) ───────────────────────────────────────────────────────

create table if not exists public.seo_audits (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  score      integer not null default 0,
  result     jsonb not null,
  created_at timestamptz not null default now()
);

-- ── Indexes ─────────────────────────────────────────────────────────────────

create index if not exists contacts_created_at_idx on public.contacts (created_at desc);
create index if not exists deals_stage_idx          on public.deals (stage);
create index if not exists activities_contact_idx   on public.activities (contact_id, created_at desc);
create index if not exists seo_audits_created_at_idx on public.seo_audits (created_at desc);

-- ── Row Level Security (deny-all to anon; service_role bypasses) ─────────────

alter table public.contacts   enable row level security;
alter table public.deals      enable row level security;
alter table public.activities enable row level security;
alter table public.seo_audits enable row level security;

-- No policies are created for the anon role, so all anon access is denied by
-- default. The server API routes use the service_role key and are unaffected.
