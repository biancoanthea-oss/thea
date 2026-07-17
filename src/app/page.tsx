import Link from "next/link";
import { getAdminClient } from "@/lib/supabaseAdmin";
import { STAGE_LABELS } from "@/lib/config";
import type { Deal } from "@/lib/types";

export const dynamic = "force-dynamic";

type Stats = {
  configured: boolean;
  contacts: number;
  deals: number;
  openValue: number;
  wonValue: number;
  audits: number;
  avgScore: number | null;
};

async function getStats(): Promise<Stats> {
  try {
    const supabase = getAdminClient();
    const [contactsRes, dealsRes, auditsRes] = await Promise.all([
      supabase.from("contacts").select("id", { count: "exact", head: true }),
      supabase.from("deals").select("value, stage"),
      supabase.from("seo_audits").select("score"),
    ]);

    const deals = (dealsRes.data ?? []) as Pick<Deal, "value" | "stage">[];
    const openValue = deals
      .filter((d) => d.stage !== "won" && d.stage !== "lost")
      .reduce((s, d) => s + Number(d.value || 0), 0);
    const wonValue = deals
      .filter((d) => d.stage === "won")
      .reduce((s, d) => s + Number(d.value || 0), 0);

    const scores = (auditsRes.data ?? []).map((a) => Number(a.score));
    const avgScore =
      scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

    return {
      configured: true,
      contacts: contactsRes.count ?? 0,
      deals: deals.length,
      openValue,
      wonValue,
      audits: scores.length,
      avgScore,
    };
  } catch {
    return {
      configured: false,
      contacts: 0,
      deals: 0,
      openValue: 0,
      wonValue: 0,
      audits: 0,
      avgScore: null,
    };
  }
}

function money(n: number): string {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">Marketing Suite</h1>
        <p className="mt-1 text-slate-500">
          A free, self-hosted alternative to the basics of SEMrush &amp; HubSpot — SEO audits and a
          CRM, running entirely on free tiers.
        </p>
      </section>

      {!stats.configured && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Supabase isn&apos;t connected yet.</strong> The SEO auditor still works, but the
          CRM and audit history need a database. Add your Supabase keys to <code>.env.local</code>{" "}
          and run <code>supabase/schema.sql</code> — see the README.
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Contacts" value={String(stats.contacts)} />
        <Stat label="Open pipeline" value={money(stats.openValue)} />
        <Stat label="Won revenue" value={money(stats.wonValue)} />
        <Stat label="Avg SEO score" value={stats.avgScore === null ? "—" : `${stats.avgScore}/100`} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <FeatureCard
          href="/seo"
          badge="SEMrush-lite"
          title="SEO Tools"
          desc="Run an on-page audit of any URL, get a graded checklist, and pull free keyword ideas."
          cta="Audit a page →"
        />
        <FeatureCard
          href="/crm"
          badge="HubSpot-lite"
          title="CRM"
          desc="Track contacts, log activity, and move deals through a pipeline board."
          cta="Open CRM →"
        />
      </section>

      <section className="card">
        <h2 className="text-sm font-semibold text-slate-900">Pipeline stages</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.values(STAGE_LABELS).map((s) => (
            <span key={s} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {s}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function FeatureCard({
  href,
  badge,
  title,
  desc,
  cta,
}: {
  href: string;
  badge: string;
  title: string;
  desc: string;
  cta: string;
}) {
  return (
    <Link href={href} className="card group transition hover:border-brand-300 hover:shadow-md">
      <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
        {badge}
      </span>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
      <span className="mt-4 inline-block text-sm font-medium text-brand-600 group-hover:text-brand-700">
        {cta}
      </span>
    </Link>
  );
}
