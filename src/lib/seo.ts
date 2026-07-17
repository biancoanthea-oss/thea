import type { AuditResult, PageSpeed, SeoCheck } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// On-page SEO audit engine.
//
// This is the genuinely-free core of the "SEMrush-lite" feature: we fetch a
// page server-side and parse its HTML to grade on-page SEO. No paid data
// source is involved. (Backlink counts and keyword *search volume* are the
// parts that require a proprietary crawl index — see keyword-ideas for the
// free-but-limited alternative, and README for the honest limitations.)
// ─────────────────────────────────────────────────────────────────────────────

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Please enter a URL.");
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  // Throws for clearly invalid input.
  const u = new URL(withProto);
  return u.toString();
}

function attr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? (m[2] ?? m[3] ?? "").trim() : null;
}

function findMeta(html: string, key: "name" | "property", value: string): string | null {
  const re = new RegExp(`<meta[^>]*${key}\\s*=\\s*["']${value}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  return tag ? attr(tag, "content") : null;
}

function countTags(html: string, tag: string): number {
  return (html.match(new RegExp(`<${tag}[\\s>]`, "gi")) || []).length;
}

function textContent(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function analyzeHtml(finalUrl: string, statusCode: number, html: string): AuditResult {
  const host = new URL(finalUrl).hostname;

  const titleRaw = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? null;
  const title = titleRaw ? titleRaw.replace(/\s+/g, " ").trim() : null;

  const metaDescription = findMeta(html, "name", "description");
  const robotsMeta = findMeta(html, "name", "robots");

  const canonicalTag = html.match(/<link[^>]*rel\s*=\s*["']canonical["'][^>]*>/i)?.[0];
  const canonical = canonicalTag ? attr(canonicalTag, "href") : null;

  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
  );

  const headings = {
    h1: countTags(html, "h1"),
    h2: countTags(html, "h2"),
    h3: countTags(html, "h3"),
  };

  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  const images = imgTags.length;
  const imagesWithoutAlt = imgTags.filter((t) => {
    const alt = attr(t, "alt");
    return alt === null || alt === "";
  }).length;

  const anchors = [...html.matchAll(/<a\b[^>]*href\s*=\s*("([^"]*)"|'([^']*)')[^>]*>/gi)];
  let internalLinks = 0;
  let externalLinks = 0;
  for (const a of anchors) {
    const href = (a[2] ?? a[3] ?? "").trim();
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      continue;
    }
    try {
      const linkHost = new URL(href, finalUrl).hostname;
      if (linkHost === host) internalLinks++;
      else externalLinks++;
    } catch {
      /* ignore malformed href */
    }
  }

  const wordCount = textContent(html).split(" ").filter(Boolean).length;
  const hasViewport = findMeta(html, "name", "viewport") !== null;
  const openGraph = {
    title: findMeta(html, "property", "og:title") !== null,
    description: findMeta(html, "property", "og:description") !== null,
    image: findMeta(html, "property", "og:image") !== null,
  };
  const httpsOk = finalUrl.startsWith("https://");

  const titleLength = title?.length ?? 0;
  const metaDescriptionLength = metaDescription?.length ?? 0;

  const checks: SeoCheck[] = [
    check("status", "Page returned 200 OK", statusCode === 200 ? "pass" : "fail",
      `HTTP status ${statusCode}`, 3),
    check("https", "Served over HTTPS", httpsOk ? "pass" : "fail",
      httpsOk ? "Secure connection" : "Page is not HTTPS", 2),
    check(
      "title",
      "Title tag present and well-sized",
      title ? (titleLength >= 30 && titleLength <= 60 ? "pass" : "warn") : "fail",
      title ? `${titleLength} chars (ideal 30–60)` : "No <title> found",
      3,
    ),
    check(
      "description",
      "Meta description present and well-sized",
      metaDescription
        ? metaDescriptionLength >= 70 && metaDescriptionLength <= 160
          ? "pass"
          : "warn"
        : "fail",
      metaDescription ? `${metaDescriptionLength} chars (ideal 70–160)` : "Missing meta description",
      2,
    ),
    check(
      "h1",
      "Exactly one H1",
      headings.h1 === 1 ? "pass" : headings.h1 === 0 ? "fail" : "warn",
      `${headings.h1} H1 tag(s) found`,
      2,
    ),
    check(
      "content",
      "Sufficient text content",
      wordCount >= 300 ? "pass" : wordCount >= 100 ? "warn" : "fail",
      `${wordCount} words`,
      2,
    ),
    check(
      "alt",
      "Images have alt text",
      images === 0 ? "warn" : imagesWithoutAlt === 0 ? "pass" : imagesWithoutAlt <= images / 2 ? "warn" : "fail",
      images === 0 ? "No images on page" : `${imagesWithoutAlt}/${images} missing alt`,
      1,
    ),
    check("viewport", "Mobile viewport set", hasViewport ? "pass" : "fail",
      hasViewport ? "Responsive viewport tag present" : "No viewport meta tag", 2),
    check(
      "canonical",
      "Canonical URL declared",
      canonical ? "pass" : "warn",
      canonical ? canonical : "No canonical link",
      1,
    ),
    check(
      "og",
      "Open Graph tags for social sharing",
      openGraph.title && openGraph.description && openGraph.image
        ? "pass"
        : openGraph.title || openGraph.description || openGraph.image
          ? "warn"
          : "fail",
      `og:title ${yn(openGraph.title)}, og:description ${yn(openGraph.description)}, og:image ${yn(openGraph.image)}`,
      1,
    ),
    check(
      "indexable",
      "Page is indexable",
      robotsMeta && /noindex/i.test(robotsMeta) ? "fail" : "pass",
      robotsMeta ? `robots: ${robotsMeta}` : "No robots restrictions",
      2,
    ),
  ];

  const score = scoreChecks(checks);

  return {
    url: finalUrl,
    fetchedUrl: finalUrl,
    statusCode,
    title,
    titleLength,
    metaDescription,
    metaDescriptionLength,
    h1: h1Matches,
    headings,
    wordCount,
    images,
    imagesWithoutAlt,
    internalLinks,
    externalLinks,
    canonical,
    robotsMeta,
    hasViewport,
    openGraph,
    httpsOk,
    score,
    checks,
    pageSpeed: null,
  };
}

function check(
  id: string,
  label: string,
  status: SeoCheck["status"],
  detail: string,
  weight: number,
): SeoCheck {
  return { id, label, status, detail, weight };
}

function yn(b: boolean): string {
  return b ? "✓" : "✗";
}

export function scoreChecks(checks: SeoCheck[]): number {
  const max = checks.reduce((s, c) => s + c.weight, 0);
  if (max === 0) return 0;
  const got = checks.reduce((s, c) => {
    const factor = c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0;
    return s + c.weight * factor;
  }, 0);
  return Math.round((got / max) * 100);
}

// Fetches the page (server-side) with a timeout and a real User-Agent.
export async function fetchPage(
  url: string,
): Promise<{ finalUrl: string; statusCode: number; html: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; FreeMarketingSuiteBot/1.0; +https://github.com/)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    const html = await res.text();
    return { finalUrl: res.url || url, statusCode: res.status, html };
  } finally {
    clearTimeout(timeout);
  }
}

// Optional Google PageSpeed Insights enrichment. Free API; a key raises the
// rate limit. Returns null (silently) if unavailable so the audit still works.
export async function fetchPageSpeed(url: string): Promise<PageSpeed | null> {
  const key = process.env.PAGESPEED_API_KEY;
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("strategy", "mobile");
  if (key) endpoint.searchParams.set("key", key);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(endpoint.toString(), { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    const lh = data?.lighthouseResult;
    const audits = lh?.audits ?? {};
    const perf = lh?.categories?.performance?.score;
    return {
      performance: typeof perf === "number" ? Math.round(perf * 100) : null,
      lcp: audits["largest-contentful-paint"]?.displayValue ?? null,
      cls: audits["cumulative-layout-shift"]?.displayValue ?? null,
      fcp: audits["first-contentful-paint"]?.displayValue ?? null,
    };
  } catch {
    return null;
  }
}

// Free keyword ideas via Google Autocomplete (public suggest endpoint).
// Gives *related queries* — not search volume (which needs a paid index).
export async function keywordIdeas(seed: string): Promise<string[]> {
  const endpoint = new URL("https://suggestqueries.google.com/complete/search");
  endpoint.searchParams.set("client", "firefox");
  endpoint.searchParams.set("q", seed);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(endpoint.toString(), { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.[1]) ? (data[1] as string[]) : [];
  } catch {
    return [];
  }
}
