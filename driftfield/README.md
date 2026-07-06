# Driftfield 🌀

A tiny **generative flow-field art studio** that runs entirely in your browser.
Tweak the flow, density, stroke and palette, then **download a high-res PNG** or
**copy a link that recreates the exact piece** — pixel for pixel.

No build step, no backend, no dependencies. One HTML file.

![A Driftfield piece](./preview.png)

## Why I built it

I wanted a single, self-contained thing that was fun to make *and* fun to use:
something visual, deterministic, and shareable. Under the hood it's a small
tour of a few ideas I like:

- **Flow fields** — every pixel has an angle sampled from 2D noise; thousands of
  particles walk that field and leave trails, so the whole image is really just
  many tiny line segments drawn with additive (`lighter`) blending.
- **Perlin noise, hand-rolled** — the smooth, organic angles come from a Perlin
  noise implementation whose permutation table is shuffled by the seed, so the
  field is different for every seed but identical for the same one.
- **A seeded PRNG (mulberry32)** — nothing uses `Math.random()` during rendering.
  Given the same controls + seed, you always get the same art. That's what makes
  pieces reproducible.
- **State in the URL** — every control and the seed live in the URL hash, so a
  link *is* the artwork. Open someone's link and you see their exact piece.

## Try it

- **Space** — regenerate (new seed, same style)
- **R** — surprise me (randomize everything)
- **S** — save the current piece as a PNG
- Drag the sliders; click a palette; hit **Copy link** to share.

## Run locally

It's a static file, so anything that serves a folder works:

```bash
# option 1: just open it
open index.html          # macOS   (xdg-open on Linux)

# option 2: a tiny local server (nicer for sharing on your network)
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy a public link (free)

Any static host works. Two easy ones:

**GitHub Pages**
1. Push this folder to a GitHub repo.
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Pick your branch and the folder containing `index.html`, save.
4. You get a `https://<you>.github.io/<repo>/` URL in a minute or two.

**Vercel**
1. Import the repo at [vercel.com](https://vercel.com).
2. Framework preset: **Other**. Root directory: this folder (`driftfield`).
3. Deploy — you get a `*.vercel.app` link.

## How it's structured

Everything is in [`index.html`](./index.html) — HTML, CSS and JS in one file:

| Piece            | What it does                                              |
| ---------------- | -------------------------------------------------------- |
| `mulberry32`     | seeded pseudo-random number generator (reproducibility)  |
| `makeNoise`      | Perlin noise with a seed-shuffled permutation table      |
| `render`         | seeds particles, integrates them through the flow field, draws in animated chunks so the tab never freezes |
| `pushURL/readURL`| encodes/reads all state in the URL hash                  |

## License

MIT — do whatever you like with it.
