"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWishlist } from "./WishlistProvider";

export function Nav() {
  const { count, ready } = useWishlist();
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Trends" },
    { href: "/dupes", label: "All dupes" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
          Trendr<span className="text-rose">.</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-ink text-white"
                    : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}

          <Link
            href="/wishlist"
            className="relative inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium hover:border-rose/40"
          >
            <span aria-hidden className="text-rose">
              ♥
            </span>
            <span className="hidden sm:inline">Wishlist</span>
            {ready && count > 0 ? (
              <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1.5 text-xs font-semibold text-white">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </nav>
    </header>
  );
}
