import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { WishlistProvider } from "@/components/WishlistProvider";
import { Nav } from "@/components/Nav";
import "./globals.css";

const display = Fraunces({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trendr — fashion trends & dupes",
  description:
    "Discover what's trending in fashion, find the best-value dupes with prices, save them to your wishlist, and shop the retailers directly.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#d23f57",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body">
        <WishlistProvider>
          <Nav />
          <main className="animate-fadeIn">{children}</main>
          <footer className="mt-16 border-t border-line">
            <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-ink/50">
              <p className="font-display text-lg text-ink">
                Trendr<span className="text-rose">.</span>
              </p>
              <p className="mt-1 max-w-xl">
                A demo fashion-trends app. Prices are indicative and “Buy”
                links open each retailer&apos;s own site — Trendr doesn&apos;t
                sell or ship anything itself.
              </p>
            </div>
          </footer>
        </WishlistProvider>
      </body>
    </html>
  );
}
