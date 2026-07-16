import type { Metadata, Viewport } from "next";
import { Great_Vibes, Playfair_Display } from "next/font/google";
import { ALLOW_INDEXING, COUPLE_NAME, OG_IMAGE, SITE_URL } from "@/lib/config";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const title = `${COUPLE_NAME}'s Wedding`;
const description = `Share your photos & videos from ${COUPLE_NAME}'s wedding — no app, no login.`;

export const metadata: Metadata = {
  // metadataBase lets Next resolve the OG/Twitter image to an absolute URL.
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: {
    default: title,
    template: `%s · ${title}`,
  },
  description,
  applicationName: title,
  // Private by default: keep guests' photos & messages out of search engines.
  // Flip NEXT_PUBLIC_ALLOW_INDEXING=true to allow indexing.
  robots: ALLOW_INDEXING
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  // Open Graph / Twitter cards still render in iMessage, WhatsApp, Slack,
  // Facebook, etc. even when the page is noindex — social scrapers read
  // these tags directly, so the shared link always looks good.
  // When OG_IMAGE is empty, the branded card from opengraph-image.tsx is used
  // automatically; only set `images` here for an explicit override.
  openGraph: {
    type: "website",
    title,
    description,
    siteName: title,
    ...(SITE_URL ? { url: SITE_URL } : {}),
    ...(OG_IMAGE
      ? { images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }] }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    ...(OG_IMAGE ? { images: [OG_IMAGE] } : {}),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6f7a4f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${greatVibes.variable} ${playfair.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
