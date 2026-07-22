"use client";

import { useEffect, useState } from "react";
import Analyzer from "@/components/Analyzer";
import Checklist from "@/components/Checklist";
import Workflow from "@/components/Workflow";

const TABS = [
  { id: "analyzer", label: "Analyzer" },
  { id: "checklist", label: "Audit checklist" },
  { id: "workflow", label: "Weekly workflow" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const SITE_KEY = "marketing-skills-site";

export default function Home() {
  const [tab, setTab] = useState<TabId>("analyzer");
  const [site, setSite] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(SITE_KEY);
    if (saved) setSite(saved);
  }, []);

  function updateSite(value: string) {
    setSite(value);
    localStorage.setItem(SITE_KEY, value);
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">Marketing Skills</h1>
        <p className="mt-1 text-sm text-slate-400">
          Search Console analyzer + prompt generator + SEO/AEO audit. All in your browser — no data
          leaves this page.
        </p>
        <div className="mt-4 flex max-w-md items-center gap-2">
          <label htmlFor="site" className="shrink-0 text-sm text-slate-400">
            Your site
          </label>
          <input
            id="site"
            type="text"
            value={site}
            onChange={(e) => updateSite(e.target.value)}
            placeholder="e.g. agensi.io"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors focus:border-indigo-500"
          />
        </div>
      </header>

      <nav className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-indigo-500 text-white"
                : "bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "analyzer" && <Analyzer site={site} />}
      {tab === "checklist" && <Checklist />}
      {tab === "workflow" && <Workflow />}
    </main>
  );
}
