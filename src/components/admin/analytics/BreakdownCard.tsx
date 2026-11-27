// src/components/admin/analytics/BreakdownCard.tsx
// Ranked list with proportional bars, grouped in tabs. Clicking a row adds it
// as a dashboard filter. Rows arrive pre-formatted from the server.
"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronDown, Filter } from "lucide-react";
import { withParam } from "@/components/admin/analytics/format";

export type BreakdownTabRow = {
  value: string;
  label: string;
  bar: number;
  cells: string[];
  title?: string;
};

export type BreakdownTab = {
  id: string;
  label: string;
  /** Search param set when a row is clicked; null = rows are not filterable. */
  filterKey: string | null;
  columns: string[];
  rows: BreakdownTabRow[];
  note?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  tabs: BreakdownTab[];
  query: string;
  initialCount?: number;
  className?: string;
};

export default function BreakdownCard({ title, subtitle, tabs, query, initialCount = 8, className }: Props) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const [expanded, setExpanded] = useState(false);
  const tab = tabs.find((t) => t.id === activeId) ?? tabs[0];
  if (!tab) return null;

  const max = Math.max(1, ...tab.rows.map((row) => row.bar));
  const rows = expanded ? tab.rows : tab.rows.slice(0, initialCount);
  // Phones show the label and the first two metrics; wider screens show all.
  const auto = (count: number) => Array.from({ length: count }, () => "auto").join(" ");
  const gridStyle = {
    "--cols": `minmax(0,1fr) ${auto(tab.columns.length - 1)}`,
    "--cols-sm": `minmax(0,1fr) ${auto(Math.min(2, tab.columns.length - 1))}`,
  } as CSSProperties;
  const gridClass = "grid grid-cols-[var(--cols-sm)] gap-x-3 sm:grid-cols-[var(--cols)] sm:gap-x-4";
  const narrowHidden = (index: number) => (index >= 2 ? "hidden sm:block" : "");

  return (
    <section className={clsx("flex min-w-0 flex-col rounded-2xl border border-black/5 bg-paper-surface p-4 shadow-sm md:p-5", className)}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
          {subtitle && <p className="text-xs text-neutral-500">{subtitle}</p>}
        </div>
        {tabs.length > 1 && (
          <div role="tablist" aria-label={title} className="flex flex-wrap gap-1 rounded-xl bg-black/[0.04] p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === tab.id}
                onClick={() => {
                  setActiveId(t.id);
                  setExpanded(false);
                }}
                className={clsx(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition",
                  t.id === tab.id ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab.rows.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-neutral-300/70 py-10 text-sm text-neutral-400">
          Aucune donnée sur cette période
        </div>
      ) : (
        <div role="table" aria-label={`${title} — ${tab.label}`} className="text-sm">
          <div
            role="row"
            className={clsx(gridClass, "px-2 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-400")}
            style={gridStyle}
          >
            {tab.columns.map((column, i) => (
              <span key={column} role="columnheader" className={clsx(i > 0 && "text-right", narrowHidden(i - 1))}>
                {column}
              </span>
            ))}
          </div>

          <div className="space-y-0.5">
            {rows.map((row) => {
              const content = (
                <>
                  <span
                    aria-hidden
                    className="absolute inset-y-0.5 left-0 rounded-r-[4px] bg-[#cfe1f8] transition group-hover:bg-[#b9d4f5]"
                    style={{ width: `${Math.max(1.5, (row.bar / max) * 100)}%` }}
                  />
                  <span role="cell" className="relative flex min-w-0 items-center gap-1.5 truncate text-neutral-800" title={row.title ?? row.label}>
                    <span className="truncate">{row.label}</span>
                    {tab.filterKey && (
                      <Filter className="h-3 w-3 shrink-0 text-neutral-400 opacity-0 transition group-hover:opacity-100" aria-hidden />
                    )}
                  </span>
                  {row.cells.map((cell, i) => (
                    <span
                      key={i}
                      role="cell"
                      className={clsx(
                        "relative text-right tabular-nums",
                        i === 0 ? "font-semibold text-neutral-900" : "text-neutral-500",
                        narrowHidden(i)
                      )}
                    >
                      {cell}
                    </span>
                  ))}
                </>
              );

              const shared = clsx(gridClass, "group relative items-center rounded-md px-2 py-1.5");

              return tab.filterKey ? (
                <Link
                  key={row.value}
                  role="row"
                  href={withParam(query, tab.filterKey, row.value)}
                  scroll={false}
                  className={clsx(shared, "hover:bg-black/[0.03]")}
                  style={gridStyle}
                  aria-label={`Filtrer : ${row.label}`}
                >
                  {content}
                </Link>
              ) : (
                <div key={row.value} role="row" className={shared} style={gridStyle}>
                  {content}
                </div>
              );
            })}
          </div>

          {tab.rows.length > initialCount && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 inline-flex items-center gap-1 px-2 text-xs font-medium text-neutral-500 hover:text-neutral-900"
            >
              <ChevronDown className={clsx("h-3.5 w-3.5 transition", expanded && "rotate-180")} />
              {expanded ? "Réduire" : `Afficher tout (${tab.rows.length})`}
            </button>
          )}
        </div>
      )}

      {tab.note && <p className="mt-3 text-[11px] text-neutral-400">{tab.note}</p>}
    </section>
  );
}
