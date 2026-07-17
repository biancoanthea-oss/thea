"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/lib/config";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/seo", label: "SEO Tools" },
  { href: "/crm", label: "Contacts" },
  { href: "/crm/deals", label: "Deals" },
];

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center gap-1 px-4 py-3">
        <Link href="/" className="mr-4 flex items-center gap-2 font-semibold text-slate-900">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-600 text-xs font-bold text-white">
            FM
          </span>
          <span className="hidden sm:inline">{APP_NAME}</span>
        </Link>
        <div className="flex items-center gap-1">
          {LINKS.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
