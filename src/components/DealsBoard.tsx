"use client";

import { useEffect, useState } from "react";
import { DEAL_STAGES, STAGE_LABELS, type DealStage } from "@/lib/config";
import type { Contact, Deal } from "@/lib/types";

function money(n: number): string {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function DealsBoard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [dRes, cRes] = await Promise.all([
        fetch("/api/crm/deals"),
        fetch("/api/crm/contacts"),
      ]);
      const dData = await dRes.json();
      const cData = await cRes.json();
      if (!dRes.ok) throw new Error(dData?.error || "Failed to load deals");
      setDeals(dData.deals as Deal[]);
      setContacts((cData.contacts as Contact[]) ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function move(deal: Deal, stage: DealStage) {
    setDeals((prev) => prev.map((d) => (d.id === deal.id ? { ...d, stage } : d)));
    await fetch(`/api/crm/deals/${deal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
  }

  async function remove(deal: Deal) {
    if (!confirm(`Delete deal "${deal.title}"?`)) return;
    setDeals((prev) => prev.filter((d) => d.id !== deal.id));
    await fetch(`/api/crm/deals/${deal.id}`, { method: "DELETE" });
  }

  const stageTotal = (stage: DealStage) =>
    deals.filter((d) => d.stage === stage).reduce((s, d) => s + Number(d.value || 0), 0);

  return (
    <div className="space-y-5">
      <AddDealForm contacts={contacts} onAdded={(d) => setDeals((prev) => [d, ...prev])} />
      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {DEAL_STAGES.map((stage) => {
            const inStage = deals.filter((d) => d.stage === stage);
            return (
              <div key={stage} className="rounded-xl bg-slate-100/70 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">{STAGE_LABELS[stage]}</span>
                  <span className="text-xs text-slate-400">{money(stageTotal(stage))}</span>
                </div>
                <div className="space-y-2">
                  {inStage.map((d) => (
                    <div key={d.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium text-slate-900">{d.title}</span>
                        <button
                          onClick={() => remove(d)}
                          className="text-xs text-slate-300 hover:text-rose-600"
                          aria-label="Delete deal"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="mt-1 text-sm font-semibold text-emerald-600">{money(Number(d.value))}</div>
                      {d.contact && (
                        <div className="mt-1 text-xs text-slate-400">{d.contact.name}</div>
                      )}
                      <select
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs"
                        value={d.stage}
                        onChange={(e) => move(d, e.target.value as DealStage)}
                      >
                        {DEAL_STAGES.map((s) => (
                          <option key={s} value={s}>
                            {STAGE_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  {inStage.length === 0 && (
                    <p className="rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-400">
                      Empty
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AddDealForm({
  contacts,
  onAdded,
}: {
  contacts: Contact[];
  onAdded: (d: Deal) => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", value: "", stage: "lead", contact_id: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/crm/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          value: Number(form.value) || 0,
          stage: form.stage,
          contact_id: form.contact_id || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to add deal");
      onAdded(data.deal as Deal);
      setForm({ title: "", value: "", stage: "lead", contact_id: "" });
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add deal");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button className="btn-primary" onClick={() => setOpen(true)}>
        + Add deal
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="card grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="lg:col-span-2">
        <label className="label">Title *</label>
        <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} autoFocus />
      </div>
      <div>
        <label className="label">Value (USD)</label>
        <input
          className="input"
          type="number"
          min="0"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Stage</label>
        <select className="input" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
          {DEAL_STAGES.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <div className="lg:col-span-2">
        <label className="label">Contact</label>
        <select className="input" value={form.contact_id} onChange={(e) => setForm({ ...form, contact_id: e.target.value })}>
          <option value="">— none —</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.company ? ` (${c.company})` : ""}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm text-rose-700 sm:col-span-2 lg:col-span-4">{error}</p>}
      <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
        <button className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save deal"}
        </button>
        <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
