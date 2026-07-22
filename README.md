# Sarah & Lairkin's Wedding 💍

A self-hosted, Wedibox-style wedding photo & video sharing app. Guests scan a
QR code, land on a mobile-friendly page, and upload photos and videos with **no
login and no app install**. The couple gets a private gallery, a live slideshow
to project at the reception, and a guestbook.

Built with **Next.js (App Router, TypeScript)**, **Supabase** (storage +
Postgres), **Tailwind CSS**, and deployed to **Vercel**. Runs on the free tier.

## Pages

| Route        | Who      | What                                                            |
| ------------ | -------- | -------------------------------------------------------------- |
| `/`          | Guests   | Upload photos/videos (multi-file, progress bars) + guestbook   |
| `/gallery`   | Everyone | Grid of all media (filter, sort, group by guest), lightbox, **Download all** (ZIP with a folder per guest) |
| `/slideshow` | Everyone | Full-screen auto-advancing slideshow, refreshes every 20s     |
| `/guestbook` | Everyone | All guest messages with names & timestamps                     |

All pages are open to anyone with the link. Guests upload on `/`; the gallery,
slideshow and guestbook are viewable by all (no password).

---

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com) (free).
2. **Storage → Create bucket** → name it `uploads`, set it **Public**.
3. **SQL Editor → New query** → paste the contents of
   [`supabase/schema.sql`](./supabase/schema.sql) and **Run**. This creates the
   `uploads` and `messages` tables and the Row Level Security policies
   (guests can only *insert*, never read or delete others' data).
4. **Project Settings → API** — copy these three values for the next step:
   - **Project URL**
   - **anon public** key
   - **service_role** key (secret — keep it server-side only)

## 2. Configure environment variables

Copy the example file and fill it in:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# optional
NEXT_PUBLIC_COUPLE_NAME=Sarah & Lairkin
NEXT_PUBLIC_MAX_UPLOAD_MB=
```

| Variable                        | Exposed to browser? | Purpose                                  |
| ------------------------------- | ------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes                 | Guest uploads                            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes                 | Guest uploads (insert-only via RLS)      |
| `SUPABASE_SERVICE_ROLE_KEY`     | **No (server only)**| Gallery/slideshow list media/messages    |
| `NEXT_PUBLIC_COUPLE_NAME`       | Yes                 | Heading text (optional)                  |
| `NEXT_PUBLIC_MAX_UPLOAD_MB`     | Yes                 | Optional per-file size cap (optional)    |

## 3. Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. To test from your **phone** on the same Wi-Fi,
run `npm run dev -- -H 0.0.0.0` and visit `http://YOUR-COMPUTER-IP:3000`.

Test checklist: upload a photo and a video, confirm they appear in `/gallery`,
leave a guestbook message, open `/slideshow`.

## 4. Deploy to Vercel

1. Push this repo to GitHub.
2. At [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Under **Environment Variables**, add the same variables from your
   `.env.local` (Vercel does **not** read that file). Set them for Production
   (and Preview if you like).
4. **Deploy.** You get a public URL like `your-wedding.vercel.app`.

> After changing env vars in Vercel, redeploy for them to take effect.

## 5. QR code & sign

Generate a QR code pointing at your Vercel URL (e.g.
[qrcode-monkey.com](https://www.qrcode-monkey.com) — use a *dynamic* QR so you
can re-point it later without reprinting). Print it on your table sign.

---

## Security model

- **Guests** use only the **anon key** in the browser. RLS allows that key to
  *insert* into `uploads`/`messages` and to *upload* to the storage bucket —
  nothing else. They cannot read or delete other guests' data via the API.
- **Media bytes** are served from the **public storage bucket** via public
  URLs (no key needed).
- **The gallery, slideshow and guestbook are open to anyone with the link.**
  They list data through server-side API routes that use the **service_role
  key**, which never reaches the browser. (To make them private again, add an
  auth gate — there's no password by default.)

## Free-tier notes

Supabase free tier ≈ **1 GB storage + 5 GB bandwidth**. A wedding with lots of
HD video can exceed this. Options: set `NEXT_PUBLIC_MAX_UPLOAD_MB` (e.g. `25`)
to cap file sizes, restrict to photos, download + clear partway through, or
upgrade Supabase for the month. After the wedding, open `/gallery → Download
all` and back up the ZIP in two places.
