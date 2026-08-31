# Keyword map

Structure: one ad group per intent. Every keyword in an ad group must be
answerable by the *same* ad and the *same* landing page — that is the test for
whether it belongs.

Match type notation: `[exact]`, `"phrase"`, `broad`.

Volumes are **not** listed here on purpose. Pull them yourself with Keyword
Planner or ask Claude once the Google Ads MCP is connected — invented volume
numbers are worse than none.

---

## AG1 — Core category
*Intent: knows the product exists, wants one.* Highest priority. These are
**protected terms** (`brief.md §5`).

```
[wedding photo sharing app]
[wedding photo app]
[wedding guest photo app]
[guest photo sharing app]
[wedding photo sharing]
[photo sharing app for weddings]
[wedding photo album app]
"wedding photo app for guests"
"app for wedding photos"
"share wedding photos with guests"
"collect wedding photos from guests"
"wedding guest photo sharing"
```

**Landing page:** marketing home
**Ad angle:** the product, plainly. "Every guest photo in one gallery."

---

## AG2 — QR-code framing
*Intent: has seen the QR-code-on-the-table mechanic and wants it.* Often the
highest-converting group because the searcher already understands the format.

```
[qr code wedding photos]
[wedding photo qr code]
[qr code for wedding photo sharing]
[wedding qr code photo app]
"qr code wedding photo upload"
"wedding photo qr code sign"
"scan qr code wedding photos"
"qr code guest photos"
```

**Landing page:** marketing home (with the QR flow above the fold)
**Ad angle:** the mechanic. "Guests scan a code. That's it."

---

## AG3 — Disposable camera replacement
*Intent: has the old solution in mind, is open to a better one.* Strong angle —
these searchers have already decided they want guest-captured photos.

```
[digital disposable camera wedding]
[disposable camera alternative wedding]
[wedding disposable camera app]
"digital disposable camera app"
"disposable cameras for wedding tables"
"alternative to disposable cameras wedding"
"virtual disposable camera wedding"
```

**Landing page:** comparison / "vs disposable cameras" page
**Ad angle:** the upgrade. "Like disposable cameras, minus the developing."

> Note: many of these searchers may still buy physical cameras. Expect a lower
> conversion rate than AG1/AG2 and judge it on its own CPA, not the account
> average.

---

## AG4 — Competitor & alternatives
*Intent: knows a competitor, comparing.* Exact match only — phrase match here
drags in the competitor's own support and login traffic, which never converts.

```
[wedibox alternative]
[wedibox]
[pov wedding app alternative]
[guest pix alternative]
[wedshoots alternative]
[wedding photo app alternative]
```

**Landing page:** comparison page
**Ad angle:** the differentiator, never the competitor's name in the ad text
(see `../brand-voice.md → Claims policy`). "No app download for your guests."

> Bidding on competitor brand terms is legal and normal; using their trademark
> in your **ad text** invites a complaint and a disapproval. Keep it in the
> keyword, out of the copy.

---

## AG5 — Problem-aware
*Intent: has the problem, doesn't know the category.* Lower conversion rate,
higher volume, feeds the SEO content plan. Phrase match, modest budget.

```
"how to get photos from wedding guests"
"how to collect photos from wedding guests"
"best way to share wedding photos with guests"
"wedding guest photo ideas"
"how to get guests to share wedding photos"
```

**Landing page:** the corresponding guide article, with a soft CTA — not the
sales page. Sending "how do I…" traffic to a pricing page wastes it.

---

## AG6 — Brand (separate campaign)
Add your brand name here once it exists in `brief.md`. Exact + phrase, plus
misspellings.

```
[TODO brand name]
"TODO brand name"
[TODO brand misspelling]
```

---

## Ad group hygiene rules

1. **One landing page per ad group.** If two keywords need different pages, they
   need different ad groups.
2. **Start with 5–15 keywords per ad group**, not 50. You are buying readable
   data.
3. **Add every keyword as its own exact match negative in the other ad groups**
   where overlap is likely, so traffic lands where you intend it to.
4. **Don't add a keyword you wouldn't write an ad for.** If the ad would be
   generic, the keyword belongs elsewhere.
5. Review search terms weekly (`/search-terms`) and promote high-intent queries
   into exact match, demote junk into the shared negative list.
