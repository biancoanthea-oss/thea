import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Tender Studio · Stacked",
  description:
    "Reuse the best parts of past tenders and write better bids, faster.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
