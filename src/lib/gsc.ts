// Parsing and analysis of Google Search Console performance exports.
//
// Accepts the standard GSC "Queries" or "Pages" CSV export
// (Top queries/Top pages, Clicks, Impressions, CTR, Position) and also
// combined query+page exports (e.g. from the GSC API or Looker Studio),
// which unlock cannibalization detection.

export interface GscRow {
  /** Query text or page URL, depending on the export type. */
  key: string;
  /** Page URL when the export contains both query and page columns. */
  page?: string;
  clicks: number;
  impressions: number;
  /** Click-through rate as a fraction (0–1). */
  ctr: number;
  position: number;
}

export type DatasetKind = "queries" | "pages" | "query-page";

export interface Dataset {
  kind: DatasetKind;
  rows: GscRow[];
}

export interface CtrProblem extends GscRow {
  expectedCtr: number;
}

export interface CannibalGroup {
  query: string;
  pages: GscRow[];
  totalImpressions: number;
}

export interface Analysis {
  kind: DatasetKind;
  totals: {
    rows: number;
    clicks: number;
    impressions: number;
    avgCtr: number;
    avgPosition: number;
  };
  /** High impressions, (almost) no clicks, weak position → write content. */
  contentGaps: GscRow[];
  /** Position 4–15 with real demand → optimize the existing page. */
  strikingDistance: GscRow[];
  /** Ranks well but CTR is far below what the position should earn. */
  ctrProblems: CtrProblem[];
  /** Same query served by multiple pages (query+page exports only). */
  cannibalization: CannibalGroup[];
  topPerformers: GscRow[];
}

/** Minimal CSV parser that handles quoted cells and embedded commas/newlines. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (c !== "\r") {
      cell += c;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

function parseNumber(raw: string): number {
  const cleaned = raw.replace(/[%\s]/g, "").replace(/,(?=\d{3}\b)/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function findColumn(headers: string[], patterns: RegExp[]): number {
  for (const pattern of patterns) {
    const idx = headers.findIndex((h) => pattern.test(h));
    if (idx !== -1) return idx;
  }
  return -1;
}

/**
 * Parse a GSC CSV export into a typed dataset.
 * Throws with a human-readable message when the file isn't recognizable.
 */
export function parseGscCsv(text: string): Dataset {
  const grid = parseCsv(text);
  if (grid.length < 2) {
    throw new Error("The file looks empty — export the Queries or Pages CSV from Search Console and try again.");
  }

  const headers = grid[0].map((h) => h.trim().toLowerCase());
  const clicksIdx = findColumn(headers, [/click/]);
  const imprIdx = findColumn(headers, [/impression/]);
  const ctrIdx = findColumn(headers, [/^ctr$|ctr/]);
  const posIdx = findColumn(headers, [/position/]);
  const queryIdx = findColumn(headers, [/quer/, /keyword/]);
  const pageIdx = findColumn(headers, [/page/, /url/, /landing/]);

  if (clicksIdx === -1 || imprIdx === -1) {
    throw new Error(
      "Couldn't find Clicks/Impressions columns. Use the standard Search Console export (Performance → Export → CSV)."
    );
  }

  let kind: DatasetKind;
  let keyIdx: number;
  if (queryIdx !== -1 && pageIdx !== -1) {
    kind = "query-page";
    keyIdx = queryIdx;
  } else if (queryIdx !== -1) {
    kind = "queries";
    keyIdx = queryIdx;
  } else if (pageIdx !== -1) {
    kind = "pages";
    keyIdx = pageIdx;
  } else {
    // Fall back to the first non-numeric column (GSC always puts it first).
    kind = "queries";
    keyIdx = 0;
  }

  const rows: GscRow[] = [];
  for (const raw of grid.slice(1)) {
    const key = (raw[keyIdx] ?? "").trim();
    if (!key) continue;
    const clicks = parseNumber(raw[clicksIdx] ?? "0");
    const impressions = parseNumber(raw[imprIdx] ?? "0");
    const ctr =
      ctrIdx !== -1
        ? parseNumber(raw[ctrIdx] ?? "0") / ((raw[ctrIdx] ?? "").includes("%") ? 100 : 1)
        : impressions > 0
          ? clicks / impressions
          : 0;
    const position = posIdx !== -1 ? parseNumber(raw[posIdx] ?? "0") : 0;
    rows.push({
      key,
      page: kind === "query-page" ? (raw[pageIdx] ?? "").trim() : undefined,
      clicks,
      impressions,
      // Some locales export CTR as a fraction already; normalize > 1 values.
      ctr: ctr > 1 ? ctr / 100 : ctr,
      position,
    });
  }

  if (rows.length === 0) {
    throw new Error("No data rows found in the file.");
  }
  return { kind, rows };
}

/**
 * Rough organic CTR you'd expect at a given position
 * (industry-average curve; used to flag underperforming titles/metas).
 */
export function expectedCtr(position: number): number {
  const curve = [0.28, 0.15, 0.11, 0.08, 0.065, 0.05, 0.042, 0.036, 0.031, 0.027];
  if (position <= 1) return curve[0];
  if (position < 10) {
    const lo = Math.floor(position) - 1;
    const hi = Math.min(lo + 1, curve.length - 1);
    const frac = position - Math.floor(position);
    return curve[lo] + (curve[hi] - curve[lo]) * frac;
  }
  if (position <= 20) return 0.015;
  return 0.006;
}

export function analyze(dataset: Dataset): Analysis {
  const { rows, kind } = dataset;

  const clicks = rows.reduce((s, r) => s + r.clicks, 0);
  const impressions = rows.reduce((s, r) => s + r.impressions, 0);
  const weightedPos = rows.reduce((s, r) => s + r.position * r.impressions, 0);

  const contentGaps = rows
    .filter((r) => r.impressions >= 100 && r.clicks <= 1 && r.position > 8)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 50);

  const strikingDistance = rows
    .filter((r) => r.position >= 4 && r.position <= 15 && r.impressions >= 30)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 50);

  const ctrProblems: CtrProblem[] = rows
    .filter((r) => {
      if (r.position > 10 || r.impressions < 100) return false;
      return r.ctr < expectedCtr(r.position) * 0.4;
    })
    .map((r) => ({ ...r, expectedCtr: expectedCtr(r.position) }))
    .sort((a, b) => (b.expectedCtr - b.ctr) * b.impressions - (a.expectedCtr - a.ctr) * a.impressions)
    .slice(0, 50);

  const cannibalization: CannibalGroup[] = [];
  if (kind === "query-page") {
    const byQuery = new Map<string, GscRow[]>();
    for (const r of rows) {
      const list = byQuery.get(r.key) ?? [];
      list.push(r);
      byQuery.set(r.key, list);
    }
    for (const [query, pages] of Array.from(byQuery.entries())) {
      const meaningful = pages.filter((p) => p.impressions >= 10);
      if (meaningful.length >= 2) {
        cannibalization.push({
          query,
          pages: meaningful.sort((a, b) => b.impressions - a.impressions),
          totalImpressions: meaningful.reduce((s, p) => s + p.impressions, 0),
        });
      }
    }
    cannibalization.sort((a, b) => b.totalImpressions - a.totalImpressions);
    cannibalization.splice(30);
  }

  const topPerformers = [...rows].sort((a, b) => b.clicks - a.clicks).slice(0, 20);

  return {
    kind,
    totals: {
      rows: rows.length,
      clicks,
      impressions,
      avgCtr: impressions > 0 ? clicks / impressions : 0,
      avgPosition: impressions > 0 ? weightedPos / impressions : 0,
    },
    contentGaps,
    strikingDistance,
    ctrProblems,
    cannibalization,
    topPerformers,
  };
}

export function formatPct(fraction: number): string {
  return `${(fraction * 100).toFixed(fraction * 100 >= 10 ? 1 : 2)}%`;
}

export function formatNum(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 1 });
}
