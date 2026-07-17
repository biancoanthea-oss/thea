import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { APP_NAME } from "@/lib/config";
import { TopNav } from "@/components/TopNav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: `${APP_NAME} — free SEO + CRM`,
  description:
    "A free, self-hosted marketing suite: SEO audits (SEMrush-lite) and a CRM (HubSpot-lite).",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
        <TopNav />
        <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
