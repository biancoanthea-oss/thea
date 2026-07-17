"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { WishlistItem } from "@/lib/types";

const STORAGE_KEY = "trendr.wishlist.v1";

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  has: (dupeId: string) => boolean;
  toggle: (item: WishlistItem) => void;
  remove: (dupeId: string) => void;
  clear: () => void;
  /** True once we've read localStorage, so the UI can avoid a flash. */
  ready: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [ready, setReady] = useState(false);

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as WishlistItem[]);
    } catch {
      // Corrupt/unavailable storage — start empty.
    }
    setReady(true);
  }, []);

  // Persist on change (but not before the initial load).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota / private-mode errors.
    }
  }, [items, ready]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setItems(JSON.parse(e.newValue) as WishlistItem[]);
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const has = useCallback(
    (dupeId: string) => items.some((i) => i.dupeId === dupeId),
    [items],
  );

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) =>
      prev.some((i) => i.dupeId === item.dupeId)
        ? prev.filter((i) => i.dupeId !== item.dupeId)
        : [{ ...item, savedAt: Date.now() }, ...prev],
    );
  }, []);

  const remove = useCallback((dupeId: string) => {
    setItems((prev) => prev.filter((i) => i.dupeId !== dupeId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({ items, count: items.length, has, toggle, remove, clear, ready }),
    [items, has, toggle, remove, clear, ready],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
