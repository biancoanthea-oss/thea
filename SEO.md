# SEO & link-sharing

This is a **private wedding gallery** — guests reach it by QR code / shared
link, and their uploaded photos and guestbook messages should stay out of
search engines. So "SEO" here means two things, in priority order:

1. **Make the shared link look great** (Open Graph / Twitter preview cards).
2. **Keep guests' content private** (noindex + `robots.txt`), unless you
   deliberately choose to be discoverable.

Everything below is controlled by a few optional environment variables — there
is a sensible default, so it works with zero config.

## What's in place

| Piece | File | What it does |
| ----- | ---- | ------------ |
| Rich metadata | `src/app/layout.tsx` | `<title>`, description, Open Graph & Twitter cards, and the indexing policy. |
| Auto-generated preview card | `src/app/opengraph-image.tsx` | A branded 1200×630 image at `/opengraph-image`, used automatically on every page. No static asset to maintain. |
| `robots.txt` | `src/app/robots.ts` | Blocks crawling by default; opens up (minus `/api`, `/gallery`, `/guestbook`) when indexing is enabled. |
| Audit script | `scripts/seo-audit.mjs` | Re-checks the live site for regressions. `npm run seo:audit -- <url>`. |
| Weekly CI audit | `.github/workflows/seo-audit.yml` | Runs the audit on a schedule and opens an issue if something breaks. |

## Configuration

Set these in `.env.local` (local) and in Vercel → Settings → Environment
Variables (production). All are optional.

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `NEXT_PUBLIC_SITE_URL` | auto (Vercel) | Canonical absolute site URL. Powers the card URLs and `robots.txt`. |
| `NEXT_PUBLIC_OG_IMAGE` | *(generated card)* | Override the preview image with a real photo URL. |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `false` | **`false` = private** (noindex, `Disallow: /`). Set `true` only to be discoverable in search. |

### Private (default, recommended for a wedding)

Do nothing. The site emits `noindex` and a `robots.txt` that disallows all
crawling, while the share-preview card still renders in iMessage, WhatsApp,
Slack, Facebook, etc. (social scrapers read the tags directly and ignore
`noindex`).

### Public / discoverable

Set `NEXT_PUBLIC_ALLOW_INDEXING=true`. The site becomes indexable, `robots.txt`
allows crawling (except guest-content routes), and a sitemap reference is
emitted. Only do this if you want the wedding site to show up in Google.

## The recurring SEO agent

Two layers, use either or both:

### 1. CI audit (no dependencies, always on)

The GitHub Action `.github/workflows/seo-audit.yml` runs `seo-audit.mjs` every
Monday and on pushes to `main`. To activate it, add a repository **variable**
`SITE_URL` (Settings → Secrets and variables → Actions → Variables). It opens
an issue labeled `seo` when a check regresses. Run it by hand anytime from the
Actions tab ("Run workflow").

### 2. Claude Routine (judgment + fixes on autopilot)

For work that needs judgment — reviewing what's changed, suggesting content or
metadata improvements, and opening a PR — schedule a recurring Claude session
that, on each run:

1. Runs `npm run seo:audit -- $SITE_URL` and reads the report.
2. Reviews the site against the goals in this file.
3. Opens a PR (or comments) with any fixes or opportunities.

Ask Claude to "set up the recurring SEO Routine" and provide the production URL
and cadence.

## Connecting real search analytics

If the goal shifts to **growth** (a public site that should rank), the agent
gets much more useful with live data. The primary source is **Google Search
Console** (impressions, clicks, queries, indexing status); Google Analytics
(GA4) adds traffic/behavior.

At the time of writing these are **not available as Claude connectors** in this
workspace, so they can't be wired in automatically. To connect them:

1. Verify the domain in Google Search Console and submit the sitemap
   (`/sitemap.xml`, emitted once `ALLOW_INDEXING=true`).
2. Export or grant access to GSC/GA4 data (API, a scheduled CSV export to
   Google Drive — which *is* connected — or a GSC MCP connector if your
   workspace adds one).
3. Point the recurring Routine at that data so it can track queries, spot
   ranking changes, and prioritize content against real growth targets.
