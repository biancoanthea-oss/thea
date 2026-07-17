import { SeoAuditTool } from "@/components/SeoAuditTool";

export const metadata = { title: "SEO Tools — Free Marketing Suite" };

export default function SeoPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
          SEMrush-lite
        </span>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">SEO Tools</h1>
        <p className="mt-1 text-slate-500">
          On-page audits and keyword ideas — powered only by free, public data.
        </p>
      </div>
      <SeoAuditTool />
    </div>
  );
}
