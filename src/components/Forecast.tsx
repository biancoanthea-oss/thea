"use client";

import type { Forecast } from "@/lib/forecast";
import { ELEMENT_META, type Sign } from "@/lib/zodiac";

export default function ForecastCard({
  sign,
  forecast,
  dateLabel,
}: {
  sign: Sign;
  forecast: Forecast;
  dateLabel: string;
}) {
  const element = ELEMENT_META[sign.element];

  return (
    <section className="glass animate-fadeIn rounded-3xl p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-stardust-dim">
            {dateLabel}
          </p>
          <h2 className="mt-1 font-display text-3xl font-semibold text-stardust">
            Focus Forecast
          </h2>
        </div>
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-3xl"
          style={{
            color: element.color,
            boxShadow: `0 0 24px ${element.glow}`,
            border: `1px solid ${element.color}55`,
          }}
          title={`${sign.name} · ${sign.element}`}
        >
          {sign.symbol}
        </div>
      </div>

      <p className="mt-2 text-sm text-stardust-dim">
        <span className="text-stardust">{sign.name}</span> · {sign.element} ·
        ruled by {sign.ruler}
      </p>

      <div
        className="mt-5 rounded-2xl border p-5"
        style={{
          borderColor: `${element.color}30`,
          background: `linear-gradient(135deg, ${element.glow}, transparent)`,
        }}
      >
        <p className="text-xs uppercase tracking-widest text-stardust-dim">
          Today&apos;s theme
        </p>
        <p className="mt-1 font-display text-2xl font-medium text-stardust">
          {forecast.theme}
        </p>
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <Detail label="Your intention" value={forecast.intention} />
        <Detail label="Cosmic focus window" value={forecast.window} />
        <Detail label="Pre-focus ritual" value={forecast.ritual} />
        <Detail
          label="Suggested session"
          value={`${forecast.suggestedMinutes} minutes — ${sign.focusStyle.split(" — ")[0]}`}
        />
      </dl>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-aura/10 bg-night/40 p-4">
      <dt className="text-xs uppercase tracking-widest text-stardust-dim">
        {label}
      </dt>
      <dd className="mt-1 text-stardust">{value}</dd>
    </div>
  );
}
