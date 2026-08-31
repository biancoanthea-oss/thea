# Google Ads strategy

Read `../brief.md` first. Numbers marked `TODO` there gate the budget decisions
below.

## The sequencing rule

**Search first, Performance Max second — and PMax only after Search is
profitable.** PMax is a conversion-data machine: it needs roughly 30–50
conversions in 30 days before its bidding stops guessing. Launching PMax on a
cold account spends the budget learning what Search would have taught it for
less. On top of that, PMax cannibalises brand and high-intent search terms and
reports them in a black box, so you cannot tell what you actually paid for.

```
Phase 0  Foundations      → landing page + conversion tracking     (BLOCKING)
Phase 1  Brand Search     → cheap, defensive                       (week 1)
Phase 2  Non-brand Search → the real test, exact + phrase          (weeks 1–6)
Phase 3  Scale Search     → broad match w/ good negatives          (once CPA holds)
Phase 4  Performance Max  → only at 30+ conv/month                 (month 3+)
```

## Phase 0 — Foundations (blocking, do not skip)

Two things must exist before a single click is bought:

1. **A marketing landing page for buying couples.** The app's `/` is the guest
   upload screen. A couple who clicks an ad and lands there sees an upload box
   for a wedding they aren't attending, and bounces. See
   `../seo/content-plan.md` item 1 for the page spec.
2. **Conversion tracking that fires on a real test purchase.** See
   `measurement.md`. Smart Bidding without conversions is random spending.

Everything below assumes both are done.

## Phase 1 — Brand Search

**Purpose:** own your own name cheaply, and get a clean read on how much demand
your SEO and word-of-mouth already create.

| Setting | Value |
| --- | --- |
| Campaign type | Search only. **Uncheck Search Partners and Display Network** |
| Bidding | Manual CPC or Maximise clicks with a low CPC cap to start |
| Budget | Small — brand clicks should be pennies |
| Keywords | Your brand name, exact + phrase, plus common misspellings |
| Location | Presence-only, regions from `brief.md` |

If nobody searches your brand yet, this campaign costs almost nothing and stays
as a placeholder. Do not skip it — competitors bidding on your name is a real
risk once you have traction, and it is far cheaper to already be there.

## Phase 2 — Non-brand Search (the real test)

This is where the strategy lives or dies. Structure by **intent**, not by
keyword volume.

| Ad group | Intent | Match types | Landing page |
| --- | --- | --- | --- |
| Core category | "I want this product" | Exact + Phrase | Marketing home |
| QR-code framing | "I want the QR mechanic" | Exact + Phrase | Marketing home |
| Disposable-camera replacement | "I have the old solution, want better" | Phrase | Comparison page |
| Competitor / alternative | "I know a competitor, want options" | Exact only | Comparison page |
| Problem-aware | "How do I get guests' photos?" | Phrase | Guide page → soft CTA |

Full keyword lists in `keyword-map.md`.

**Settings that matter more than people admit:**

- **Search Partners: off.** Lower quality, no meaningful control, and it muddies
  the search-term data you need in month one.
- **Display Network: off.** Never opt a Search campaign into Display. It is the
  single most common way small accounts waste budget.
- **Location: "Presence" only**, never "Presence or interest".
- **Ad rotation:** optimise (default) once you have 2+ RSAs per ad group.
- **Ad schedule:** all hours to begin with. Cutting hours before you have data
  is guessing.

**Bidding progression:**
1. Start **Maximise clicks with a max CPC cap** for the first ~2 weeks. You are
   buying data, not conversions.
2. At ~15 conversions, switch to **Maximise conversions**.
3. At ~30 conversions/month, add a **Target CPA** equal to `brief.md → Target CPA`.
   Change tCPA by no more than 20% at a time, and never more than weekly —
   each change restarts the learning period.

**Budget:** each ad group needs enough budget to get ~10 clicks/day, or it will
never produce readable data. Better to run **two** ad groups properly than six
starved ones. Start narrow.

## Phase 3 — Scale Search

Only once non-brand CPA is at or below target for two consecutive weeks:

- Add **broad match** on your best-converting exact keywords, with the shared
  negative lists applied (`negative-keywords.md`). Broad match without strong
  negatives on a wedding-adjacent product is expensive — the wedding vocabulary
  overlaps with photography services, venues, dresses, and free-download intent.
- Raise budget in 20–30% steps, never doubling. Large jumps re-trigger learning.
- Add a second RSA per ad group to give the system asset variety.

## Phase 4 — Performance Max

**Entry criteria — all four, no exceptions:**
- 30+ conversions in the last 30 days
- Conversion tracking verified, with values attached
- Search campaigns at or under target CPA
- At least 5 images, 1 logo, and (ideally) a short video ready

**Guardrails when it launches:**

| Guardrail | Why |
| --- | --- |
| **Brand exclusions** on your own brand terms | Stops PMax claiming credit for traffic Search or SEO already earned |
| **Account-level negative keyword list** applied | PMax now honours account negatives — use them |
| Run PMax **alongside** Search, not instead of it | Search keeps exact-match intent; PMax fills the rest |
| Separate asset group per theme, not one giant group | Otherwise you cannot read what worked |
| Feed only if you have a product feed | Otherwise it's an asset-group-only PMax |
| Check **Insights → Search themes / Search categories** weekly | The only visibility PMax gives you |
| Do not judge before 4 weeks | PMax learning is genuinely slower than Search |

Asset groups and audience signals: `pmax-asset-groups.md`.

## Seasonality plan

Wedding planning demand is sharply seasonal:

| Period | Action |
| --- | --- |
| **Late Dec – Feb** | Engagement season. Highest planning intent of the year. Budget peak |
| **Mar – May** | Peak buying for summer weddings. Hold budget high |
| **Jun – Sep** | Wedding season itself — short-window buyers, high intent, good CPA |
| **Oct – Nov** | Trough. Cut budget, use the period for landing-page and SEO work |

Because couples buy **2–8 weeks before the wedding**, ad demand tracks wedding
dates with a short lead, unlike venue or dress advertising which leads by a year.

## What failure looks like (kill criteria)

Decide these now, before you are emotionally invested:

- **£X spent with zero conversions** where X = 3 × target CPA → pause the ad
  group, re-examine the landing page before blaming the keywords.
- **CTR under 2% on exact-match category terms** → the ad copy or the offer is
  wrong, not the targeting.
- **Good CTR, no conversions** → the ad promised something the page doesn't
  deliver. This is the most common failure and it is always a page problem.
