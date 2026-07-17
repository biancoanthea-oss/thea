"use client";

import { useWishlist } from "./WishlistProvider";
import type { WishlistItem } from "@/lib/types";

/** Heart toggle that saves/removes a dupe from the wishlist. */
export function SaveButton({
  item,
  size = "md",
}: {
  item: Omit<WishlistItem, "savedAt">;
  size?: "sm" | "md";
}) {
  const { has, toggle } = useWishlist();
  const saved = has(item.dupeId);
  const dims = size === "sm" ? "h-8 w-8 text-[15px]" : "h-10 w-10 text-lg";

  return (
    <button
      type="button"
      onClick={() => toggle({ ...item, savedAt: Date.now() })}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      title={saved ? "Saved — tap to remove" : "Save to wishlist"}
      className={`inline-flex shrink-0 items-center justify-center rounded-full border transition ${dims} ${
        saved
          ? "border-rose/40 bg-rose/10 text-rose"
          : "border-line bg-white text-ink/40 hover:border-rose/40 hover:text-rose"
      }`}
    >
      <span aria-hidden>{saved ? "♥" : "♡"}</span>
    </button>
  );
}
