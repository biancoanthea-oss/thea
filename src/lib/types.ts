import type { ContactStatus, DealStage } from "./config";

// ── CRM (HubSpot-lite) ──────────────────────────────────────────────────────

export type Contact = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  phone: string | null;
  status: ContactStatus;
  notes: string | null;
  created_at: string;
};

export type Deal = {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  contact_id: string | null;
  created_at: string;
  // Joined for display (optional).
  contact?: Pick<Contact, "id" | "name" | "company"> | null;
};

export type Activity = {
  id: string;
  contact_id: string;
  type: "note" | "call" | "email" | "task";
  body: string;
  created_at: string;
};

// ── SEO (SEMrush-lite) ───────────────────────────────────────────────────────

export type CheckStatus = "pass" | "warn" | "fail";

export type SeoCheck = {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
  weight: number;
};

export type PageSpeed = {
  performance: number | null;
  lcp: string | null;
  cls: string | null;
  fcp: string | null;
};

export type AuditResult = {
  url: string;
  fetchedUrl: string;
  statusCode: number;
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  h1: string[];
  headings: { h1: number; h2: number; h3: number };
  wordCount: number;
  images: number;
  imagesWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  canonical: string | null;
  robotsMeta: string | null;
  hasViewport: boolean;
  openGraph: { title: boolean; description: boolean; image: boolean };
  httpsOk: boolean;
  score: number;
  checks: SeoCheck[];
  pageSpeed: PageSpeed | null;
};

export type SeoAudit = {
  id: string;
  url: string;
  score: number;
  result: AuditResult;
  created_at: string;
};
