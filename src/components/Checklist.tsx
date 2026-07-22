"use client";

import { useEffect, useMemo, useState } from "react";
import { CHECKLIST } from "@/lib/checklistData";

const STORAGE_KEY = "marketing-skills-checklist";

export default function Checklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      // Corrupt storage — start fresh.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked, loaded]);

  const { total, done } = useMemo(() => {
    const all = CHECKLIST.flatMap((s) => s.items);
    return { total: all.length, done: all.filter((i) => checked[i.id]).length };
  }, [checked]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-center justify-between text-sm">
          <p className="font-semibold text-slate-100">Audit progress</p>
          <p className="text-slate-400">
            {done} / {total}
          </p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${total ? (done / total) * 100 : 0}%` }}
          />
        </div>
        {done === total && (
          <p className="mt-2 text-sm text-emerald-300">
            Clean audit. Re-run it monthly — sites drift.
          </p>
        )}
      </div>

      {CHECKLIST.map((section) => (
        <section
          key={section.title}
          className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40"
        >
          <div className="border-b border-slate-800 px-4 py-3">
            <h2 className="font-semibold text-slate-100">{section.title}</h2>
            <p className="text-sm text-slate-400">{section.description}</p>
          </div>
          <ul className="divide-y divide-slate-800/70">
            {section.items.map((item) => (
              <li key={item.id}>
                <label className="flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-800/30">
                  <input
                    type="checkbox"
                    checked={!!checked[item.id]}
                    onChange={(e) =>
                      setChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 accent-indigo-500"
                  />
                  <span>
                    <span
                      className={`block text-sm font-medium ${
                        checked[item.id] ? "text-slate-500 line-through" : "text-slate-200"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="block text-xs text-slate-500">{item.hint}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
