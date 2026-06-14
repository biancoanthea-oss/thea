-- ============================================================================
--  Sarah & Lairkin's Wedding — Supabase schema + Row Level Security
--  Run this once in: Supabase Dashboard → SQL Editor → New query → Run.
--  (Create the public Storage bucket named "uploads" first.)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.uploads (
  id           uuid primary key default gen_random_uuid(),
  file_url     text not null,
  file_type    text not null check (file_type in ('image', 'video')),
  uploader_name text,
  created_at   timestamptz not null default now()
);

create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  guest_name  text,
  message     text not null,
  created_at  timestamptz not null default now()
);

create index if not exists uploads_created_at_idx
  on public.uploads (created_at desc);
create index if not exists messages_created_at_idx
  on public.messages (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
--   Anonymous guests may ONLY INSERT. They cannot SELECT, UPDATE or DELETE
--   through the API. The admin pages read this data server-side using the
--   service_role key, which bypasses RLS and is never sent to the browser.
-- ---------------------------------------------------------------------------
alter table public.uploads  enable row level security;
alter table public.messages enable row level security;

-- uploads: insert-only for anonymous (and logged-in) guests
drop policy if exists "guests can insert uploads" on public.uploads;
create policy "guests can insert uploads"
  on public.uploads
  for insert
  to anon, authenticated
  with check (true);

-- messages: insert-only for anonymous (and logged-in) guests
drop policy if exists "guests can insert messages" on public.messages;
create policy "guests can insert messages"
  on public.messages
  for insert
  to anon, authenticated
  with check (true);

-- No SELECT / UPDATE / DELETE policies are defined for anon, so those
-- operations are denied by default. (service_role bypasses RLS entirely.)

-- ---------------------------------------------------------------------------
-- Storage policies for the "uploads" bucket
--   Allow anonymous guests to upload files (INSERT), and allow public read
--   so the gallery/slideshow can display media via public URLs. No update or
--   delete is granted to anonymous users.
-- ---------------------------------------------------------------------------

-- Public read of objects in the bucket (the bucket should also be marked
-- "Public" in the dashboard; this policy makes the intent explicit).
drop policy if exists "public read uploads bucket" on storage.objects;
create policy "public read uploads bucket"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'uploads');

-- Anonymous guests may upload into the bucket.
drop policy if exists "guests can upload to uploads bucket" on storage.objects;
create policy "guests can upload to uploads bucket"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'uploads');
