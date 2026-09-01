import { Fragment } from "react";

// Minimal inline formatter: `**bold**` becomes <strong>. Keeping post content
// as plain strings avoids shipping a markdown parser for one piece of syntax.
export default function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/gs);

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-slate-900">
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
