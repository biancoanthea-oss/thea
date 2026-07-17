"use client";

import { useEffect, useState } from "react";
import { CONTACT_STATUSES, type ContactStatus } from "@/lib/config";
import type { Activity, Contact } from "@/lib/types";

const STATUS_BADGE: Record<ContactStatus, string> = {
  subscriber: "bg-slate-100 text-slate-600",
  lead: "bg-blue-100 text-blue-700",
  customer: "bg-emerald-100 text-emerald-700",
  churned: "bg-rose-100 text-rose-700",
};

export function ContactsManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/contacts");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load");
      setContacts(data.contacts as Contact[]);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const selected = contacts.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-4">
        <AddContactForm onAdded={(c) => setContacts((prev) => [c, ...prev])} />
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : contacts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            No contacts yet. Add your first one above.
          </p>
        ) : (
          <ul className="space-y-2">
            {contacts.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selectedId === c.id
                      ? "border-brand-400 bg-brand-50/50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-900">{c.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[c.status]}`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {[c.company, c.email].filter(Boolean).join(" · ") || "No details"}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        {selected ? (
          <ContactDetail
            key={selected.id}
            contact={selected}
            onChange={(updated) =>
              setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
            }
            onDelete={(id) => {
              setContacts((prev) => prev.filter((c) => c.id !== id));
              setSelectedId(null);
            }}
          />
        ) : (
          <div className="card text-sm text-slate-400">Select a contact to see details.</div>
        )}
      </div>
    </div>
  );
}

function AddContactForm({ onAdded }: { onAdded: (c: Contact) => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", status: "lead" });
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/crm/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to add");
      onAdded(data.contact as Contact);
      setForm({ name: "", email: "", company: "", phone: "", status: "lead" });
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add contact");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button className="btn-primary w-full" onClick={() => setOpen(true)}>
        + Add contact
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Name *</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Company</label>
          <input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {CONTACT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-rose-700">{error}</p>}
      <div className="flex gap-2">
        <button className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save contact"}
        </button>
        <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function ContactDetail({
  contact,
  onChange,
  onDelete,
}: {
  contact: Contact;
  onChange: (c: Contact) => void;
  onDelete: (id: string) => void;
}) {
  async function patch(patch: Partial<Contact>) {
    const res = await fetch(`/api/crm/contacts/${contact.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (res.ok) onChange(data.contact as Contact);
  }

  async function remove() {
    if (!confirm(`Delete ${contact.name}? This removes their activity too.`)) return;
    const res = await fetch(`/api/crm/contacts/${contact.id}`, { method: "DELETE" });
    if (res.ok) onDelete(contact.id);
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{contact.name}</h3>
          <div className="mt-0.5 text-sm text-slate-500">{contact.company || "—"}</div>
        </div>
        <button onClick={remove} className="text-xs font-medium text-rose-600 hover:underline">
          Delete
        </button>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <Field label="Email">{contact.email || "—"}</Field>
        <Field label="Phone">{contact.phone || "—"}</Field>
      </dl>

      <div>
        <label className="label">Status</label>
        <select
          className="input"
          value={contact.status}
          onChange={(e) => patch({ status: e.target.value as ContactStatus })}
        >
          {CONTACT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <NotesEditor contact={contact} onSaved={onChange} />
      <ActivityTimeline contactId={contact.id} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="break-all font-medium text-slate-800">{children}</dd>
    </div>
  );
}

function NotesEditor({ contact, onSaved }: { contact: Contact; onSaved: (c: Contact) => void }) {
  const [notes, setNotes] = useState(contact.notes ?? "");
  const [saving, setSaving] = useState(false);
  const dirty = notes !== (contact.notes ?? "");

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/crm/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      if (res.ok) onSaved(data.contact as Contact);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <label className="label">Notes</label>
      <textarea className="input min-h-[70px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
      {dirty && (
        <button className="btn-ghost mt-2" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save notes"}
        </button>
      )}
    </div>
  );
}

function ActivityTimeline({ contactId }: { contactId: string }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [type, setType] = useState<Activity["type"]>("note");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch(`/api/crm/activities?contact_id=${contactId}`);
    const data = await res.json();
    if (res.ok) setActivities(data.activities as Activity[]);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/crm/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact_id: contactId, type, body }),
      });
      const data = await res.json();
      if (res.ok) {
        setActivities((prev) => [data.activity as Activity, ...prev]);
        setBody("");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border-t border-slate-100 pt-4">
      <h4 className="mb-2 text-sm font-semibold text-slate-900">Activity</h4>
      <form onSubmit={add} className="space-y-2">
        <div className="flex gap-2">
          <select className="input w-28" value={type} onChange={(e) => setType(e.target.value as Activity["type"])}>
            <option value="note">Note</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="task">Task</option>
          </select>
          <input
            className="input"
            placeholder="Log something…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button className="btn-primary shrink-0" disabled={saving}>
            Log
          </button>
        </div>
      </form>
      <ul className="mt-3 space-y-2">
        {activities.map((a) => (
          <li key={a.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <span className="mr-2 rounded bg-white px-1.5 py-0.5 text-xs font-medium text-slate-500">
              {a.type}
            </span>
            {a.body}
            <div className="mt-0.5 text-xs text-slate-400">
              {new Date(a.created_at).toLocaleString()}
            </div>
          </li>
        ))}
        {activities.length === 0 && <li className="text-xs text-slate-400">No activity yet.</li>}
      </ul>
    </div>
  );
}
