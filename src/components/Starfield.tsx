"use client";

import { useMemo } from "react";

// A purely decorative, deterministic starfield rendered behind the app.
// Positions are seeded so they don't jump on re-render, and the whole thing is
// aria-hidden since it carries no meaning.
export default function Starfield({ count = 60 }: { count?: number }) {
  const stars = useMemo(() => {
    // Simple LCG so the layout is stable without pulling in a dependency.
    let s = 1337;
    const rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
    return Array.from({ length: count }, () => ({
      top: rand() * 100,
      left: rand() * 100,
      size: rand() * 2 + 1,
      delay: rand() * 4,
      duration: rand() * 3 + 3,
      bright: rand() > 0.85,
    }));
  }, [count]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-stardust animate-twinkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: star.bright
              ? "0 0 6px 1px rgba(232,230,255,0.8)"
              : undefined,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}
