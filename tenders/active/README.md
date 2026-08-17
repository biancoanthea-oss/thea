# Active bids

One folder per live opportunity, named `YYYY-MM-buyer-short-title` so they sort
by date.

Start each one by copying the template:

```bash
cp -r tenders/templates/_tender-folder "tenders/active/2026-03-acme-cleaning"
```

Then fill in `01-bid-brief.md` and put the buyer's documents in `00-source/`.

Once a bid is submitted and the outcome is known, complete
`06-lessons-learned.md` and move the folder to `../archive/`.
