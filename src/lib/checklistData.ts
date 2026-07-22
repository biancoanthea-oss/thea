// The SEO + AEO audit checklist. Checked state is persisted per-item in
// localStorage so the audit survives reloads.

export interface ChecklistItem {
  id: string;
  label: string;
  hint: string;
}

export interface ChecklistSection {
  title: string;
  description: string;
  items: ChecklistItem[];
}

export const CHECKLIST: ChecklistSection[] = [
  {
    title: "Technical SEO",
    description: "The plumbing. Any one of these silently caps how far everything else can go.",
    items: [
      {
        id: "tech-redirects",
        label: "No redirect chains — every redirect is a single 301 hop",
        hint: "Chains leak authority. Crawl the site (or spot-check with curl -IL) and collapse A→B→C into A→C.",
      },
      {
        id: "tech-canonical",
        label: "Exactly one self-referencing canonical tag per page",
        hint: "Duplicate or conflicting canonicals confuse Google about which URL to index.",
      },
      {
        id: "tech-schema-dupes",
        label: "No duplicate structured-data blocks on any page",
        hint: "Templates + page-level schema often double up. View source and count the JSON-LD script tags.",
      },
      {
        id: "tech-hydration",
        label: "Pages render without hydration errors or content flashes",
        hint: "Hydration bugs inflate bounce rate and hide content from crawlers. Check the browser console on key templates.",
      },
      {
        id: "tech-sitemap",
        label: "sitemap.xml is current and submitted in Search Console",
        hint: "New content should appear in the sitemap automatically on publish.",
      },
      {
        id: "tech-robots",
        label: "robots.txt isn't blocking anything important",
        hint: "Verify key routes aren't disallowed, and that staging rules didn't ship to production.",
      },
      {
        id: "tech-cwv",
        label: "Core Web Vitals pass (LCP, CLS, INP)",
        hint: "Check PageSpeed Insights for the key templates, not just the homepage.",
      },
      {
        id: "tech-thin",
        label: "No thin or soft-404 pages left indexed",
        hint: "Search Console → Indexing → Pages. Noindex or beef up anything with no real content.",
      },
    ],
  },
  {
    title: "On-page",
    description: "What Google shows in the SERP. This is where CTR is won or lost.",
    items: [
      {
        id: "onpage-titles",
        label: "Title tags ≤ 60 characters, unique, keyword near the front",
        hint: "Longer titles get truncated with '…' and CTR drops sitewide. Audit templates, not just pages.",
      },
      {
        id: "onpage-metas",
        label: "Meta descriptions 140–160 characters with a reason to click",
        hint: "A benefit and an implicit CTA. Google rewrites bad ones — give it no reason to.",
      },
      {
        id: "onpage-h1",
        label: "One H1 per page that matches the search intent",
        hint: "The H1 confirms to the visitor they landed in the right place — mismatch means bounce.",
      },
      {
        id: "onpage-internal-links",
        label: "Every important page has internal links in and out",
        hint: "Orphan pages don't rank. Link from high-authority pages with descriptive anchor text.",
      },
      {
        id: "onpage-urls",
        label: "URLs are short, descriptive, and stable",
        hint: "No query-string junk in canonical URLs; slugs contain the target keyword.",
      },
      {
        id: "onpage-alt",
        label: "Images have descriptive alt text",
        hint: "Accessibility + image search + one more relevance signal.",
      },
    ],
  },
  {
    title: "Content",
    description: "One query, one page, a real answer. The compounding asset.",
    items: [
      {
        id: "content-dedicated",
        label: "Each target query has exactly one dedicated page",
        hint: "Cannibalization splits authority. Use the analyzer's query+page upload to catch it.",
      },
      {
        id: "content-answer-first",
        label: "Articles answer the query in the first paragraph",
        hint: "No throat-clearing intros. The direct answer up top is also what AI engines quote.",
      },
      {
        id: "content-faq",
        label: "Long-tail variants covered in an FAQ section",
        hint: "Captures 'people also ask' queries and feeds FAQPage schema.",
      },
      {
        id: "content-refresh",
        label: "Slipping pages get refreshed, not abandoned",
        hint: "Watch striking-distance keywords weekly; update content and re-request indexing.",
      },
    ],
  },
  {
    title: "AEO — AI Engine Optimization",
    description: "What makes ChatGPT, Gemini, Perplexity — and Claude — cite you organically.",
    items: [
      {
        id: "aeo-jsonld",
        label: "JSON-LD structured data on every page type",
        hint: "Organization, WebSite, Article, Product/SoftwareApplication, BreadcrumbList — whatever fits each template.",
      },
      {
        id: "aeo-faq-schema",
        label: "FAQPage / HowTo schema wherever the content supports it",
        hint: "Structured Q&A is the easiest format for AI engines to extract and cite.",
      },
      {
        id: "aeo-ssr",
        label: "Content readable without JavaScript (SSR / semantic HTML)",
        hint: "Many AI crawlers don't execute JS. View source: if the answer isn't in the HTML, you don't exist to them.",
      },
      {
        id: "aeo-facts",
        label: "Facts, numbers, and definitions stated plainly and datably",
        hint: "'X does Y. It costs Z. Updated 2026-07.' Citable sentences get cited.",
      },
      {
        id: "aeo-about",
        label: "Clear About page + llms.txt describing what the site is",
        hint: "Make it trivial for an AI engine to describe your product accurately in one sentence.",
      },
      {
        id: "aeo-og",
        label: "Open Graph + Twitter metadata complete on every page",
        hint: "Clean previews everywhere your links get shared — including inside AI chat answers.",
      },
    ],
  },
];
