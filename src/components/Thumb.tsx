import type { CSSProperties } from "react";

/**
 * Gradient placeholder "image". Real photos can be dropped in later by
 * swapping this for an <img>; using gradients now keeps the app fully
 * self-contained with nothing to break or load.
 */
export function Thumb({
  palette,
  label,
  className = "",
  rounded = "rounded-2xl",
}: {
  palette: [string, string];
  label?: string;
  className?: string;
  rounded?: string;
}) {
  const style: CSSProperties = {
    backgroundImage: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)`,
  };
  return (
    <div
      className={`relative flex items-end overflow-hidden ${rounded} ${className}`}
      style={style}
      aria-hidden={label ? undefined : true}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,rgba(255,255,255,0.28),transparent_60%)]" />
      {label ? (
        <span className="relative z-10 m-3 max-w-[90%] font-medium leading-tight text-white/95 drop-shadow-sm">
          {label}
        </span>
      ) : null}
    </div>
  );
}
