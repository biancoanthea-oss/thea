import type { Metadata } from "next";
import { allDupes } from "@/lib/data";
import { DupeBrowser } from "@/components/DupeBrowser";

export const metadata: Metadata = {
  title: "All dupes — Trendr",
  description: "Every tracked dupe across all trends, filterable by retailer and price.",
};

export default function DupesPage() {
  const rows = allDupes();

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">
        All dupes
      </h1>
      <p className="mt-2 max-w-xl text-ink/60">
        Every dupe we track, across all trends. Filter by retailer or budget,
        save the ones you love, and buy straight from the store.
      </p>

      <div className="mt-6">
        <DupeBrowser rows={rows} />
      </div>
    </div>
  );
}
