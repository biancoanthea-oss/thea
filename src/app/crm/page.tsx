import { ContactsManager } from "@/components/ContactsManager";

export const metadata = { title: "Contacts — Free Marketing Suite" };

export default function CrmPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
          HubSpot-lite
        </span>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Contacts</h1>
        <p className="mt-1 text-slate-500">Your people, their status, and a timeline of activity.</p>
      </div>
      <ContactsManager />
    </div>
  );
}
