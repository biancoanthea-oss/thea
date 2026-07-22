# Tender Studio

A private workspace for **writing tenders faster and better**. Keep the best
parts of every bid in a reusable **content library**, assemble new tenders by
dropping those blocks in, let **AI help polish and tailor** each response, and
export the finished bid to **Word**.

Built for repeat tender writing at **Stacked**.

Built with **Next.js (App Router, TypeScript)** and **Tailwind CSS**. Your data
is stored **in your browser** — no accounts, no database, nothing to set up to
start using it.

## What it does

| Area                | What you get                                                                 |
| ------------------- | ---------------------------------------------------------------------------- |
| **Content Library** | Save reusable "blocks" (company overview, H&S, quality, case studies, …). Search by title, text, tag or category. Refine any block with AI. |
| **Tender builder**  | Create a tender, add sections from your library or blank, reorder, edit. See most-reused blocks so your best material rises to the top. |
| **AI writing help** | Per section/block: **Improve**, **More formal**, **Shorten**, **Expand**, **Tailor to client**. Plus **AI draft** — answer a tender question using selected library blocks as source material. |
| **Export**          | Download the assembled tender as a formatted **.docx** Word file, or copy all the text to paste into a portal. |
| **Backup**          | Export/import your whole library + tenders as a JSON file to back up or move to another computer. |

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The library seeds with a few example blocks on
first run — edit them to match Stacked's real content.

### Turn on AI (optional)

The app is fully usable without AI. To switch on the ✨ writing helpers:

```bash
cp .env.local.example .env.local
```

Paste your Anthropic API key into `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Restart the dev server. Get a key at
[console.anthropic.com](https://console.anthropic.com). AI requests use Claude
(`claude-opus-4-8`) and run server-side, so your key never reaches the browser.

## Where your data lives

Everything is saved in this browser's `localStorage`. That means:

- **Nothing to set up** — it works the moment you open it.
- **It's per-browser** — clearing browser data, or switching computer, loses it
  unless you've exported a backup. Use **Dashboard → Backup & restore → Export
  backup** regularly. Cloud sync can be added later if you want it.

## Deploy

Deploy to any Next.js host (e.g. Vercel: **Add New → Project → import the
repo**). Add `ANTHROPIC_API_KEY` as an environment variable if you want AI
enabled in the deployed app. Since data is browser-local, each person's library
lives on their own device until backups are shared or cloud sync is added.

## Project structure

```
src/
  app/
    page.tsx              Dashboard (stats, recent tenders, backup)
    library/page.tsx      Content library
    tenders/page.tsx      Tender list
    tenders/[id]/page.tsx Tender editor
    api/ai/route.ts       Server-side Claude endpoint
  components/             Nav, editors, AI assist, library picker, backup
  lib/
    types.ts              Data model
    storage.ts            localStorage data layer + React hooks
    seed.ts               Starter categories & example blocks
    ai.ts                 Client wrapper for the AI endpoint
    docxExport.ts         Word (.docx) export
```
