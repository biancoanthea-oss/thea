"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Analysis,
  CannibalGroup,
  CtrProblem,
  GscRow,
  analyze,
  formatNum,
  formatPct,
  parseGscCsv,
} from "@/lib/gsc";
import {
  cannibalizationPrompt,
  contentBriefPrompt,
  ctrFixPrompt,
  strikingDistancePrompt,
  weeklyAnalysisPrompt,
} from "@/lib/prompts";
import CopyButton from "./CopyButton";

export default function Analyzer({ site }: { site: string }) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const loadFile = useCallback(async (file: File) => {
    setError("");
    try {
      const text = await file.text();
      setAnalysis(analyze(parseGscCsv(text)));
      setFileName(file.name);
    } catch (e) {
      setAnalysis(null);
      setError(e instanceof Error ? e.message : "Could not read that file.");
    }
  }, []);

  const weeklyPrompt = useMemo(
    () => (analysis ? weeklyAnalysisPrompt(site, analysis) : ""),
    [analysis, site]
  );

  return (
    <div className="space-y-8">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void loadFile(file);
        }}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging ? "border-indigo-400 bg-indigo-500/10" : "border-slate-700 bg-slate-900/40"
        }`}
      >
        <p className="text-lg font-semibold text-slate-100">
          Drop your Search Console CSV export here
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
          Search Console → Performance → Export → CSV. Upload{" "}
          <span className="text-slate-200">Queries.csv</span> or{" "}
          <span className="text-slate-200">Pages.csv</span>. A combined query+page export (API or
          Looker Studio) also unlocks cannibalization detection.
        </p>
        <label className="mt-4 inline-block cursor-pointer rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-400">
          Choose file
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void loadFile(file);
              e.target.value = "";
            }}
          />
        </label>
        {fileName && !error && (
          <p className="mt-3 text-xs text-slate-500">
            Loaded <span className="text-slate-300">{fileName}</span> — everything stays in your
            browser, nothing is uploaded anywhere.
          </p>
        )}
        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
      </div>

      {analysis && (
        <>
          <section>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <Stat label="Rows" value={formatNum(analysis.totals.rows)} />
              <Stat label="Clicks" value={formatNum(analysis.totals.clicks)} />
              <Stat label="Impressions" value={formatNum(analysis.totals.impressions)} />
              <Stat label="Avg CTR" value={formatPct(analysis.totals.avgCtr)} />
              <Stat label="Avg position" value={analysis.totals.avgPosition.toFixed(1)} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-indigo-200">Weekly analysis prompt</p>
                <p className="text-sm text-slate-400">
                  The whole export summarized into one prompt — paste it into Claude and ask for the
                  week&apos;s priorities.
                </p>
              </div>
              <CopyButton text={weeklyPrompt} label="Copy Claude prompt" />
            </div>
          </section>

          <FindingSection
            title="Content gaps"
            badge={analysis.contentGaps.length}
            description={
              analysis.kind === "pages"
                ? "Pages with impressions but almost no clicks and a weak position."
                : "Queries with real demand where nothing of yours ranks well. Each one is an article waiting to be written."
            }
            empty="No content gaps found at the current thresholds (≥100 impressions, ≤1 click, position >8)."
          >
            {analysis.contentGaps.map((row) => (
              <FindingRow
                key={row.key + (row.page ?? "")}
                row={row}
                prompt={contentBriefPrompt(site, row)}
                promptLabel="Copy article brief"
              />
            ))}
          </FindingSection>

          <FindingSection
            title="Striking distance"
            badge={analysis.strikingDistance.length}
            description="Position 4–15 with real impressions. A small on-page push moves these to page 1."
            empty="Nothing in striking distance (position 4–15 with ≥30 impressions)."
          >
            {analysis.strikingDistance.map((row) => (
              <FindingRow
                key={row.key + (row.page ?? "")}
                row={row}
                prompt={strikingDistancePrompt(site, row)}
                promptLabel="Copy action plan prompt"
              />
            ))}
          </FindingSection>

          <FindingSection
            title="CTR underperformers"
            badge={analysis.ctrProblems.length}
            description="Ranking in the top 10 but earning far fewer clicks than the position should. Usually a truncated title or a weak meta description."
            empty="No CTR underperformers — titles and metas are earning their positions."
          >
            {analysis.ctrProblems.map((row) => (
              <CtrRow
                key={row.key + (row.page ?? "")}
                row={row}
                prompt={ctrFixPrompt(site, row, analysis.kind === "pages")}
              />
            ))}
          </FindingSection>

          {analysis.kind === "query-page" ? (
            <FindingSection
              title="Cannibalization"
              badge={analysis.cannibalization.length}
              description="One query served by multiple pages — authority gets split and Google ranks neither well."
              empty="No cannibalization detected — each query resolves to one page."
            >
              {analysis.cannibalization.map((group) => (
                <CannibalRow key={group.query} group={group} site={site} />
              ))}
            </FindingSection>
          ) : (
            <p className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-500">
              Cannibalization detection needs an export with both query and page columns (GSC API or
              Looker Studio export). The standard Queries.csv can&apos;t show which pages compete.
            </p>
          )}

          <FindingSection
            title="Top performers"
            badge={analysis.topPerformers.length}
            description="Your best clicks — protect these pages, refresh them before they slip."
            empty=""
          >
            {analysis.topPerformers.map((row) => (
              <div
                key={row.key + (row.page ?? "")}
                className="flex items-center gap-4 px-4 py-2.5 text-sm"
              >
                <span className="min-w-0 flex-1 truncate text-slate-200" title={row.key}>
                  {row.key}
                </span>
                <Metric label="clicks" value={formatNum(row.clicks)} />
                <Metric label="impr" value={formatNum(row.impressions)} />
                <Metric label="pos" value={row.position.toFixed(1)} />
              </div>
            ))}
          </FindingSection>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-100">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <span className="w-20 shrink-0 text-right tabular-nums text-slate-400">
      <span className="text-slate-200">{value}</span>{" "}
      <span className="text-[10px] uppercase text-slate-600">{label}</span>
    </span>
  );
}

function FindingSection({
  title,
  badge,
  description,
  empty,
  children,
}: {
  title: string;
  badge: number;
  description: string;
  empty: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-4 text-left"
      >
        <span
          className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-sm font-bold ${
            badge > 0 ? "bg-indigo-500/20 text-indigo-300" : "bg-slate-800 text-slate-500"
          }`}
        >
          {badge}
        </span>
        <span className="flex-1">
          <span className="block font-semibold text-slate-100">{title}</span>
          <span className="block text-sm text-slate-400">{description}</span>
        </span>
        <span className="text-slate-500">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="divide-y divide-slate-800/70 border-t border-slate-800">
          {badge === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-500">{empty}</p>
          ) : (
            children
          )}
        </div>
      )}
    </section>
  );
}

function FindingRow({
  row,
  prompt,
  promptLabel,
}: {
  row: GscRow;
  prompt: string;
  promptLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 text-sm">
      <span className="min-w-0 flex-1 basis-52 truncate text-slate-200" title={row.key}>
        {row.key}
      </span>
      <Metric label="impr" value={formatNum(row.impressions)} />
      <Metric label="clicks" value={formatNum(row.clicks)} />
      <Metric label="pos" value={row.position.toFixed(1)} />
      <CopyButton text={prompt} label={promptLabel} />
    </div>
  );
}

function CtrRow({ row, prompt }: { row: CtrProblem; prompt: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 text-sm">
      <span className="min-w-0 flex-1 basis-52 truncate text-slate-200" title={row.key}>
        {row.key}
      </span>
      <span className="w-32 shrink-0 text-right tabular-nums">
        <span className="text-rose-300">{formatPct(row.ctr)}</span>
        <span className="text-slate-600"> / </span>
        <span className="text-slate-400">{formatPct(row.expectedCtr)}</span>
      </span>
      <Metric label="impr" value={formatNum(row.impressions)} />
      <Metric label="pos" value={row.position.toFixed(1)} />
      <CopyButton text={prompt} label="Copy title/meta fix" />
    </div>
  );
}

function CannibalRow({ group, site }: { group: CannibalGroup; site: string }) {
  return (
    <div className="px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="min-w-0 flex-1 basis-52 font-medium text-slate-200">
          &ldquo;{group.query}&rdquo;
          <span className="ml-2 text-xs text-slate-500">
            {group.pages.length} pages · {formatNum(group.totalImpressions)} impressions
          </span>
        </span>
        <CopyButton text={cannibalizationPrompt(site, group)} label="Copy consolidation plan" />
      </div>
      <ul className="mt-2 space-y-1">
        {group.pages.map((p) => (
          <li key={p.page} className="truncate pl-3 text-xs text-slate-400" title={p.page}>
            {p.page} — {formatNum(p.impressions)} impr, pos {p.position.toFixed(1)}
          </li>
        ))}
      </ul>
    </div>
  );
}
