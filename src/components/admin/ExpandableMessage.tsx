"use client";

import { useMemo, useState } from "react";

type ExpandableMessageProps = {
  text: string;
  emptyText?: string;
  previewLines?: number;
};

export default function ExpandableMessage({
  text,
  emptyText = "Aucun message fourni.",
  previewLines = 5,
}: ExpandableMessageProps) {
  const [expanded, setExpanded] = useState(false);

  const normalizedText = useMemo(() => text.trim(), [text]);
  const isEmpty = normalizedText.length === 0;
  const shouldCollapse = normalizedText.length > 280 || normalizedText.includes("\n");

  if (isEmpty) {
    return (
      <p className="text-sm leading-7 text-neutral-500">
        {emptyText}
      </p>
    );
  }

  return (
    <div>
      <p
        className={[
          "whitespace-pre-line text-sm leading-7 text-neutral-700 transition-all",
          !expanded && shouldCollapse ? `line-clamp-${previewLines}` : "",
        ].join(" ")}
      >
        {normalizedText}
      </p>

      {shouldCollapse ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-3 inline-flex rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-50"
        >
          {expanded ? "Voir moins" : "Voir plus"}
        </button>
      ) : null}
    </div>
  );
}