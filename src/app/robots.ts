import type { MetadataRoute } from "next";
import { ALLOW_INDEXING, SITE_URL } from "@/lib/config";

// Generated at /robots.txt.
//
// A wedding gallery is private by default — guests reach it by link/QR, and
// their uploaded photos & guestbook messages should never end up in Google.
// So we disallow all crawling unless NEXT_PUBLIC_ALLOW_INDEXING=true.
export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEXING) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The gallery, guestbook and internal API expose guest content —
        // keep those out of the index even when the site is public.
        disallow: ["/api/", "/gallery", "/guestbook"],
      },
    ],
    ...(SITE_URL ? { sitemap: `${SITE_URL}/sitemap.xml` } : {}),
  };
}
