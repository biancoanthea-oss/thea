"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const LINKS = [
  { href: "/gallery", label: "Gallery" },
  { href: "/slideshow", label: "Slideshow" },
  { href: "/guestbook", label: "Guestbook" },
];

export default function AdminNav({ active }: { active: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-sage/20 bg-cream/80 px-5 py-3 backdrop-blur">
      <div className="flex flex-wrap gap-2">
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
      </div>
      <button
        onClick={logout}
        className="rounded-full px-4 py-1.5 text-sm text-stone-500 hover:bg-stone-200"
      >
        Log out
      </button>
    </nav>
  );
}
