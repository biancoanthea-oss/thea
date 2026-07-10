# Stacked — SEO & Inbound Command Center

A single-file, no-install marketing tool for growing search traffic and inbound
leads across the Stacked group of websites.

## What it is

`seo-command-center.html` is a self-contained dashboard (no server, no login, no
internet needed). Open it in any browser and it gives you:

| Tab | What it does |
| --- | --- |
| **Overview** | A readiness score per web property, rolled up from the checklist. Flags dead-in-DNS domains and brand/domain overlap. |
| **Site checklist** | The full technical → on-page → local → content → links → lead-capture checklist, per site, with the "must-fix" items marked Critical. Every tick saves automatically. |
| **Tag generator** | Writes the exact title tag, meta description (length-checked) and `LocalBusiness` JSON-LD structured data to paste into each page's `<head>`. |
| **Keywords & content** | A running table of keywords to target and the page/post that will win each one. |
| **90-day roadmap** | A sequenced plan — foundations first, polish later — that feeds progress back to the Overview. |
| **Lead ideas** | Conversion tactics and lead magnets suited to AV / events / IT / merch. |

## How to use it

1. **Open the file** — double-click `seo-command-center.html`, or drag it into a
   browser tab.
2. **Start on Overview.** Fix anything red first. Three domains
   (`stackedavevent.ie`, `stackedwps.ie`, `stackedmerchandise.ie`) did **not
   resolve in DNS** when this was built — a site with no DNS record is invisible
   to Google and to customers, so verify or redirect those before any SEO work.
3. **Work the checklist** one property at a time.
4. **Back up your progress** with the **Backup** button (top right) before
   switching computers — data is stored in that browser only, nothing is uploaded.

## The strategic headline

You have more than one property covering the same service (AV on both
`stackedav.ie` and `audiovisual.ie`; merchandise on `stackedmerchandise.ie`,
`merch.stacked.ie` and `shop.stacked.ie`). Splitting one topic across several
domains splits your ranking authority and can create duplicate content. Pick
**one canonical home per service** and 301-redirect (or canonical-tag) the rest.
That single decision will do more for your rankings than most on-page tweaks.
