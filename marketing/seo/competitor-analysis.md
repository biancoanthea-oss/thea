# Competitor analysis

## The competitor set

| Competitor | Type | Watch because |
| --- | --- | --- |
| Wedibox | Direct, closest positioning | Highest brand search in the category; the reference point buyers compare against |
| POV Wedding App | Direct | Strong social/Instagram presence |
| Guest Pix | Direct | US-centric, similar QR mechanic |
| WedShoots | Direct, older | Established SEO footprint on informational terms |
| Capsule / similar | Direct | Design-led positioning |
| Joy, Zola (photo features) | Adjacent, bundled | The real threat — a free feature inside a wedding-planning suite the couple already uses |
| Google Drive / WhatsApp | The DIY default | **The actual competitor.** Most couples do this, badly, for free |
| Disposable cameras | Offline substitute | The nostalgic default, with real emotional pull |

> Fill in real URLs as you confirm them. Do not let Claude assert a competitor's
> pricing or feature set from memory — it must be checked against the live page,
> with the date noted.

**The two at the bottom matter most.** Ads and content aimed only at people
comparing paid apps are fighting for a small pool. Most of the market has never
considered paying for this and defaults to a group chat. That is the real
competition and it is what Cluster C content addresses.

---

## What to analyse

Run this quarterly, per competitor. Keep a dated snapshot so you can see change
over time — the trajectory is more informative than the position.

### 1. Positioning
- The one-line promise on their homepage.
- Which objection they lead with (usually: will guests actually use it?).
- Who they're targeting — couples, planners, or venues.

### 2. Pricing
- Model (per event, tiered, subscription) and price points.
- Where the tier boundaries sit — usually storage duration, guest count, or video.
- Free tier and what it withholds.
- **Record the date checked.** Pricing changes and stale numbers produce bad
  strategy.

### 3. Features
Build a matrix against ours (`../brief.md §1`). The columns worth tracking:
video support, storage duration, download-all, slideshow, guestbook, guest
account required, app install required, custom branding, print integration.

Find the honest answer to two questions:
- What do they have that we don't, that a buyer would actually care about?
- What do we have that they don't? (Our current answer: no install *and* no
  account, plus video, slideshow, and guestbook in one.)

### 4. SEO footprint
Once GSC and a crawl are available:
- Roughly how many indexed pages? A competitor with 200 articles is playing a
  different game than one with 8.
- What informational content do they rank for that we don't?
- Which of our target clusters do they own, and how strong is the page?
- Where are they thin? Long-tail Cluster D terms are usually uncovered.

### 5. Ads
- Are they bidding on their own brand? On ours?
- What angles do their ads use? (Check the **Google Ads Transparency Centre** —
  it shows live ads for any advertiser, free, no tooling required. Meta's Ad
  Library does the same for Meta.)
- How long has a given ad been running? Longevity implies it works.

### 6. Social proof
- Real review count and where (Trustpilot, G2, app stores).
- What the negative reviews say. **This is the most useful input in the whole
  analysis** — the complaints in a competitor's 2-star reviews are your landing
  page copy. "Guests couldn't figure it out", "we lost the photos after 30
  days", "it made everyone download an app" each map directly to a headline.

---

## Analysis prompt

> Analyse <competitor> against `marketing/brief.md`. Fetch their homepage and
> pricing page and work from what is actually on them — quote the page rather
> than recalling it, and note today's date on every pricing claim. Produce:
> positioning, pricing, feature matrix vs ours, the gap they exploit that we
> don't, and the gap we exploit that they don't. Flag anything you could not
> verify from the live pages rather than filling it in. End with three specific
> things we should change, ranked, with the reason.

## What not to do

- **Don't copy their copy.** Their positioning is built for their product and
  their pricing.
- **Don't chase feature parity.** A longer feature list is not a better product
  and it isn't why people buy this.
- **Don't name them in ad copy** (`../brand-voice.md → Claims policy`).
- **Don't assume they're profitable.** A competitor spending heavily on ads may
  be losing money doing it. Copying their budget is copying their mistake.
