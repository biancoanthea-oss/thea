# Free Marketing Suite 📈

A free, self-hosted marketing suite that covers the **basics** of two expensive
SaaS products:

- **SEO Tools (SEMrush-lite)** — on-page audit of any URL with a graded
  checklist, page facts, optional Core Web Vitals, and free keyword ideas.
- **CRM (HubSpot-lite)** — contacts with lifecycle status and an activity
  timeline, plus a deal pipeline board.

Built with **Next.js (App Router, TypeScript)**, **Supabase** (Postgres),
**Tailwind CSS**, and deployed to **Vercel**. Runs entirely on free tiers.

## Can you *really* clone SEMrush & HubSpot for free?

Honest answer: **the software, yes — the data, no.**

- **HubSpot** is mostly application software (contacts, deals, activity). That
  part is very reproducible on a free stack, and that's what this app does.
- **SEMrush's** real value is a proprietary index built from continuously
  crawling billions of pages for keywords, search volume, difficulty, and
  backlinks. That crawl costs millions/year and **cannot be sourced for free.**

So this suite deliberately implements only what's genuinely free:

| Feature | How it's free | Not included (needs paid data) |
| --- | --- | --- |
| On-page SEO audit | Server-side fetch + HTML parse | — |
| Core Web Vitals | Google PageSpeed Insights API (free) | — |
| Keyword ideas | Google Autocomplete (public) | search **volume**, difficulty |
| Backlinks | — | requires a crawl index |
| CRM | Supabase free tier | — |

## Pages

| Route          | What                                                          |
| -------------- | ------------------------------------------------------------ |
| `/`            | Dashboard — pipeline value, contact count, avg SEO score     |
| `/seo`         | Run an on-page audit + get keyword ideas                     |
| `/crm`         | Contacts list, details, notes, and activity timeline         |
| `/crm/deals`   | Deal pipeline board (Lead → Qualified → Proposal → Won/Lost) |

---

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com) (free).
2. **SQL Editor → New query** → paste [`supabase/schema.sql`](./supabase/schema.sql)
   and **Run**. This creates the `contacts`, `deals`, `activities`, and
   `seo_audits` tables with Row Level Security enabled (deny-all to the public
   anon key; the server routes use the service_role key).
3. **Project Settings → API** — copy the **Project URL**, **anon public** key,
   and **service_role** key.

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

| Variable                        | Exposed to browser? | Purpose                                   |
| ------------------------------- | ------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes                 | Supabase project URL                      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes                 | Present for completeness                  |
| `SUPABASE_SERVICE_ROLE_KEY`     | **No (server only)**| All CRM/SEO reads & writes                |
| `NEXT_PUBLIC_APP_NAME`          | Yes                 | App name in nav/title (optional)          |
| `PAGESPEED_API_KEY`             | **No (server only)**| Higher PageSpeed rate limit (optional)    |

> The **SEO auditor works without Supabase** — you just won't get saved audit
> history. The CRM needs the database.

## 3. Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## 4. Deploy to Vercel

1. Push this repo to GitHub.
2. At [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Add the same environment variables under **Settings → Environment Variables**.
4. **Deploy.**

---

## Security model

- All CRM and SEO data flows through **server-side API routes** (`/api/*`) that
  use the **service_role key**, which never reaches the browser.
- RLS is **enabled with no anon policies**, so the public anon key can't read or
  write anything directly.
- This app has **no auth/login** — anyone with the URL can use the CRM. For real
  use, put it behind Vercel password protection or add Supabase Auth + per-user
  RLS policies before storing real customer data.

## Notes on limits

- The SEO auditor fetches pages server-side; some sites block bots or time out
  (12s limit) — that's reported, not a crash.
- Keyword ideas come from autocomplete and are related queries, **not** volume.
- Supabase free tier is generous for a CRM (500 MB Postgres); you'll hit no
  meaningful limits for typical small-team use.
