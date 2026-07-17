import { CURRENCY_SYMBOL } from "./types";

/** "$1,450" — no cents for whole dollars, two decimals otherwise. */
export function money(amount: number): string {
  const hasCents = !Number.isInteger(amount);
  return (
    CURRENCY_SYMBOL +
    amount.toLocaleString("en-US", {
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: 2,
    })
  );
}

/** How much a dupe saves vs. the original, as a rounded percent. */
export function savings(original: number, dupe: number): number {
  return Math.max(0, Math.round((1 - dupe / original) * 100));
}
