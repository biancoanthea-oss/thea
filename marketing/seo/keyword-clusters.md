# SEO keyword clusters

Organised by **intent stage**, because that decides the page type, not the
keyword's volume. One cluster = one page. Do not write two pages for one
cluster; they will cannibalise each other and you will rank for neither.

Volumes are deliberately absent — pull them from Search Console or Keyword
Planner rather than trusting an estimate.

---

## Cluster A — Transactional (money pages)
*They want to buy. Short pages, clear CTA, price visible.*

| Cluster | Head term | Supporting terms | Page |
| --- | --- | --- | --- |
| A1 Core product | wedding photo sharing app | wedding guest photo app, photo sharing app for weddings, app to collect wedding photos | Home |
| A2 QR mechanic | wedding photo qr code | qr code wedding photos, qr code for guest photos, wedding qr code photo app | Home (section) or dedicated page |
| A3 Pricing | wedding photo app price | how much does a wedding photo app cost | Pricing |

**Priority: highest.** These convert. Everything else supports them.

---

## Cluster B — Commercial investigation
*Comparing options. Long pages, honest comparison tables, CTA at the end.*

| Cluster | Head term | Supporting terms | Page |
| --- | --- | --- | --- |
| B1 Best-of | best wedding photo sharing app | top wedding photo apps, wedding photo app comparison | "Best wedding photo sharing apps" |
| B2 Competitor alt | wedibox alternative | alternatives to wedibox, apps like wedibox | "Wedibox alternatives" |
| B3 Vs disposable | digital disposable camera wedding | disposable camera alternative wedding, virtual disposable camera | "Digital vs disposable cameras" |
| B4 Free options | free wedding photo sharing app | free way to share wedding photos | "Free ways to collect wedding photos" |

> **B4 is worth writing even though "free" is a negative keyword in paid.** In
> ads you pay per free-intent click, so you block it. In SEO the click is free
> and a genuinely honest "here are the free options, here's where they break
> down" page converts a real share of readers. Different economics, opposite
> decision — do not let the negative keyword list leak into the content plan.

---

## Cluster C — Informational (top of funnel)
*Planning a wedding, hasn't heard of the category. Genuinely useful guides.*

| Cluster | Head term | Supporting terms |
| --- | --- | --- |
| C1 Collect photos | how to get photos from wedding guests | how to collect wedding photos from guests, getting guests to share photos |
| C2 Guest photo ideas | wedding guest photo ideas | wedding photo ideas for guests, fun photo ideas wedding |
| C3 Sharing methods | best way to share wedding photos | how to share wedding photos with guests, wedding photo sharing ideas |
| C4 Signage | wedding photo sign wording | qr code sign wording wedding, photo sharing sign wedding |
| C5 Timeline | when do you get wedding photos back | how long do wedding photos take |
| C6 Unplugged | unplugged wedding | unplugged ceremony sign, should we have an unplugged wedding |

**C4 and C6 are the sleepers.** C4 (sign wording) is high-intent disguised as
informational — someone writing their QR sign already has the product or is
about to choose one; give them free printable wording and the CTA writes itself.
C6 looks contradictory (unplugged = no phones) but the standard advice is
"unplugged *ceremony*, phones welcome at the reception" — which is exactly our
use case, and the article can say so honestly.

---

## Cluster D — Long tail / low competition
*Fast wins while the domain is new. Small volume, near-zero competition.*

- how to make a wedding photo qr code
- what size should a wedding qr code sign be
- do guests actually use wedding photo apps
- wedding photo app vs shared google drive folder
- how many photos do wedding guests take
- can guests upload videos to a wedding photo app
- what to do with wedding photos after the wedding

---

## Sequencing

A new domain cannot rank for Cluster A or B immediately — those are the
competitive terms and they need authority behind them. The order that works:

```
1. Cluster A pages   (must exist, even if they don't rank yet — ads land here)
2. Cluster D         (fast wins, builds crawl history and early impressions)
3. Cluster C         (volume and internal-link surface area)
4. Cluster B         (attack once C and D have earned some authority)
```

Internal linking rule: every C and D article links **up** to the relevant A
page with descriptive anchor text ("wedding photo sharing app", not "click
here"). That is how authority flows to the money pages.

## Reviewing this file

Once Search Console is connected (`../mcp-setup.md`), run `/seo-audit` monthly.
Real query data beats this file — move anything that produces impressions into
its own cluster, and drop clusters that get none after 90 days of a live page.
