# Marketing Skills 📈

A self-hosted toolkit for the weekly AI-powered SEO workflow: export your
Google Search Console data, drop it in, get instant findings, and copy
ready-to-paste **Claude** prompts (for analysis and content) and
**Lovable**-ready fix instructions (for shipping the changes same-day).

Built with **Next.js (App Router, TypeScript)** and **Tailwind CSS**.
100% client-side — your Search Console data never leaves the browser.
No database, no API keys, no accounts. Deploys to Vercel free tier.

## What it does

### 1. Analyzer

Upload the standard Search Console CSV export (**Performance → Export →
CSV**, either `Queries.csv` or `Pages.csv`) and get:

| Finding | What it means | Prompt you get |
| --- | --- | --- |
| **Content gaps** | Real demand (≥100 impressions) with ≤1 click and position >8 — nothing of yours ranks | Full article brief: title tag, meta, FAQ, JSON-LD, screenshot markers |
| **Striking distance** | Position 4–15 with real impressions — a small push reaches page 1 | On-page action plan + internal-linking targets + Lovable prompt |
| **CTR underperformers** | Top-10 ranking but CTR far below the position's expected curve | Title/meta rewrite with 3 title + 2 meta options + Lovable prompt |
| **Cannibalization** | One query served by multiple pages (needs a query+page export from the GSC API or Looker Studio) | Consolidation plan: winner, redirects/canonicals, merge list |
| **Top performers** | Your best pages — protect and refresh before they slip | — |

Plus a one-click **weekly analysis prompt** that packages the entire
export summary for Claude to prioritize.

### 2. Audit checklist

24-point SEO + AEO audit across Technical, On-page, Content, and
**AI Engine Optimization** (the stuff that gets ChatGPT, Gemini,
Perplexity — and Claude — citing your site organically). Progress is
saved in your browser.

### 3. Weekly workflow

The full routine documented step by step: export → analyze → ask Claude
→ ship via Lovable → draft content → close the loop.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>, set your site domain (it's baked into every
generated prompt), and drop in a CSV.

## Deploy to Vercel

1. Push this repo to GitHub.
2. [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. **Deploy.** No environment variables needed.

## Privacy

Everything runs in the browser. The CSV is parsed with JavaScript on your
machine; nothing is uploaded to any server. The site name and checklist
state live in `localStorage` only.
