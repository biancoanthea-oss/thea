import type { Trend } from "./types";

// ─────────────────────────────────────────────────────────────
// Curated seed data.
//
// Prices are indicative (USD) and buy links point at each retailer's
// search page for the item, so they keep working even as individual
// products sell out. Swap in exact product URLs / a live feed later.
// ─────────────────────────────────────────────────────────────

function search(base: string, q: string): string {
  return `${base}${encodeURIComponent(q)}`;
}

const SEARCH = {
  asos: (q: string) => search("https://www.asos.com/search/?q=", q),
  amazon: (q: string) => search("https://www.amazon.com/s?k=", q),
  zara: (q: string) => search("https://www.zara.com/us/en/search?searchTerm=", q),
  hm: (q: string) => search("https://www2.hm.com/en_us/search-results.html?q=", q),
  shein: (q: string) => search("https://us.shein.com/pdsearch/", q),
  mango: (q: string) => search("https://shop.mango.com/us/search?kw=", q),
  revolve: (q: string) => search("https://www.revolve.com/r/Search.jsp?search=", q),
  target: (q: string) => search("https://www.target.com/s?searchTerm=", q),
  nordstrom: (q: string) => search("https://www.nordstrom.com/sr?keyword=", q),
  abercrombie: (q: string) =>
    search("https://www.abercrombie.com/shop/us/search?q=", q),
};

export const TRENDS: Trend[] = [
  {
    slug: "quiet-luxury",
    title: "Quiet Luxury",
    blurb: "Stealth wealth — no logos, all cashmere, expensive-looking neutrals.",
    description:
      "The anti-logo movement made famous by Succession and The Row. Think buttery leather totes, oversized crewnecks, tailored trousers and a palette of camel, cream, grey and black. The whole point is looking costly without announcing it — which makes it the perfect trend to dupe.",
    category: "Aesthetic",
    heat: 94,
    direction: "steady",
    tags: ["minimal", "neutrals", "cashmere", "old money"],
    palette: ["#b8a58c", "#6f6250"],
    pieces: [
      {
        id: "ql-tote",
        name: "Structured leather tote",
        category: "Bags",
        palette: ["#c8b393", "#8a7355"],
        original: { brand: "The Row", name: "Margaux 15 bag", price: 5990 },
        dupes: [
          {
            id: "ql-tote-1",
            retailer: "Mango",
            name: "Leather shopper bag",
            price: 129,
            url: SEARCH.mango("leather tote bag"),
            matchPercent: 88,
            notes: "Closest silhouette; real leather at the price.",
          },
          {
            id: "ql-tote-2",
            retailer: "Amazon",
            name: "Minimalist top-handle tote",
            price: 46,
            url: SEARCH.amazon("minimalist leather tote top handle bag"),
            matchPercent: 79,
          },
          {
            id: "ql-tote-3",
            retailer: "Nordstrom",
            name: "Open Edit structured tote",
            price: 69,
            url: SEARCH.nordstrom("structured leather tote"),
            matchPercent: 82,
          },
        ],
      },
      {
        id: "ql-crew",
        name: "Oversized cashmere crewneck",
        category: "Knitwear",
        palette: ["#e7ddca", "#b6a98c"],
        original: { brand: "Loro Piana", name: "Cashmere crewneck", price: 1450 },
        dupes: [
          {
            id: "ql-crew-1",
            retailer: "Quince",
            name: "Mongolian cashmere crew",
            price: 60,
            url: SEARCH.amazon("mongolian cashmere crewneck sweater"),
            matchPercent: 90,
            notes: "100% grade-A cashmere, the cult budget pick.",
          },
          {
            id: "ql-crew-2",
            retailer: "Uniqlo",
            name: "Premium lambswool crew",
            price: 50,
            url: SEARCH.amazon("uniqlo lambswool crewneck sweater"),
            matchPercent: 78,
          },
        ],
      },
      {
        id: "ql-trouser",
        name: "Pleated tailored trouser",
        category: "Bottoms",
        palette: ["#8f8674", "#5f5847"],
        original: { brand: "Toteme", name: "Tailored wool trousers", price: 590 },
        dupes: [
          {
            id: "ql-trouser-1",
            retailer: "Zara",
            name: "High-waist pleated pants",
            price: 49,
            url: SEARCH.zara("pleated tailored trousers"),
            matchPercent: 85,
          },
          {
            id: "ql-trouser-2",
            retailer: "Mango",
            name: "Wide-leg wool-blend trouser",
            price: 79,
            url: SEARCH.mango("wide leg wool trousers"),
            matchPercent: 83,
          },
        ],
      },
    ],
  },
  {
    slug: "mob-wife",
    title: "Mob Wife",
    blurb: "Big fur, bigger gold, leopard print and a cloud of confidence.",
    description:
      "The maximalist backlash to quiet luxury. Faux-fur coats, animal print, stacked gold jewellery, red lips and oversized sunglasses — Carmela Soprano energy. Loud, glamorous and unapologetic.",
    category: "Aesthetic",
    heat: 81,
    direction: "up",
    tags: ["faux fur", "leopard", "gold", "glam"],
    palette: ["#7a4a2b", "#2b1a12"],
    pieces: [
      {
        id: "mw-fur",
        name: "Faux-fur coat",
        category: "Outerwear",
        palette: ["#6b4a30", "#3a271a"],
        original: { brand: "Nour Hammour", name: "Shearling coat", price: 1800 },
        dupes: [
          {
            id: "mw-fur-1",
            retailer: "ASOS",
            name: "Longline faux-fur coat",
            price: 89,
            url: SEARCH.asos("longline faux fur coat"),
            matchPercent: 86,
          },
          {
            id: "mw-fur-2",
            retailer: "Amazon",
            name: "Oversized shaggy faux-fur coat",
            price: 62,
            url: SEARCH.amazon("oversized faux fur coat women"),
            matchPercent: 80,
          },
        ],
      },
      {
        id: "mw-leopard",
        name: "Leopard-print midi skirt",
        category: "Bottoms",
        palette: ["#a9812f", "#5a3d18"],
        original: { brand: "Dolce & Gabbana", name: "Leopard silk skirt", price: 1250 },
        dupes: [
          {
            id: "mw-leopard-1",
            retailer: "Zara",
            name: "Animal-print satin skirt",
            price: 46,
            url: SEARCH.zara("leopard print satin midi skirt"),
            matchPercent: 84,
          },
          {
            id: "mw-leopard-2",
            retailer: "SHEIN",
            name: "Leopard slip midi skirt",
            price: 15,
            url: SEARCH.shein("leopard satin midi skirt"),
            matchPercent: 76,
          },
        ],
      },
      {
        id: "mw-gold",
        name: "Chunky gold hoops",
        category: "Jewellery",
        palette: ["#d4af37", "#8a6d1e"],
        original: { brand: "Bottega Veneta", name: "Gold hoop earrings", price: 690 },
        dupes: [
          {
            id: "mw-gold-1",
            retailer: "Amazon",
            name: "18k-gold-plated chunky hoops",
            price: 18,
            url: SEARCH.amazon("chunky gold hoop earrings 18k plated"),
            matchPercent: 88,
          },
        ],
      },
    ],
  },
  {
    slug: "boho-revival",
    title: "Boho Revival",
    blurb: "Chloé-led comeback — suede, fringe, tan leather and folk embroidery.",
    description:
      "Chemena Kamali's Chloé debut sent boho straight back to the top. Suede jackets, fringed bags, wooden-heel sandals, floaty blouses and lots of tan and cream. Festival-core, grown up.",
    category: "Runway",
    heat: 88,
    direction: "up",
    tags: ["suede", "fringe", "70s", "chloé"],
    palette: ["#c79a5b", "#8a5a2b"],
    pieces: [
      {
        id: "bh-suede",
        name: "Suede fringe jacket",
        category: "Outerwear",
        palette: ["#c08a4a", "#7a4f22"],
        original: { brand: "Chloé", name: "Suede fringe jacket", price: 4500 },
        dupes: [
          {
            id: "bh-suede-1",
            retailer: "Mango",
            name: "Suede-effect fringed jacket",
            price: 120,
            url: SEARCH.mango("suede fringe jacket"),
            matchPercent: 83,
          },
          {
            id: "bh-suede-2",
            retailer: "ASOS",
            name: "Faux-suede western jacket",
            price: 75,
            url: SEARCH.asos("faux suede fringe jacket"),
            matchPercent: 77,
          },
        ],
      },
      {
        id: "bh-bag",
        name: "Fringed suede shoulder bag",
        category: "Bags",
        palette: ["#b9843f", "#6d451d"],
        original: { brand: "Chloé", name: "Paddington fringe bag", price: 2290 },
        dupes: [
          {
            id: "bh-bag-1",
            retailer: "Amazon",
            name: "Boho fringe hobo bag",
            price: 39,
            url: SEARCH.amazon("suede fringe shoulder hobo bag"),
            matchPercent: 81,
          },
        ],
      },
      {
        id: "bh-sandal",
        name: "Wooden-heel platform sandal",
        category: "Shoes",
        palette: ["#c9a05e", "#8a6531"],
        original: { brand: "Chloé", name: "Wooden clog sandal", price: 890 },
        dupes: [
          {
            id: "bh-sandal-1",
            retailer: "Steve Madden",
            name: "Wooden platform sandal",
            price: 89,
            url: SEARCH.nordstrom("wooden platform heel sandal"),
            matchPercent: 84,
          },
          {
            id: "bh-sandal-2",
            retailer: "SHEIN",
            name: "Clog platform sandal",
            price: 22,
            url: SEARCH.shein("wooden clog platform sandal"),
            matchPercent: 72,
          },
        ],
      },
    ],
  },
  {
    slug: "coquette",
    title: "Coquette / Balletcore",
    blurb: "Ribbons, bows, ballet flats and everything soft and girlish.",
    description:
      "The bow took over the internet. Coquette blends balletcore softness with hyper-feminine detail: satin ribbons, lace trims, mary-janes, ballet flats, pointelle knits and endless pink and cream.",
    category: "Aesthetic",
    heat: 76,
    direction: "steady",
    tags: ["bows", "ballet flats", "lace", "pink"],
    palette: ["#e9b9c4", "#c07f8f"],
    pieces: [
      {
        id: "cq-flat",
        name: "Mesh ballet flat",
        category: "Shoes",
        palette: ["#eec3cd", "#c98a99"],
        original: { brand: "Alaïa", name: "Mesh ballerina flat", price: 990 },
        dupes: [
          {
            id: "cq-flat-1",
            retailer: "Amazon",
            name: "Mesh pointed ballet flat",
            price: 40,
            url: SEARCH.amazon("mesh ballet flats pointed toe"),
            matchPercent: 87,
            notes: "The viral Alaïa dupe — dozens of colors.",
          },
          {
            id: "cq-flat-2",
            retailer: "SHEIN",
            name: "Sheer mesh flats",
            price: 17,
            url: SEARCH.shein("mesh ballet flats"),
            matchPercent: 74,
          },
        ],
      },
      {
        id: "cq-bow",
        name: "Satin hair bow",
        category: "Accessories",
        palette: ["#f0c8d3", "#d494a5"],
        original: { brand: "Sandy Liang", name: "Silk bow clip", price: 95 },
        dupes: [
          {
            id: "cq-bow-1",
            retailer: "Amazon",
            name: "Oversized satin bow clips (set)",
            price: 12,
            url: SEARCH.amazon("oversized satin hair bow clip"),
            matchPercent: 90,
          },
        ],
      },
      {
        id: "cq-cardi",
        name: "Pointelle bow cardigan",
        category: "Knitwear",
        palette: ["#f2d6dd", "#d29aa8"],
        original: { brand: "Sandy Liang", name: "Bow-front cardigan", price: 425 },
        dupes: [
          {
            id: "cq-cardi-1",
            retailer: "ASOS",
            name: "Pointelle bow cardigan",
            price: 48,
            url: SEARCH.asos("pointelle bow cardigan"),
            matchPercent: 82,
          },
          {
            id: "cq-cardi-2",
            retailer: "H&M",
            name: "Rib-knit bow cardigan",
            price: 34,
            url: SEARCH.hm("bow cardigan"),
            matchPercent: 79,
          },
        ],
      },
    ],
  },
  {
    slug: "cherry-red",
    title: "Cherry Red",
    blurb: "The color of the season — head-to-toe glossy, deep red.",
    description:
      "After a decade of neutrals, one saturated color is everywhere: a deep, glossy cherry red. It shows up on leather jackets, ballet flats, bags and tights, and reads instantly expensive against black or cream.",
    category: "Color",
    heat: 72,
    direction: "up",
    tags: ["statement color", "red", "leather"],
    palette: ["#a01522", "#5c0a13"],
    pieces: [
      {
        id: "cr-jacket",
        name: "Cherry leather jacket",
        category: "Outerwear",
        palette: ["#b01a28", "#66101a"],
        original: { brand: "Nour Hammour", name: "Red leather jacket", price: 1650 },
        dupes: [
          {
            id: "cr-jacket-1",
            retailer: "Mango",
            name: "Leather-effect biker jacket",
            price: 99,
            url: SEARCH.mango("red leather biker jacket"),
            matchPercent: 85,
          },
          {
            id: "cr-jacket-2",
            retailer: "ASOS",
            name: "Red faux-leather jacket",
            price: 68,
            url: SEARCH.asos("red faux leather jacket"),
            matchPercent: 78,
          },
        ],
      },
      {
        id: "cr-bag",
        name: "Cherry shoulder bag",
        category: "Bags",
        palette: ["#9c1420", "#590b12"],
        original: { brand: "Polène", name: "Numéro Sept in red", price: 480 },
        dupes: [
          {
            id: "cr-bag-1",
            retailer: "Amazon",
            name: "Red crescent shoulder bag",
            price: 34,
            url: SEARCH.amazon("red crescent shoulder bag"),
            matchPercent: 83,
          },
        ],
      },
    ],
  },
  {
    slug: "tenniscore",
    title: "Tenniscore",
    blurb: "Pleated skirts, polos and preppy whites — sporty and clean.",
    description:
      "Fuelled by Zendaya's Challengers press run, sporty-prep is huge: pleated tennis skirts, collared polos, cable knits over shoulders, low sneakers and crisp white-on-white. Country-club coded, minus the country club.",
    category: "Sport",
    heat: 68,
    direction: "up",
    tags: ["preppy", "pleats", "polo", "white"],
    palette: ["#cfe0d2", "#7fa088"],
    pieces: [
      {
        id: "tc-skirt",
        name: "Pleated tennis skirt",
        category: "Bottoms",
        palette: ["#e4ede6", "#a8c1b0"],
        original: { brand: "Miu Miu", name: "Pleated mini skirt", price: 1350 },
        dupes: [
          {
            id: "tc-skirt-1",
            retailer: "Amazon",
            name: "Pleated tennis skort",
            price: 28,
            url: SEARCH.amazon("pleated tennis skirt skort"),
            matchPercent: 84,
          },
          {
            id: "tc-skirt-2",
            retailer: "Abercrombie",
            name: "Pleated mini skirt",
            price: 60,
            url: SEARCH.abercrombie("pleated mini skirt"),
            matchPercent: 80,
          },
        ],
      },
      {
        id: "tc-polo",
        name: "Knit collared polo",
        category: "Tops",
        palette: ["#dfe9e0", "#9fb8a8"],
        original: { brand: "Miu Miu", name: "Cable-knit polo", price: 980 },
        dupes: [
          {
            id: "tc-polo-1",
            retailer: "H&M",
            name: "Knit polo shirt",
            price: 30,
            url: SEARCH.hm("knit polo shirt"),
            matchPercent: 81,
          },
        ],
      },
    ],
  },
  {
    slug: "western",
    title: "Western Revival",
    blurb: "Cowboy boots, denim-on-denim and a little Beyoncé Cowboy Carter.",
    description:
      "Cowboy Carter put western back on the map. Tan and white cowboy boots, yoke-detail shirts, fringe, big belt buckles and double denim — worn with modern, city tailoring rather than full costume.",
    category: "Aesthetic",
    heat: 65,
    direction: "steady",
    tags: ["cowboy boots", "denim", "fringe", "western"],
    palette: ["#c99a5c", "#7c5a2e"],
    pieces: [
      {
        id: "we-boot",
        name: "Pointed cowboy boot",
        category: "Shoes",
        palette: ["#d0a566", "#8a6531"],
        original: { brand: "Ganni", name: "Embroidered western boot", price: 545 },
        dupes: [
          {
            id: "we-boot-1",
            retailer: "ASOS",
            name: "Pointed western ankle boot",
            price: 72,
            url: SEARCH.asos("western cowboy ankle boot"),
            matchPercent: 84,
          },
          {
            id: "we-boot-2",
            retailer: "Amazon",
            name: "Embroidered cowgirl boot",
            price: 55,
            url: SEARCH.amazon("embroidered cowboy boots women"),
            matchPercent: 78,
          },
        ],
      },
      {
        id: "we-shirt",
        name: "Western yoke denim shirt",
        category: "Tops",
        palette: ["#8fa7c0", "#4f6885"],
        original: { brand: "Chloé", name: "Western denim shirt", price: 750 },
        dupes: [
          {
            id: "we-shirt-1",
            retailer: "Zara",
            name: "Yoke-detail denim shirt",
            price: 46,
            url: SEARCH.zara("western denim shirt"),
            matchPercent: 82,
          },
        ],
      },
    ],
  },
  {
    slug: "cargo-utility",
    title: "Utility & Cargo",
    blurb: "Parachute pants, cargo maxis and lots of practical pockets.",
    description:
      "Streetwear's utility streak keeps growing: parachute trousers, low-slung cargos, cargo maxi skirts and boxy field jackets in khaki, sage and washed black. Comfortable, a little Y2K, endlessly wearable.",
    category: "Streetwear",
    heat: 61,
    direction: "steady",
    tags: ["cargo", "utility", "parachute", "khaki"],
    palette: ["#8a8a6b", "#4f5038"],
    pieces: [
      {
        id: "cu-cargo",
        name: "Parachute cargo pants",
        category: "Bottoms",
        palette: ["#9a9a78", "#5c5d40"],
        original: { brand: "Reebok x Bottega", name: "Parachute trouser", price: 620 },
        dupes: [
          {
            id: "cu-cargo-1",
            retailer: "SHEIN",
            name: "Toggle-hem parachute pants",
            price: 20,
            url: SEARCH.shein("parachute cargo pants"),
            matchPercent: 85,
          },
          {
            id: "cu-cargo-2",
            retailer: "ASOS",
            name: "Nylon parachute cargo",
            price: 52,
            url: SEARCH.asos("parachute cargo pants"),
            matchPercent: 82,
          },
        ],
      },
      {
        id: "cu-skirt",
        name: "Cargo maxi skirt",
        category: "Bottoms",
        palette: ["#8f8f6d", "#54553a"],
        original: { brand: "Coperni", name: "Cargo maxi skirt", price: 590 },
        dupes: [
          {
            id: "cu-skirt-1",
            retailer: "Amazon",
            name: "Low-rise cargo maxi skirt",
            price: 33,
            url: SEARCH.amazon("cargo maxi skirt low rise"),
            matchPercent: 80,
          },
        ],
      },
    ],
  },
];

// ── Derived helpers ───────────────────────────────────────────

export function getTrend(slug: string): Trend | undefined {
  return TRENDS.find((t) => t.slug === slug);
}

export const CATEGORIES: string[] = Array.from(
  new Set(TRENDS.map((t) => t.category)),
).sort();

/** Every dupe, flattened, with a pointer back to its trend + piece. */
export function allDupes() {
  return TRENDS.flatMap((trend) =>
    trend.pieces.flatMap((piece) =>
      piece.dupes.map((dupe) => ({ trend, piece, dupe })),
    ),
  );
}

/** The single best-value dupe (highest match) across a trend. */
export function trendStats(trend: Trend) {
  const dupes = trend.pieces.flatMap((p) => p.dupes);
  const cheapest = Math.min(...dupes.map((d) => d.price));
  const originalTotal = trend.pieces.reduce((s, p) => s + p.original.price, 0);
  const dupeTotal = trend.pieces.reduce(
    (s, p) => s + Math.min(...p.dupes.map((d) => d.price)),
    0,
  );
  return {
    pieceCount: trend.pieces.length,
    dupeCount: dupes.length,
    cheapest,
    originalTotal,
    dupeTotal,
    savingsPercent: Math.round((1 - dupeTotal / originalTotal) * 100),
  };
}
