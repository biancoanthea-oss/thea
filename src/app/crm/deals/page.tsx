import { DealsBoard } from "@/components/DealsBoard";

export const metadata = { title: "Deals — Free Marketing Suite" };

export default function DealsPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
          HubSpot-lite
        </span>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Deals</h1>
        <p className="mt-1 text-slate-500">Move deals through your pipeline and track value by stage.</p>
      </div>
      <DealsBoard />
    </div>
  );
}
