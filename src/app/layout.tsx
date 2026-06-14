import type { Metadata, Viewport } from "next";
import { Great_Vibes, Cormorant_Garamond } from "next/font/google";
import { COUPLE_NAME } from "@/lib/config";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${COUPLE_NAME}'s Wedding`,
  description: `Share your photos & videos from ${COUPLE_NAME}'s wedding`,
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
    <html lang="en" className={`${greatVibes.variable} ${cormorant.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
