"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTenders } from "@/lib/storage";
import type { TenderStatus } from "@/lib/types";

const STATUSES: TenderStatus[] = [
  "draft",
  "in-progress",
  "submitted",
  "won",
  "lost",
];

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

export default function TendersPage() {
  const { tenders, createTender, deleteTender } = useTenders();
  const router = useRouter();
  const [filter, setFilter] = useState<TenderStatus | "all">("all");

  const list = tenders
    .filter((t) => (filter === "all" ? true : t.status === filter))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  function start() {
    const id = createTender();
    router.push(`/tenders/${id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Tenders
          </h1>
          <p className="mt-1 text-mist">
            Assemble each bid from your library and export it to Word.
          </p>
        </div>
        <button className="btn-accent" onClick={start}>
          + New tender
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>
          All ({tenders.length})
        </Chip>
        {STATUSES.map((s) => (
          <Chip key={s} active={filter === s} onClick={() => setFilter(s)}>
            {STATUS_LABEL[s]} ({tenders.filter((t) => t.status === s).length})
          </Chip>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="card p-10 text-center text-mist">
          {tenders.length === 0
            ? "No tenders yet — start your first bid."
            : "No tenders with this status."}
        </div>
      ) : (
        <ul className="space-y-2">
          {list.map((t) => (
            <li key={t.id} className="card flex items-center gap-4 p-4">
              <Link href={`/tenders/${t.id}`} className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{t.title}</p>
                <p className="truncate text-sm text-mist">
                  {t.client || "No client"}
                  {t.reference ? ` · ${t.reference}` : ""}
                  {t.dueDate ? ` · Due ${t.dueDate}` : ""}
                  {` · ${t.sections.length} section${
                    t.sections.length === 1 ? "" : "s"
                  }`}
                </p>
              </Link>
              <span
                className={`chip shrink-0 border-transparent ${STATUS_STYLE[t.status]}`}
              >
                {STATUS_LABEL[t.status]}
              </span>
              <button
                className="btn-ghost btn-sm shrink-0 text-accent-dark"
                onClick={() => {
                  if (window.confirm(`Delete “${t.title}”?`)) deleteTender(t.id);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-ink text-white"
          : "border border-line bg-paper text-mist hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
