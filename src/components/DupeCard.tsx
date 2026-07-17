import type { Dupe, Piece, Trend } from "@/lib/types";
import { money, savings } from "@/lib/format";
import { SaveButton } from "./SaveButton";

/** One dupe: retailer, price, match %, save + buy. */
export function DupeCard({
  trend,
  piece,
  dupe,
}: {
  trend: Trend;
  piece: Piece;
  dupe: Dupe;
}) {
  const saved = savings(piece.original.price, dupe.price);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold">{dupe.retailer}</span>
          <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-medium text-ink/60">
            {dupe.matchPercent}% match
          </span>
        </div>
        <p className="mt-0.5 truncate text-sm text-ink/70">{dupe.name}</p>
        {dupe.notes ? (
          <p className="mt-1 line-clamp-2 text-xs text-ink/45">{dupe.notes}</p>
        ) : null}
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-lg font-semibold">{money(dupe.price)}</span>
          {saved > 0 ? (
            <span className="text-xs font-medium text-gold">
              save {saved}% vs {money(piece.original.price)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <SaveButton
          size="sm"
          item={{
            dupeId: dupe.id,
            retailer: dupe.retailer,
            name: dupe.name,
            price: dupe.price,
            url: dupe.url,
            trendSlug: trend.slug,
            trendTitle: trend.title,
            pieceName: piece.name,
            palette: piece.palette,
          }}
        />
        <a
          href={dupe.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-rose"
        >
          Buy ↗
        </a>
      </div>
    </div>
  );
}
