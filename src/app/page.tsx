"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLibrary, useTenders } from "@/lib/storage";
import { BackupControls } from "@/components/BackupControls";
import type { TenderStatus } from "@/lib/types";

const STATUS_LABEL: Record<TenderStatus, string> = {
  draft: "Draft",
  "in-progress": "In progress",
  submitted: "Submitted",
  won: "Won",
  lost: "Lost",
};

const STATUS_STYLE: Record<TenderStatus, string> = {
  draft: "bg-paper text-mist",
  "in-progress": "bg-accent-soft text-accent-dark",
  submitted: "bg-ink text-white",
  won: "bg-moss/15 text-moss",
  lost: "bg-line text-mist",
};

export default function Dashboard() {
  const { blocks } = useLibrary();
  const { tenders, createTender } = useTenders();
  const router = useRouter();

  const topBlocks = [...blocks]
    .filter((b) => b.timesUsed > 0)
    .sort((a, b) => b.timesUsed - a.timesUsed)
    .slice(0, 5);

  const recentTenders = [...tenders]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 6);

  function startTender() {
    const id = createTender();
    router.push(`/tenders/${id}`);
  }

  return (
    <div className="space-y-8">
      <section className="animate-fadeIn">
        <p className="text-sm font-medium text-accent">Welcome back</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Write better tenders, faster.
        </h1>
        <p className="mt-2 max-w-2xl text-mist">
          Keep the best parts of every bid in one library, drop them into new
          tenders, and let AI help you polish and tailor each response.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="btn-accent" onClick={startTender}>
            + New tender
          </button>
          <Link href="/library" className="btn-ghost">
            Browse content library
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Library blocks" value={blocks.length} />
        <Stat label="Tenders" value={tenders.length} />
        <Stat
          label="Won"
          value={tenders.filter((t) => t.status === "won").length}
        />
        <Stat
          label="In progress"
          value={
            tenders.filter(
              (t) => t.status === "in-progress" || t.status === "draft"
            ).length
          }
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Recent tenders</h2>
            <Link href="/tenders" className="text-sm font-medium text-accent hover:underline">
              View all
            </Link>
          </div>
          {recentTenders.length === 0 ? (
            <div className="card p-8 text-center text-mist">
              No tenders yet.{" "}
              <button className="font-medium text-accent hover:underline" onClick={startTender}>
                Start your first one →
              </button>
            </div>
          ) : (
            <ul className="space-y-2">
              {recentTenders.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/tenders/${t.id}`}
                    className="card flex items-center justify-between gap-4 p-4 transition hover:shadow-lift"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{t.title}</p>
                      <p className="truncate text-sm text-mist">
                        {t.client || "No client set"}
                        {t.dueDate ? ` · Due ${t.dueDate}` : ""}
                        {` · ${t.sections.length} section${
                          t.sections.length === 1 ? "" : "s"
                        }`}
                      </p>
                    </div>
                    <span
                      className={`chip shrink-0 border-transparent ${STATUS_STYLE[t.status]}`}
                    >
                      {STATUS_LABEL[t.status]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-3 font-display text-xl font-semibold">
              Most reused
            </h2>
            {topBlocks.length === 0 ? (
              <div className="card p-5 text-sm text-mist">
                Once you start pulling library blocks into tenders, your
                greatest hits show up here.
              </div>
            ) : (
              <ul className="card divide-y divide-line">
                {topBlocks.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {b.title}
                      </p>
                      <p className="truncate text-xs text-mist">{b.category}</p>
                    </div>
                    <span className="chip shrink-0">×{b.timesUsed}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <BackupControls />
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4">
      <p className="text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-mist">
        {label}
      </p>
    </div>
  );
}
