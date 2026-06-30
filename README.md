# Pantry Snap 🍳 → 🛒

Found a recipe video or screenshot you want to make? Drop it into Pantry Snap
and get back a tidy, aisle-by-aisle **shopping list** of everything you need to
buy — with quantities, checkboxes, and a one-tap copy.

- **Upload a screenshot** of a recipe (Instagram/TikTok caption, a recipe page,
  a photo of a cookbook) and it reads the ingredients.
- **Upload a video** and it samples frames across the clip — catching on-screen
  ingredient overlays and what's actually being cooked — then merges them into
  one list.
- **Paste the caption / link** alongside the media for extra accuracy.
- **Tick items off**, copy the list to your notes app, and **save lists** for
  later. Saved lists live in your browser — no account, no database.

Built with **Next.js (App Router, TypeScript)**, **Tailwind CSS**, and the
**Anthropic Claude API** (vision + structured outputs). Deploys to **Vercel**.

---

## How it works

1. The browser downsizes your screenshots and grabs a handful of frames from any
   video (using a `<canvas>` — no upload of the raw video).
2. Those images, plus any caption text, are sent to one server route
   (`/api/extract`).
3. That route calls **Claude Opus 4.8** with a JSON-schema
   [structured output](https://platform.claude.com/docs/en/build-with-claude/structured-outputs),
   so the response is always a clean list of `{ name, quantity, category, note }`.
4. The UI groups the items by grocery aisle and lets you check them off.

Your Anthropic key only ever lives on the server. The video itself never leaves
your device — only the sampled still frames do.

---

## 1. Get an Anthropic API key

Create one at [console.anthropic.com](https://console.anthropic.com/) →
**API Keys**.

## 2. Configure the environment

```bash
cp .env.local.example .env.local
```

```env
ANTHROPIC_API_KEY=sk-ant-...
```

| Variable            | Exposed to browser? | Purpose                                 |
| ------------------- | ------------------- | --------------------------------------- |
| `ANTHROPIC_API_KEY` | **No (server only)**| Recipe → shopping-list extraction       |

## 3. Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. To test from your **phone** on the same Wi-Fi,
run `npm run dev -- -H 0.0.0.0` and visit `http://YOUR-COMPUTER-IP:3000`.

Quick test: take a screenshot of any recipe, drop it in, and hit
**Get my shopping list**.

## 4. Deploy to Vercel

1. Push this repo to GitHub.
2. At [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Under **Environment Variables**, add `ANTHROPIC_API_KEY`.
4. **Deploy.** You get a public URL like `pantry-snap.vercel.app`.

> After changing env vars in Vercel, redeploy for them to take effect.

---

## Notes & limits

- **Frames sampled per video:** up to 5, spread across the clip. Long videos
  with ingredients shown only briefly may need a screenshot of the ingredient
  list for best results — or paste the caption.
- **Estimated quantities:** if the recipe doesn't state an amount, Claude
  suggests a sensible shopping quantity and flags it in the list's notes.
- **Cost:** each list is a single Claude API call. Keeping frames small (the app
  downsizes them automatically) keeps requests fast and cheap.
- **Privacy:** saved lists are stored in your browser's `localStorage` only.
  Clearing site data removes them.
