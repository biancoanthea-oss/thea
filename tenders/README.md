# Tenders

A reusable workspace for writing tender and bid responses. Drop a new
opportunity in `active/`, pull ready-made text from `library/`, and use the
`templates/` as the starting shape for each document.

> ## ⚠️ This repository is PUBLIC
>
> Real tender documents contain staff names and contact details, client referee
> names and emails, tax reference numbers, insurance details, contract values
> and pricing. **None of that can be committed here** — anything pushed to a
> public repo is visible immediately and may be cached or indexed even after
> deletion.
>
> `.gitignore` in this folder blocks `.docx`, `.xlsx`, `.pdf` and the bid
> working folders for exactly this reason. Keep the real documents in
> OneDrive/SharePoint and share them with me per session.
>
> To hold real content here instead, the repository needs to be made private
> (Settings → General → Danger Zone → Change visibility), or these files moved
> to a private repo of their own.

## How to use it

1. **New opportunity arrives.** Copy the template folder:

   ```bash
   cp -r tenders/templates/_tender-folder "tenders/active/2026-03-acme-cleaning"
   ```

   Name folders `YYYY-MM-buyer-short-title` so they sort chronologically.

2. **Fill in `01-bid-brief.md` first.** Deadline, buyer, word limits, scoring
   weightings, mandatory documents. Everything else depends on it.

3. **Decide bid / no-bid** in `02-bid-no-bid.md` before writing anything long.

4. **Build the compliance matrix** (`03-compliance-matrix.md`) — one row per
   requirement in the ITT. This is the single best predictor of a passing bid:
   an unanswered requirement scores zero regardless of how good the prose is.

5. **Write the answers** in `04-responses/`, one file per question. Start from
   `library/answer-bank.md` — most questions are variations of ones already
   answered.

6. **After submission**, write `06-lessons-learned.md` while it's fresh, move
   anything reusable back into `library/`, and move the folder to `archive/`.

## Asking me for help

Point me at the folder and say what you need. Useful asks:

- "Read the ITT in `active/…/00-source/` and build the compliance matrix."
- "Draft Q3 (social value, 500 words, 15% weighting) using the answer bank."
- "Cut this answer from 780 to 500 words without losing the evidence."
- "Review these answers against the scoring criteria and tell me where we'd
  lose marks."
- "Pull the strongest bits of these three past answers into one."

I'll follow the writing rules in `CLAUDE.md` in this folder — evidence over
adjectives, answer the question that was asked, respect word limits exactly.

## Layout

```
tenders/
├── CLAUDE.md            # writing rules I follow in this folder
├── library/             # reusable, buyer-agnostic content
│   ├── company-profile.md
│   ├── answer-bank.md
│   ├── past-performance.md
│   └── policies.md
├── templates/           # blank starting points
│   └── _tender-folder/  # copy this per opportunity
├── active/              # live bids
└── archive/             # submitted / closed bids
```

## Before you rely on the library

`library/` ships with placeholders in `[SQUARE BRACKETS]`. Fill them in once
with your real details — company number, headcount, certifications, contract
references — and every future bid gets faster. Placeholders left in a submitted
document are an instant credibility hit, so search for `[` before you send
anything.
