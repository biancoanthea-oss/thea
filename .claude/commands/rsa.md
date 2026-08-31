---
description: Write or refresh Responsive Search Ad copy, length-checked
---

Write Responsive Search Ad copy for: $ARGUMENTS
(If no ad group is named, ask which one — or refresh whichever has the weakest
CTR if the `google-ads` MCP is connected and can tell you.)

**Context:** `marketing/brief.md` (product facts and protected terms),
`marketing/brand-voice.md` (**the claims policy is binding**),
`marketing/google-ads/keyword-map.md` (the ad group's intent and keywords),
`marketing/google-ads/rsa-copy.md` (existing copy — don't duplicate it).

Produce **15 headlines** and **4 descriptions**:

- Headlines ≤ 30 characters, descriptions ≤ 90. Show the count next to each.
- Each headline must stand alone — Google assembles up to 3 in any order, so no
  headline may depend on another to make sense.
- Cover a spread of angles: the core benefit, the guest objection (no app, no
  login), speed of setup, what the couple receives, and the emotional payoff
  (the photos they'd otherwise never see).
- Include the ad group's main keyword in 2–3 headlines, naturally.
- No superlatives, no invented numbers, no competitor names, no unverifiable
  claims. Check every line against the claims policy before you output it.

Add them to `marketing/google-ads/rsa-copy.md` in the existing fenced-block
format, then **run `npm run ads:lint`** and fix anything it flags. Do not
present copy that has not passed the linter.

Finally, list which existing assets these should replace and why.
