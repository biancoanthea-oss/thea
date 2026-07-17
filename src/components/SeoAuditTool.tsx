"use client";

import { useState } from "react";
import type { AuditResult, CheckStatus } from "@/lib/types";

const STATUS_STYLES: Record<CheckStatus, string> = {
  pass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warn: "bg-amber-50 text-amber-700 border-amber-200",
  fail: "bg-rose-50 text-rose-700 border-rose-200",
};
const STATUS_ICON: Record<CheckStatus, string> = { pass: "✓", warn: "!", fail: "✕" };

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-rose-600";
}

export function SeoAuditTool() {
  const [url, setUrl] = useState("");
  const [pagespeed, setPagespeed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/seo/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, pagespeed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Audit failed");
      setResult(data.result as AuditResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={runAudit} className="card space-y-4">
        <div>
          <label className="label" htmlFor="url">
            Page URL
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="url"
              className="input"
              placeholder="example.com/blog/post"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoComplete="off"
            />
            <button className="btn-primary shrink-0" disabled={loading}>
              {loading ? "Auditing…" : "Run audit"}
            </button>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={pagespeed}
            onChange={(e) => setPagespeed(e.target.checked)}
          />
          Also fetch Google PageSpeed / Core Web Vitals (slower)
        </label>
        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        )}
      </form>

      {result && <AuditReport result={result} />}

      <KeywordIdeas />

      <p className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
        <strong>What&apos;s free vs. not:</strong> on-page checks and keyword ideas use only public
        data and cost nothing. True <em>search volume</em>, keyword difficulty, and backlink counts
        require a proprietary crawl index (what SEMrush actually sells) and can&apos;t be sourced for
        free — so they&apos;re intentionally left out here.
      </p>
    </div>
  );
}

function AuditReport({ result }: { result: AuditResult }) {
  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Audited
          </div>
          <a
            href={result.fetchedUrl}
            target="_blank"
            rel="noreferrer"
            className="break-all text-sm font-medium text-brand-700 hover:underline"
          >
            {result.fetchedUrl}
          </a>
          <div className="mt-1 text-xs text-slate-400">HTTP {result.statusCode}</div>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${scoreColor(result.score)}`}>{result.score}</div>
          <div className="text-xs text-slate-400">/ 100</div>
        </div>
      </div>

      {result.pageSpeed && (
        <div className="card grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Performance" value={result.pageSpeed.performance === null ? "—" : `${result.pageSpeed.performance}`} />
          <Metric label="LCP" value={result.pageSpeed.lcp ?? "—"} />
          <Metric label="CLS" value={result.pageSpeed.cls ?? "—"} />
          <Metric label="FCP" value={result.pageSpeed.fcp ?? "—"} />
        </div>
      )}

      <div className="card">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Checks</h3>
        <ul className="space-y-2">
          {result.checks.map((c) => (
            <li
              key={c.id}
              className={`flex items-start gap-3 rounded-lg border px-3 py-2 ${STATUS_STYLES[c.status]}`}
            >
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/70 text-xs font-bold">
                {STATUS_ICON[c.status]}
              </span>
              <div>
                <div className="text-sm font-medium">{c.label}</div>
                <div className="text-xs opacity-80">{c.detail}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <Fact label="Title">{result.title ? `${result.titleLength} chars` : "—"}</Fact>
        <Fact label="Meta desc">{result.metaDescription ? `${result.metaDescriptionLength} chars` : "—"}</Fact>
        <Fact label="Word count">{result.wordCount}</Fact>
        <Fact label="H1 / H2 / H3">{`${result.headings.h1} / ${result.headings.h2} / ${result.headings.h3}`}</Fact>
        <Fact label="Images (no alt)">{`${result.images} (${result.imagesWithoutAlt})`}</Fact>
        <Fact label="Links int/ext">{`${result.internalLinks} / ${result.externalLinks}`}</Fact>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="font-medium text-slate-800">{children}</div>
    </div>
  );
}

function KeywordIdeas() {
  const [seed, setSeed] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<string[] | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!seed.trim()) return;
    setLoading(true);
    setIdeas(null);
    try {
      const res = await fetch(`/api/seo/keywords?q=${encodeURIComponent(seed)}`);
      const data = await res.json();
      setIdeas(Array.isArray(data.ideas) ? data.ideas : []);
    } catch {
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card space-y-3">
      <h3 className="text-sm font-semibold text-slate-900">Keyword ideas</h3>
      <form onSubmit={search} className="flex flex-col gap-2 sm:flex-row">
        <input
          className="input"
          placeholder="e.g. wedding photography"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
        />
        <button className="btn-ghost shrink-0" disabled={loading}>
          {loading ? "Searching…" : "Get ideas"}
        </button>
      </form>
      {ideas && ideas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ideas.map((k) => (
            <span key={k} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
              {k}
            </span>
          ))}
        </div>
      )}
      {ideas && ideas.length === 0 && (
        <p className="text-xs text-slate-400">No suggestions found.</p>
      )}
    </div>
  );
}
