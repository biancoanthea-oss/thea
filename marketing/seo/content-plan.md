# Content plan

Ordered. Do them in this order — item 1 blocks the ad spend.

Each entry is a brief, not an outline to pad out. When you ask Claude to draft
one, give it: this brief, `../brief.md`, `../brand-voice.md`, the target cluster
from `keyword-clusters.md`, and 2–3 competitor URLs ranking for the term.

---

## 1. Marketing landing page — **P0, blocks everything**

**Cluster:** A1 · **Type:** money page · **URL:** `/` marketing variant or `/app`

The repo currently has no page that sells to a couple. `/` is the *guest*
upload screen. Paid traffic sent there sees an upload box for a wedding they
aren't attending.

**Must contain:**
1. Hero: the one-line promise + a single CTA. No carousel.
2. The guest flow in three steps, shown visually: **scan → upload → done**.
3. The objection answered above the fold: *no app, no login for guests*.
4. What the couple gets: gallery, live slideshow, guestbook, download-all zip.
5. Price, stated plainly. A hidden price on a low-ticket consumer product kills
   conversion — people assume expensive.
6. The privacy line: guests can upload but cannot see or delete others' uploads.
7. A real screenshot or a 15-second video of the actual product. Not stock.
8. FAQ: What if a guest has an old phone? How long do we keep the photos? Can we
   download everything? What if nobody scans it?
9. One CTA, repeated. Not five different ones.

**Do not include:** a testimonial section until real testimonials exist, logo
bars of publications you haven't appeared in, or fake counters.

---

## 2. Pricing page

**Cluster:** A3 · **Type:** money page

Only needed if pricing is tiered. If there is one price, put it on the landing
page and skip this. A pricing page for a single-price product is a wasted click.

---

## 3. "How to get photos from your wedding guests" — the pillar

**Cluster:** C1 · **Type:** guide, 1,500–2,000 words

The honest version. Cover every method and where each breaks:

| Method | Where it breaks |
| --- | --- |
| Wedding hashtag on Instagram | Only reaches people who post publicly; Instagram compresses; you lose it in a year |
| Group chat / WhatsApp | Heavy compression, no video, chaotic, and someone always leaves the group |
| Shared Google Drive folder | Needs an account, guests can delete each other's files, nobody does it drunk at 11pm |
| Disposable cameras | Half the shots are unusable, developing takes weeks, cameras get left behind |
| Asking the photographer | They shoot the ceremony, not the dance floor at 1am |
| A QR photo app | *(our category — described plainly, not oversold)* |

Ends with a soft CTA. This article should be useful to someone who never buys —
that is what makes it rank and get linked to.

---

## 4. "Wedding photo QR code sign: free wording templates"

**Cluster:** C4 · **Type:** guide + free asset

Highest-leverage article on this list. Someone writing their sign is days from
needing the product. Give away 8–10 wording examples, free, with no email gate:

> *"Help us see the day through your eyes — scan to share your photos"*
> *"We can't be everywhere. Scan and upload the moments we missed."*
> *"Our photographer got the ceremony. You got everything else."*

Include practical detail nobody else does: minimum QR size for a table card
(~2cm scannable at arm's length, print it bigger — 4–5cm), test it in dim
lighting before printing, and use a **dynamic** QR so the destination can change
without a reprint. Real, checkable advice is what earns the link.

---

## 5. "Digital vs disposable cameras at weddings"

**Cluster:** B3 · **Type:** comparison

Also the landing page for AG3 in the ad account (`../google-ads/keyword-map.md`).
Be fair to disposables — they have genuine charm and a real aesthetic. The
honest framing is "do both": one disposable per table for the look, a QR code
for the coverage. An article that admits the alternative's strengths converts
better than one that doesn't, and it's true.

---

## 6. "Best wedding photo sharing apps" — comparison

**Cluster:** B1 · **Type:** listicle, us included but not ranked #1 by fiat

Competitive term, so write it after 3–5 have some traction. Rules that keep it
credible: include competitors that genuinely beat us on some axis, say which
one that is, and give a "choose X if…" line for each. A comparison page that
concludes "we're best at everything" convinces nobody and earns no links.

---

## 7. "Wedibox alternatives"

**Cluster:** B2 · **Type:** comparison · Same rules as 6.

---

## 8+. Long tail (Cluster D)

Short, 600–900 words, one per week. Fast to write, fast to index, and they build
the internal-link surface that the money pages need. Start with:

- "Wedding photo app vs a shared Google Drive folder"
- "How to make a QR code for wedding photos"
- "Can wedding guests upload videos too?"
- "How many photos do wedding guests actually take?"

---

## Rules for every piece

1. **Answer the question in the first paragraph.** Do not make someone scroll
   past your origin story.
2. **One page per cluster.** Two pages targeting one term cannibalise each other.
3. **Link up to the money page** with descriptive anchor text.
4. **Original detail or don't publish.** Anything that reads like a summary of
   the top 3 results is not going to outrank them. Screenshots, real numbers,
   and specifics from actually building the product are the differentiator.
5. **Nothing published without a human read.** A draft is a draft.
6. **Title ≤ 60 chars, meta description ≤ 155**, question-shaped where the query
   is a question.

## Drafting prompt

> Draft item N from `marketing/seo/content-plan.md`. Follow `marketing/brief.md`
> for product facts and `marketing/brand-voice.md` for tone and the claims
> policy. Target the cluster listed. Here are three competitor URLs ranking for
> it: [...]. Cover what they cover, then add what they miss. Do not invent
> statistics, reviews, or customer numbers. Flag anything you are unsure is
> true about the product rather than writing around it.
