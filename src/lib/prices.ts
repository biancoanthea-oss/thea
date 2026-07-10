// ─────────────────────────────────────────────────────────────
// Indicative grocery prices for the main Dublin / Ireland supermarkets.
//
// These are *representative* everyday shelf prices (in EUR) gathered as a
// snapshot — they are NOT a live feed. Prices change constantly and vary by
// store, so treat them as a realistic guide for planning a budget, not a
// guarantee at the till. Update the numbers here whenever you want.
// ─────────────────────────────────────────────────────────────

export const STORES = [
  "Tesco",
  "Dunnes",
  "SuperValu",
  "Lidl",
  "Aldi",
] as const;

export type Store = (typeof STORES)[number];

export interface Product {
  /** Canonical display name, e.g. "Milk (2L)". */
  name: string;
  /** Rough category, used only for grouping in the UI. */
  category: string;
  /** The unit a single "quantity" buys, e.g. "2L bottle", "loaf", "dozen". */
  unit: string;
  /** Extra words a shopper might type that should match this product. */
  aliases: string[];
  /** Price per unit at each store (EUR). */
  prices: Record<Store, number>;
}

// Snapshot date shown in the UI so shoppers know how fresh the numbers are.
export const PRICES_UPDATED = "July 2026";

export const CATALOG: Product[] = [
  // ── Dairy & eggs ──────────────────────────────────────────
  {
    name: "Milk (2L)",
    category: "Dairy & eggs",
    unit: "2L bottle",
    aliases: ["milk", "whole milk", "fresh milk", "2l milk"],
    prices: { Tesco: 2.29, Dunnes: 2.25, SuperValu: 2.35, Lidl: 2.19, Aldi: 2.19 },
  },
  {
    name: "Butter (454g)",
    category: "Dairy & eggs",
    unit: "1lb block",
    aliases: ["butter", "irish butter", "block butter", "kerrygold"],
    prices: { Tesco: 4.15, Dunnes: 3.99, SuperValu: 4.25, Lidl: 3.79, Aldi: 3.75 },
  },
  {
    name: "Cheddar cheese (200g)",
    category: "Dairy & eggs",
    unit: "200g block",
    aliases: ["cheese", "cheddar", "red cheddar", "white cheddar"],
    prices: { Tesco: 2.65, Dunnes: 2.55, SuperValu: 2.79, Lidl: 2.29, Aldi: 2.25 },
  },
  {
    name: "Eggs (dozen)",
    category: "Dairy & eggs",
    unit: "box of 12",
    aliases: ["eggs", "egg", "free range eggs", "large eggs", "dozen eggs"],
    prices: { Tesco: 3.35, Dunnes: 3.25, SuperValu: 3.49, Lidl: 2.99, Aldi: 2.95 },
  },
  {
    name: "Natural yoghurt (500g)",
    category: "Dairy & eggs",
    unit: "500g tub",
    aliases: ["yoghurt", "yogurt", "natural yoghurt", "greek yoghurt"],
    prices: { Tesco: 1.79, Dunnes: 1.69, SuperValu: 1.85, Lidl: 1.45, Aldi: 1.45 },
  },

  // ── Bakery ────────────────────────────────────────────────
  {
    name: "Sliced pan (800g)",
    category: "Bakery",
    unit: "loaf",
    aliases: ["bread", "sliced pan", "white bread", "loaf", "sliced bread", "pan"],
    prices: { Tesco: 1.65, Dunnes: 1.59, SuperValu: 1.75, Lidl: 1.29, Aldi: 1.25 },
  },
  {
    name: "Wholemeal bread (800g)",
    category: "Bakery",
    unit: "loaf",
    aliases: ["wholemeal", "brown bread", "wholemeal bread", "wholegrain bread"],
    prices: { Tesco: 1.79, Dunnes: 1.69, SuperValu: 1.85, Lidl: 1.39, Aldi: 1.35 },
  },
  {
    name: "Bread rolls (6 pack)",
    category: "Bakery",
    unit: "pack of 6",
    aliases: ["rolls", "bread rolls", "baps", "burger buns", "buns"],
    prices: { Tesco: 1.89, Dunnes: 1.75, SuperValu: 1.95, Lidl: 1.49, Aldi: 1.45 },
  },

  // ── Fruit & veg ───────────────────────────────────────────
  {
    name: "Bananas (per kg)",
    category: "Fruit & veg",
    unit: "1 kg",
    aliases: ["bananas", "banana"],
    prices: { Tesco: 1.69, Dunnes: 1.65, SuperValu: 1.79, Lidl: 1.49, Aldi: 1.49 },
  },
  {
    name: "Apples (pack of 6)",
    category: "Fruit & veg",
    unit: "pack of 6",
    aliases: ["apples", "apple", "gala apples", "pink lady"],
    prices: { Tesco: 2.19, Dunnes: 2.09, SuperValu: 2.29, Lidl: 1.79, Aldi: 1.75 },
  },
  {
    name: "Potatoes (2.5kg)",
    category: "Fruit & veg",
    unit: "2.5 kg bag",
    aliases: ["potatoes", "potato", "roosters", "spuds", "rooster potatoes"],
    prices: { Tesco: 3.29, Dunnes: 3.19, SuperValu: 3.39, Lidl: 2.79, Aldi: 2.75 },
  },
  {
    name: "Carrots (1kg)",
    category: "Fruit & veg",
    unit: "1 kg bag",
    aliases: ["carrots", "carrot"],
    prices: { Tesco: 0.79, Dunnes: 0.75, SuperValu: 0.85, Lidl: 0.55, Aldi: 0.55 },
  },
  {
    name: "Onions (1kg)",
    category: "Fruit & veg",
    unit: "1 kg bag",
    aliases: ["onions", "onion", "brown onions"],
    prices: { Tesco: 1.09, Dunnes: 0.99, SuperValu: 1.15, Lidl: 0.79, Aldi: 0.79 },
  },
  {
    name: "Tomatoes (6 pack)",
    category: "Fruit & veg",
    unit: "pack of 6",
    aliases: ["tomatoes", "tomato", "vine tomatoes", "salad tomatoes"],
    prices: { Tesco: 1.49, Dunnes: 1.45, SuperValu: 1.59, Lidl: 1.19, Aldi: 1.15 },
  },
  {
    name: "Lettuce / mixed salad (bag)",
    category: "Fruit & veg",
    unit: "bag",
    aliases: ["lettuce", "salad", "mixed salad", "salad bag", "rocket"],
    prices: { Tesco: 1.29, Dunnes: 1.19, SuperValu: 1.35, Lidl: 0.99, Aldi: 0.99 },
  },

  // ── Meat & fish ───────────────────────────────────────────
  {
    name: "Chicken fillets (per kg)",
    category: "Meat & fish",
    unit: "1 kg",
    aliases: ["chicken", "chicken fillets", "chicken breast", "chicken breasts"],
    prices: { Tesco: 8.49, Dunnes: 8.29, SuperValu: 8.79, Lidl: 7.49, Aldi: 7.39 },
  },
  {
    name: "Beef mince (500g)",
    category: "Meat & fish",
    unit: "500g pack",
    aliases: ["mince", "beef mince", "minced beef", "ground beef"],
    prices: { Tesco: 4.29, Dunnes: 4.19, SuperValu: 4.49, Lidl: 3.79, Aldi: 3.75 },
  },
  {
    name: "Rashers (300g)",
    category: "Meat & fish",
    unit: "300g pack",
    aliases: ["rashers", "bacon", "streaky rashers", "back rashers"],
    prices: { Tesco: 3.19, Dunnes: 2.99, SuperValu: 3.29, Lidl: 2.69, Aldi: 2.65 },
  },
  {
    name: "Sausages (454g)",
    category: "Meat & fish",
    unit: "1lb pack",
    aliases: ["sausages", "sausage", "pork sausages", "bangers"],
    prices: { Tesco: 3.09, Dunnes: 2.95, SuperValu: 3.19, Lidl: 2.55, Aldi: 2.49 },
  },
  {
    name: "Salmon fillets (2 pack)",
    category: "Meat & fish",
    unit: "2 fillets",
    aliases: ["salmon", "salmon fillets", "fish"],
    prices: { Tesco: 5.49, Dunnes: 5.29, SuperValu: 5.69, Lidl: 4.79, Aldi: 4.75 },
  },

  // ── Store cupboard ────────────────────────────────────────
  {
    name: "Pasta (500g)",
    category: "Store cupboard",
    unit: "500g bag",
    aliases: ["pasta", "penne", "spaghetti", "fusilli", "macaroni"],
    prices: { Tesco: 0.95, Dunnes: 0.89, SuperValu: 0.99, Lidl: 0.69, Aldi: 0.65 },
  },
  {
    name: "Rice (1kg)",
    category: "Store cupboard",
    unit: "1 kg bag",
    aliases: ["rice", "basmati", "long grain rice", "basmati rice"],
    prices: { Tesco: 2.29, Dunnes: 2.19, SuperValu: 2.39, Lidl: 1.79, Aldi: 1.75 },
  },
  {
    name: "Chopped tomatoes (tin)",
    category: "Store cupboard",
    unit: "400g tin",
    aliases: ["tinned tomatoes", "chopped tomatoes", "canned tomatoes", "tin tomatoes"],
    prices: { Tesco: 0.65, Dunnes: 0.59, SuperValu: 0.69, Lidl: 0.45, Aldi: 0.45 },
  },
  {
    name: "Baked beans (tin)",
    category: "Store cupboard",
    unit: "400g tin",
    aliases: ["beans", "baked beans", "tinned beans"],
    prices: { Tesco: 0.89, Dunnes: 0.85, SuperValu: 0.95, Lidl: 0.55, Aldi: 0.55 },
  },
  {
    name: "Cornflakes (500g)",
    category: "Store cupboard",
    unit: "500g box",
    aliases: ["cornflakes", "cereal", "corn flakes"],
    prices: { Tesco: 1.99, Dunnes: 1.89, SuperValu: 2.09, Lidl: 1.29, Aldi: 1.25 },
  },
  {
    name: "Porridge oats (1kg)",
    category: "Store cupboard",
    unit: "1 kg bag",
    aliases: ["porridge", "oats", "porridge oats", "flahavans"],
    prices: { Tesco: 2.15, Dunnes: 2.05, SuperValu: 2.25, Lidl: 1.59, Aldi: 1.55 },
  },
  {
    name: "Teabags (80 pack)",
    category: "Store cupboard",
    unit: "box of 80",
    aliases: ["tea", "teabags", "tea bags", "barrys tea", "lyons"],
    prices: { Tesco: 3.49, Dunnes: 3.29, SuperValu: 3.69, Lidl: 2.49, Aldi: 2.45 },
  },
  {
    name: "Coffee (200g)",
    category: "Store cupboard",
    unit: "200g jar",
    aliases: ["coffee", "instant coffee", "nescafe"],
    prices: { Tesco: 4.99, Dunnes: 4.79, SuperValu: 5.19, Lidl: 3.99, Aldi: 3.89 },
  },
  {
    name: "Sugar (1kg)",
    category: "Store cupboard",
    unit: "1 kg bag",
    aliases: ["sugar", "caster sugar", "white sugar"],
    prices: { Tesco: 1.29, Dunnes: 1.25, SuperValu: 1.35, Lidl: 0.99, Aldi: 0.99 },
  },
  {
    name: "Plain flour (1kg)",
    category: "Store cupboard",
    unit: "1 kg bag",
    aliases: ["flour", "plain flour", "self raising flour"],
    prices: { Tesco: 0.99, Dunnes: 0.95, SuperValu: 1.05, Lidl: 0.69, Aldi: 0.65 },
  },
  {
    name: "Vegetable oil (1L)",
    category: "Store cupboard",
    unit: "1L bottle",
    aliases: ["oil", "vegetable oil", "sunflower oil", "cooking oil"],
    prices: { Tesco: 2.49, Dunnes: 2.39, SuperValu: 2.59, Lidl: 1.99, Aldi: 1.95 },
  },

  // ── Household ─────────────────────────────────────────────
  {
    name: "Toilet roll (9 pack)",
    category: "Household",
    unit: "pack of 9",
    aliases: ["toilet roll", "toilet paper", "loo roll", "tissue"],
    prices: { Tesco: 4.99, Dunnes: 4.79, SuperValu: 5.29, Lidl: 3.99, Aldi: 3.89 },
  },
  {
    name: "Kitchen roll (2 pack)",
    category: "Household",
    unit: "pack of 2",
    aliases: ["kitchen roll", "paper towel", "kitchen paper"],
    prices: { Tesco: 2.99, Dunnes: 2.79, SuperValu: 3.19, Lidl: 2.19, Aldi: 2.15 },
  },
  {
    name: "Washing-up liquid (450ml)",
    category: "Household",
    unit: "bottle",
    aliases: ["washing up liquid", "fairy", "dish soap", "dishwashing liquid"],
    prices: { Tesco: 1.99, Dunnes: 1.89, SuperValu: 2.15, Lidl: 1.19, Aldi: 1.15 },
  },
  {
    name: "Dishwasher tablets (30 pack)",
    category: "Household",
    unit: "pack of 30",
    aliases: ["dishwasher tablets", "dishwasher tabs", "finish tablets"],
    prices: { Tesco: 6.99, Dunnes: 6.79, SuperValu: 7.29, Lidl: 4.99, Aldi: 4.89 },
  },
  {
    name: "Laundry detergent (25 wash)",
    category: "Household",
    unit: "25 washes",
    aliases: ["detergent", "laundry", "washing powder", "laundry detergent", "ariel"],
    prices: { Tesco: 6.49, Dunnes: 6.29, SuperValu: 6.79, Lidl: 4.49, Aldi: 4.39 },
  },
];
