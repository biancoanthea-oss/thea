# Working in `tenders/`

This folder is for writing tender and bid responses. It has nothing to do with
the Next.js app in `src/` — never mix the two.

## Ground rules for drafting

**Answer the question that was asked.** Re-read the question stem and every
sub-clause ("describe your approach to X, *including how you will* Y and Z").
Each clause is usually a scoring line. Cover all of them, in the order asked.

**Word and character limits are hard.** State the count at the end of every
draft (e.g. `— 487 / 500 words`). Over-limit text is often truncated or scored
zero. Count words the way the buyer defines them; if undefined, count
whitespace-separated tokens and exclude the question text.

**Evidence over adjectives.** Replace "we have extensive experience" with the
number, the contract, the date, the outcome. If a claim has no evidence behind
it, either find evidence or cut the claim. Never invent figures, client names,
certifications, case studies, or accreditations — if a number is needed and I
don't have it, leave `[FIGURE NEEDED: …]` and flag it in the reply.

**Structure to be skim-scored.** Evaluators read fast, against a rubric. Use a
short opening sentence that answers the question directly, then subheadings or
bold leads matching the question's sub-clauses, then specifics. Avoid a long
scene-setting preamble.

**Mirror the buyer's language.** If the ITT says "service user", don't write
"customer". If it names a policy, standard, or KPI, use that exact name.

**Say who does what, by when.** Named roles, timescales, and measurable
commitments score. "We will appoint a dedicated Contract Manager within 5
working days of award" beats "we will provide strong management".

**No filler.** Cut "it is worth noting that", "in today's fast-paced
environment", "we pride ourselves on". They burn word count that should carry
evidence.

## House style

- British English spelling unless the ITT is written in another variety —
  match the buyer's document.
- Plain sentences, active voice, first person plural ("we will").
- Spell out an acronym on first use, then use the acronym.
- No em dashes as a habit; prefer full stops.
- Tables and bullets are fine, but check the ITT allows them — some forbid
  anything but continuous prose, and some exclude tables from the word count.

## What to do before drafting

1. Read `01-bid-brief.md` in the relevant `active/` folder — it holds the
   limits, weightings and deadline.
2. Check `library/answer-bank.md` for an existing answer to adapt before
   writing anything from scratch.
3. If the source ITT is in `00-source/`, read it rather than working from a
   summary.

## What to flag rather than fix silently

- Missing or contradictory requirements in the ITT.
- Anything that reads as a mandatory pass/fail gate we may not meet.
- Placeholders (`[…]`) still present in a document heading to submission.
- Claims in the library that look stale (expired certifications, contracts
  that have ended).
