# Performance Max asset groups

**Do not build this yet.** PMax entry criteria are in `strategy.md → Phase 4`:
30+ conversions in 30 days, verified tracking, Search at target CPA. This file
is ready for when that happens.

Character limits (checked by `npm run ads:lint`): short headline ≤ 30, long
headline ≤ 90, description ≤ 90, short description ≤ 60, business name ≤ 25.

## Structure

One asset group per **theme**, never one giant group. PMax reports at asset
group level, so a single group means a single undifferentiated number.

| Asset group | Theme | Audience signal |
| --- | --- | --- |
| AGx1 Guest photos | The core product | Custom segment: category searchers |
| AGx2 QR mechanic | The scan-and-upload format | Custom segment: QR + wedding searchers |
| AGx3 Disposable camera | The upgrade angle | Custom segment: disposable camera searchers |

---

## AGx1 — Guest photos

### Headlines
```headline
Every Guest Photo, One Place
Wedding Photo Sharing App
No App For Your Guests
Guests Upload In Seconds
One Gallery, Every Guest
```

### Long headlines
```long-headline
Every photo your guests took, in one gallery, without anyone downloading an app
Guests scan a QR code and upload photos and video straight from their phones
```

### Descriptions
```description
Guests scan a QR code and upload photos and video. No app and no login needed.
Photos, video, a live slideshow and a guestbook. Download it all as one zip file.
```

### Short descriptions
```short-description
Every guest photo in one gallery. No app required.
```

---

## AGx2 — QR mechanic

### Headlines
```headline
One QR Code, Every Photo
Wedding Photo QR Code
Guests Scan. You Get It All.
Put A Code On Each Table
No App To Download
```

### Long headlines
```long-headline
Print one QR code for your tables and every guest photo lands in one gallery
Works straight from the phone camera. No app, no account, no instructions needed
```

### Descriptions
```description
Print one QR code for your tables. Guests scan, upload, and you keep every photo.
Works straight from the phone camera on any handset your guests already carry.
```

### Short descriptions
```short-description
Scan a code, upload photos. That is the whole flow.
```

---

## AGx3 — Disposable camera upgrade

### Headlines
```headline
The Disposable Camera, Fixed
No Film. No Developing.
Every Shot, Not Just 27
See The Photos Instantly
A Camera On Every Table
```

### Long headlines
```long-headline
Disposable cameras lose half the shots and take weeks. This takes ten minutes
Every guest already has a better camera in their pocket. Use it and keep the photos
```

### Descriptions
```description
No film to collect, no prints to wait for, and nothing left behind at the venue.
Every guest already has a better camera in their pocket. Use it, keep the photos.
```

### Short descriptions
```short-description
The disposable camera idea, without the film.
```

---

## Creative requirements

PMax will not serve properly without the full asset set. Minimums per asset
group:

| Asset | Minimum | Recommended |
| --- | --- | --- |
| Images 1.91:1 (landscape) | 1 | 3 |
| Images 1:1 (square) | 1 | 3 |
| Images 4:5 (portrait) | 0 | 2 |
| Logo 1:1 | 1 | 1 |
| Logo 4:1 | 0 | 1 |
| Video | 0 (auto-generated if absent) | **1 — always supply your own** |

> If you supply no video, Google generates one from your assets. They are
> reliably poor. A 15-second phone clip of a guest scanning a table card and the
> photo appearing in the gallery will outperform anything auto-generated.

**Image subjects that work for this product:** the QR table card in situ, a
guest scanning with a phone, the gallery filling with photos, the slideshow
projected at a reception. **Avoid** generic stock couples — they signal "ad".

## Audience signals

Signals are hints, not targeting — PMax will go beyond them. Supply:

1. **Custom segments** built from the keyword lists in `keyword-map.md`
2. **Your customer list**, once you have one (highest-value signal there is)
3. **Website visitors** who reached the pricing page but did not convert
4. **Life events → Recently engaged / Upcoming wedding** — one of the few
   genuinely accurate life-event segments Google has, because engagement is
   loudly signalled online

## Guardrails

| Guardrail | Setting |
| --- | --- |
| Brand exclusions | Add your own brand terms so PMax cannot claim Search/SEO traffic |
| Account negative keyword list | Apply `negative-keywords.md` shared list 1 at account level |
| Final URL expansion | **Off** at first, so PMax cannot invent landing pages |
| Geo | Presence only, from `brief.md` |
| Budget | Start at or below Search spend; do not move Search budget into it |
| Review cadence | Weekly on Insights → Search themes; monthly on asset performance |
| Judgement window | 4 weeks minimum before any structural change |

## Reading PMax honestly

PMax hides most of what you want to see. Three checks that still work:

1. **Search themes / search categories report** — the closest thing to a search
   term report. Anything irrelevant and expensive becomes an account negative.
2. **Asset group performance side by side** — if one theme carries all the
   conversions, split the losers out or turn them off.
3. **Incrementality check** — compare total account conversions before and after
   PMax launch, not PMax's self-reported number. If PMax reports 40 conversions
   but the account total rose by 5, it is cannibalising Search.

Check 3 is the one most people skip and the only one that answers whether PMax
is actually making you money.

