# Product brief — the context prompt for every session

> **This is the file you edit.** Everything else in `marketing/` is derived from
> it. Fields marked `TODO` are assumptions Claude is not allowed to invent —
> fill them in and the rest of the playbooks become accurate.
>
> Last reviewed: 2026-08-31

---

## 1. What we sell

**Product:** A self-hosted-style wedding guest photo & video sharing app.
Guests scan a QR code on the table, land on a mobile page, and upload photos and
videos — **no login, no app install**. The couple gets a private gallery, a live
slideshow to project at the reception, and a digital guestbook.

**Category:** wedding guest photo sharing / QR photo app / digital disposable
camera replacement.

**The one-line promise:** Every photo your guests took, in one gallery, without
making anyone download an app.

**Primary competitor set:** Wedibox, POV Wedding App, Guest Pix, WedShoots,
Capsule, Joy's photo feature, and the "free Google Drive folder + QR code" DIY
approach. See `seo/competitor-analysis.md`.

### Differentiators (only claim these — they are true of this build)

- No app install and no guest account. A QR code and a browser is the whole flow.
- Photos **and** video, multi-file upload with progress bars.
- Live slideshow mode that auto-advances and refreshes during the reception.
- Guestbook messages captured in the same place as the media.
- One-click **Download all** as a ZIP for the couple.
- Guests can upload but cannot read or delete other guests' uploads
  (row-level security) — a genuine privacy claim most DIY setups cannot make.

### Do NOT claim

Unlimited storage, guaranteed uptime, professional editing, AI face grouping,
printing, physical products, or any number of weddings served — none of these
are built or verified.

---

## 2. Offer and pricing

| Field | Value |
| --- | --- |
| Pricing model | `TODO` — one-off per wedding, or tiered? |
| Price point | `TODO` (e.g. £29 / £49 / £79 per event) |
| Free trial or free tier | `TODO` |
| Guarantee | `TODO` (a refund guarantee lifts conversion rate on cold traffic) |

**Conversion action for ads:** `TODO` — pick one. Options, best first:
1. Paid checkout (cleanest signal, lowest volume)
2. Free event created / account signup (good volume, needs a value assigned)
3. Demo gallery viewed (too weak to bid on — use as a secondary action only)

---

## 3. Unit economics

Ads cannot be judged without these. Fill them in before the first campaign.

| Metric | Value | Notes |
| --- | --- | --- |
| Average order value | `TODO` | |
| Gross margin % | `TODO` | Hosting/storage cost per event is near zero on free tiers, so expect this to be high |
| Repeat purchase rate | ~0% | A wedding is a one-time event. Treat LTV ≈ first order margin |
| Referral coefficient | `TODO` | Real upside: every wedding puts the product in front of 80–150 guests. Track "guest → later becomes a customer" if you can |
| **LTV** | `TODO` | AOV × margin, plus referral value if measured |
| **Target CPA** | `TODO` | Start at LTV ÷ 3. Do not let Claude bid to a CPA above LTV × 0.6 |
| Max daily budget | `TODO` | |
| Payback window | Immediate | One-off purchase; no subscription to recover cost over |

**Seasonality:** UK/EU wedding bookings concentrate Jan–Mar (planning season, the
"engagement season" spike right after Christmas and Valentine's) for weddings
held May–September. Budget should be front-loaded into Jan–Apr. Search volume in
Nov–Dec is the annual low outside the post-Christmas engagement bump.

**Purchase timing:** couples buy this **2–8 weeks before the wedding**, long
after the venue and photographer are booked. The conversion window is short and
the intent is high — this is a good Search product.

---

## 4. Who we target

**Primary ICP:** Engaged couples, 25–38, planning a wedding of 50–200 guests in
the next 3 months, budget-conscious, already using Pinterest/Instagram for
planning. Usually one partner is the "organiser" and does the researching.

**Secondary ICP:** Wedding planners and venues who want to offer this to every
couple — higher value, longer cycle, better served by outreach than by ads.
Do not build a Search campaign for this segment until the primary one is
profitable.

**Not our customer:** professional photographers looking for client galleries
(Pic-Time/Pixieset territory), corporate event organisers, and anyone searching
for free stock wedding photos.

### Regions

| Region | Status | Language |
| --- | --- | --- |
| `TODO` — primary country | Active | English |
| Everywhere else | **Excluded** | — |

Set Location options to **"Presence: People in or regularly in your targeted
locations"**, never the default "Presence or interest". Interest targeting on a
wedding product pulls in enormous volumes of irrelevant international traffic.

---

## 5. Protected terms — never recommend pausing these

These are the category. They will look expensive early. Claude must not list
them as waste, negatives, or "low performers" without 90 days of data and an
explicit CPA argument (see `CLAUDE.md → Guardrails 1`).

- wedding photo sharing app
- wedding photo app
- wedding guest photo app
- qr code wedding photos
- wedding photo sharing qr code
- digital disposable camera wedding
- wedding photo album app for guests
- wedibox / wedibox alternative
- guest photo upload wedding

---

## 6. Landing pages

| Page | URL | Purpose |
| --- | --- | --- |
| Home / upload | `/` | Guest-facing. **Not an ad landing page** — do not send paid traffic here |
| Gallery | `/gallery` | Guest-facing |
| Slideshow | `/slideshow` | Guest-facing |
| Guestbook | `/guestbook` | Guest-facing |
| **Marketing landing page** | `TODO` — does not exist yet | **P0. Ads cannot run without it.** |

> **Blocking issue for paid search.** The app as it stands is the *guest*
> experience. There is no page that explains the product to a *buying couple*,
> states a price, and takes a payment or a signup. Sending ad clicks to `/`
> would show buyers a photo upload box for a wedding they are not attending.
> Build the marketing page before spending anything. `seo/content-plan.md`
> specifies it as item 1.

---

## 7. Tracking status

| Thing | Status |
| --- | --- |
| Google Analytics 4 | `TODO` — installed? |
| Google Ads conversion tag | `TODO` |
| Enhanced conversions | `TODO` |
| Google Search Console | `TODO` — property verified? |
| Consent mode v2 (required for EU/UK traffic) | `TODO` |

See `google-ads/measurement.md`. **Do not launch campaigns before conversion
tracking fires correctly on a test purchase.** Smart Bidding without conversion
data is a random number generator with a credit card.
