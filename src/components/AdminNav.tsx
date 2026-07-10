"use client";

import Link from "next/link";

const LINKS = [
  { href: "/", label: "Upload" },
  { href: "/gallery", label: "Gallery" },
  { href: "/slideshow", label: "Slideshow" },
  { href: "/guestbook", label: "Guestbook" },
  { href: "/shopping", label: "Shopping" },
];

export default function AdminNav({ active }: { active: string }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 border-b border-sage/20 bg-cream/80 px-5 py-3 backdrop-blur">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            active === l.href
              ? "bg-sage text-cream"
              : "text-sage-dark hover:bg-sage/15"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
