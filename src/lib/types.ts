// Shared types for the recipe → shopping list flow.
// Used by both the API route (server) and the UI (client).

// Grocery aisles we group the shopping list by. Keep this list stable —
// the API route feeds it to the model as an enum, and the UI orders
// sections in this order.
export const CATEGORIES = [
  "Produce",
  "Meat & Seafood",
  "Dairy & Eggs",
  "Bakery",
  "Pantry & Dry Goods",
  "Canned & Jarred",
  "Frozen",
  "Herbs & Spices",
  "Condiments & Sauces",
  "Beverages",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Ingredient {
  /** Shopping-list name of the item, e.g. "Chicken breast". */
  name: string;
  /** Amount to buy, e.g. "500 g", "2", "1 can", or "to taste". */
  quantity: string;
  /** Grocery aisle this belongs to. */
  category: Category;
  /** Optional prep/usage note, e.g. "diced" or "for the sauce". May be "". */
  note: string;
}

export interface ExtractionResult {
  /** Recipe title (best guess), e.g. "Creamy Tuscan Chicken". */
  title: string;
  /** Servings/yield if shown, else "". */
  servings: string;
  ingredients: Ingredient[];
  /** Any caveats worth surfacing, e.g. "Quantities estimated from the video". */
  notes: string[];
}

// A list the user chose to keep, persisted in the browser's localStorage.
export interface SavedList extends ExtractionResult {
  id: string;
  savedAt: number;
  /** Which ingredients are ticked off, keyed by their index in `ingredients`. */
  checked: boolean[];
}
