# Trendr — fashion trends & dupes

Discover what's trending in fashion, find the best-value **dupes** for every
piece (with prices and match scores), **save** favourites to a wishlist, and
**buy** straight from the retailer.

Built with Next.js (App Router) + TypeScript + Tailwind CSS. No backend, no
login — the wishlist lives in the browser via `localStorage`, so the whole app
is static and deploys anywhere.

## What's in it

- **Trends feed** (`/`) — every trend as a card with a live "heat" score,
  category, tags and how much you can save. Search, filter by category, and
  sort by hottest / biggest savings / A–Z.
- **Trend detail** (`/trends/[slug]`) — the story behind a trend plus each
  key piece, its original (designer) price, and a ranked list of dupes.
- **All dupes** (`/dupes`) — every dupe in one place, filter by retailer or
  budget (under $25 / $50 / $100), sort by match or price.
- **Wishlist** (`/wishlist`) — everything you've saved, with the total cost to
  buy them all and one-tap Buy links.

Every "Buy" button opens the retailer's own site (ASOS, Amazon, Zara, H&M,
Mango, SHEIN, Nordstrom, Abercrombie …). Trendr doesn't sell or ship anything.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm run start   # production build
```

## The data

All trends and dupes are curated seed data in **`src/lib/data.ts`** — edit that
one file to add trends, pieces, or dupes; the types live in
`src/lib/types.ts`. Prices are indicative (USD) and each Buy link points at the
retailer's search page for the item, so links keep working as products sell
out.

### Where to take it next

- Swap the gradient thumbnails (`src/components/Thumb.tsx`) for real product
  photos.
- Replace the static dataset with a live feed / affiliate API and turn the
  Buy links into affiliate links.
- Add accounts (e.g. Supabase) to sync the wishlist across devices — the app
  was scaffolded from a Supabase-ready setup, so the wiring is straightforward.

## Structure

```
src/
  app/
    page.tsx                 # home / trends feed
    trends/[slug]/page.tsx   # trend detail
    dupes/page.tsx           # all dupes browser
    wishlist/page.tsx        # saved dupes
  components/                # Nav, cards, filters, wishlist context
  lib/
    data.ts                  # curated trends + dupes  ← edit here
    types.ts                 # data model
    format.ts                # money / savings helpers
```
