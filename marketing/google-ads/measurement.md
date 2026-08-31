# Measurement

Bidding is only as good as the conversion signal. Everything in `strategy.md`
assumes this file is done first.

## Conversion actions

| Action | Category | Count | Value | Primary? |
| --- | --- | --- | --- | --- |
| Purchase / event created (paid) | Purchase | One | Actual revenue | **Yes — the only primary** |
| Free event created | Sign-up | One | `TODO` — estimated value × trial→paid rate | Secondary |
| Pricing page viewed | Page view | One | None | Secondary (observation only) |
| Demo gallery viewed | Page view | One | None | Secondary (observation only) |

**Exactly one primary action.** Multiple primaries make Smart Bidding optimise
toward the easiest one, which is always the cheapest and least valuable.

**Count = "One", not "Every".** A wedding is a single purchase; counting every
conversion inflates the numbers and misleads bidding.

## Setup order

1. **GA4** installed and firing on all pages.
2. **Google Ads conversion tag** — via GA4 import or a direct gtag/GTM tag, not
   both. Double-counting is the most common tracking bug in small accounts.
3. **Enhanced conversions** on. Free, and materially improves match rates now
   that cookie-based attribution is unreliable.
4. **Consent Mode v2** — required for UK/EU traffic. Without it, Google Ads
   drops conversions from users who haven't consented, and Smart Bidding
   silently degrades.
5. **Test a real purchase end to end.** Buy your own product, confirm the
   conversion appears in Google Ads within 24h with the right value. Do not
   trust the tag assistant alone.

## Attribution

Use **data-driven attribution** with a 30-day click window. The buying window
for this product is short (`brief.md §3` — couples buy 2–8 weeks out) but the
research window is longer: they may find the guide article in month one and buy
in month two. A 7-day window would hide that path and make your SEO content look
worthless.

## What good looks like

Fill the target column from `brief.md` once the economics are in. These
benchmarks are for a low-priced, one-off, high-intent consumer purchase:

| Metric | Weak | Working | Strong |
| --- | --- | --- | --- |
| CTR, exact-match category terms | < 2% | 4–7% | > 8% |
| Landing page conversion rate | < 1% | 2–4% | > 6% |
| Impression share (non-brand) | < 20% | 40–60% | > 70% |
| CPA vs target | > target | at target | < 60% of target |
| Ad strength | Poor | Good | Excellent |

Ad strength is a copy-diversity score, not a performance prediction. "Good" with
strong CPA beats "Excellent" with weak CPA. Never trade a working ad for a
higher ad strength rating.

## Weekly review — the only five numbers

Do not open the account and browse. Answer these five, in order:

1. **Spend vs pace.** Are we on track for the monthly budget, or front-loaded?
2. **CPA vs target**, by campaign, week over week.
3. **Search terms** — what did we pay for that we shouldn't have? (`/search-terms`)
4. **Zero-conversion spenders** — any keyword or ad group over 3× target CPA
   with no conversions?
5. **Anything that changed by more than 40%** week over week — that's either a
   break or an opportunity, and both need a cause.

`/weekly-report` runs all five against live MCP data or a CSV export.

## Statistical honesty

The account will be small at first. Hold the line on this:

- Under ~30 clicks: no conclusion about conversion rate is possible.
- Under ~100 impressions: no conclusion about CTR is possible.
- A keyword with 1 conversion in 12 clicks has not got an 8% conversion rate.
  It has one conversion.
- Week-over-week swings under 30% on a small account are usually noise.

Claude is instructed to label these `INSUFFICIENT DATA` rather than analyse them
(`../CLAUDE.md → Guardrails 5`). Hold it to that.
