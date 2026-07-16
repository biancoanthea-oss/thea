#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────
// seo-audit.mjs — the recurring SEO agent's eyes.
//
// Fetches the deployed site and checks the things that quietly break and hurt
// how the site is found and shared: title/description, Open Graph & Twitter
// cards, the robots policy (is it accidentally indexable, or accidentally
// blocked?), viewport, reachable links, and robots.txt.
//
// Usage:
//   node scripts/seo-audit.mjs https://your-site.example
//   SITE_URL=https://your-site.example node scripts/seo-audit.mjs
//   npm run seo:audit -- https://your-site.example
//
// Exit code is 0 when all checks pass, 1 when any FAIL — so a scheduled agent
// (or CI) can tell "all good" from "something regressed" without reading prose.
// WARN never fails the run; it's advisory.
//
// No dependencies — uses the global fetch built into Node 18+.
// ─────────────────────────────────────────────────────────────────────────

const RAW_URL = process.argv[2] || process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;

if (!RAW_URL) {
  console.error(
    "Usage: node scripts/seo-audit.mjs <site-url>\n" +
      "   or: SITE_URL=<site-url> node scripts/seo-audit.mjs",
  );
  process.exit(2);
}

const BASE = RAW_URL.replace(/\/+$/, "");
// Whether the site is *meant* to be indexed. Defaults to private (the wedding
// case): then "noindex present" is a PASS, and "indexable" is a WARN.
const EXPECT_INDEXABLE =
  String(process.env.NEXT_PUBLIC_ALLOW_INDEXING || "").toLowerCase() === "true";

// Public routes worth checking. Home is the one that gets shared.
const ROUTES = ["/", "/gallery", "/slideshow", "/guestbook"];

const results = [];
const record = (status, label, detail = "") =>
  results.push({ status, label, detail });

const attr = (html, re) => {
  const m = html.match(re);
  return m ? m[1].trim() : "";
};
const metaContent = (html, name) =>
  attr(
    html,
    new RegExp(
      `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']`,
      "i",
    ),
  ) ||
  attr(
    html,
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${name}["']`,
      "i",
    ),
  );

async function get(path) {
  const url = path.startsWith("http") ? path : BASE + path;
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "seo-audit-bot/1.0 (+recurring SEO agent)" },
  });
  const body = res.headers.get("content-type")?.includes("text")
    ? await res.text()
    : "";
  return { res, body, url };
}

async function auditHome() {
  let home;
  try {
    home = await get("/");
  } catch (e) {
    record("FAIL", "Home page reachable", String(e?.message || e));
    return;
  }
  const { res, body } = home;

  res.ok
    ? record("PASS", "Home page reachable", `HTTP ${res.status}`)
    : record("FAIL", "Home page reachable", `HTTP ${res.status}`);
  if (!body) return;

  // Title & description
  const title = attr(body, /<title[^>]*>([^<]*)<\/title>/i);
  title
    ? record("PASS", "<title>", `“${title}”`)
    : record("FAIL", "<title>", "missing");

  const desc = metaContent(body, "description");
  desc
    ? record("PASS", "meta description", `${desc.length} chars`)
    : record("FAIL", "meta description", "missing");

  // Viewport (mobile — guests are on phones)
  metaContent(body, "viewport")
    ? record("PASS", "viewport", "present")
    : record("FAIL", "viewport", "missing");

  // Open Graph — the share-preview card
  for (const tag of ["og:title", "og:description", "og:image"]) {
    const v = metaContent(body, tag);
    v
      ? record("PASS", tag, tag === "og:image" ? v : `${v.length} chars`)
      : record("FAIL", tag, "missing");
  }
  // og:image should resolve
  const ogImage = metaContent(body, "og:image");
  if (ogImage) {
    try {
      const abs = ogImage.startsWith("http") ? ogImage : BASE + ogImage;
      const r = await fetch(abs, { method: "HEAD" });
      r.ok
        ? record("PASS", "og:image resolves", `HTTP ${r.status}`)
        : record("FAIL", "og:image resolves", `HTTP ${r.status} — ${abs}`);
    } catch (e) {
      record("FAIL", "og:image resolves", String(e?.message || e));
    }
  }

  // Twitter card
  metaContent(body, "twitter:card")
    ? record("PASS", "twitter:card", metaContent(body, "twitter:card"))
    : record("WARN", "twitter:card", "missing");

  // Indexing policy — the one that matters most for a private gallery
  const robotsMeta = metaContent(body, "robots").toLowerCase();
  const xRobots = (res.headers.get("x-robots-tag") || "").toLowerCase();
  const noindexed = robotsMeta.includes("noindex") || xRobots.includes("noindex");
  if (EXPECT_INDEXABLE) {
    noindexed
      ? record("FAIL", "indexing policy", "expected indexable but found noindex")
      : record("PASS", "indexing policy", "indexable, as expected");
  } else {
    noindexed
      ? record("PASS", "indexing policy", "noindex — private, as expected")
      : record(
          "WARN",
          "indexing policy",
          "no noindex found — guests' photos may be indexable",
        );
  }
}

async function auditRobotsTxt() {
  try {
    const { res, body } = await get("/robots.txt");
    if (!res.ok) {
      record("WARN", "robots.txt", `HTTP ${res.status}`);
      return;
    }
    const disallowAll = /disallow:\s*\/\s*$/im.test(body);
    if (EXPECT_INDEXABLE) {
      disallowAll
        ? record("FAIL", "robots.txt", "Disallow: / blocks the whole site")
        : record("PASS", "robots.txt", "present, site crawlable");
    } else {
      disallowAll
        ? record("PASS", "robots.txt", "Disallow: / — private, as expected")
        : record("WARN", "robots.txt", "does not block crawling");
    }
  } catch (e) {
    record("WARN", "robots.txt", String(e?.message || e));
  }
}

async function auditRoutes() {
  for (const path of ROUTES) {
    try {
      const { res } = await get(path);
      res.ok
        ? record("PASS", `route ${path}`, `HTTP ${res.status}`)
        : record("FAIL", `route ${path}`, `HTTP ${res.status}`);
    } catch (e) {
      record("FAIL", `route ${path}`, String(e?.message || e));
    }
  }
}

const ICON = { PASS: "✓", WARN: "!", FAIL: "✗" };

async function main() {
  console.log(`\nSEO audit — ${BASE}`);
  console.log(`Expecting: ${EXPECT_INDEXABLE ? "public / indexable" : "private / noindex"}\n`);

  await auditHome();
  await auditRobotsTxt();
  await auditRoutes();

  let pass = 0,
    warn = 0,
    fail = 0;
  for (const r of results) {
    if (r.status === "PASS") pass++;
    else if (r.status === "WARN") warn++;
    else fail++;
    console.log(
      `  ${ICON[r.status]} ${r.status.padEnd(4)} ${r.label}${r.detail ? ` — ${r.detail}` : ""}`,
    );
  }

  console.log(`\n${pass} passed · ${warn} warnings · ${fail} failed\n`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("audit crashed:", e);
  process.exit(2);
});
