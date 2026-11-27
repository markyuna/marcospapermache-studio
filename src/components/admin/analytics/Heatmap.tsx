// src/components/admin/analytics/Heatmap.tsx
// Visits by weekday × hour (Paris time). Sequential single-hue ramp.
"use client";

import { useState } from "react";
import clsx from "clsx";
import type { HeatCell } from "@/lib/analytics/dashboard";
import { formatNumber, formatPercent } from "@/components/admin/analytics/format";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const RAMP = ["#cce3fd", "#9dc8f7", "#6aabf1", "#338ced", "#2370cd", "#1757ac", "#0e3d7e"];
const EMPTY = "#e9e1d3";

export default function Heatmap({ cells }: { cells: HeatCell[] }) {
  const [hover, setHover] = useState<{ dow: number; hour: number } | null>(null);

  const grid = new Map(cells.map((cell) => [`${cell.dow}-${cell.hour}`, cell.sessions]));
  const max = Math.max(0, ...cells.map((cell) => cell.sessions));
  const total = cells.reduce((sum, cell) => sum + cell.sessions, 0);

  const color = (value: number) => {
    if (!value || !max) return EMPTY;
    const index = Math.min(RAMP.length - 1, Math.floor((value / max) * RAMP.length - 1e-9));
    return RAMP[Math.max(0, index)];
  };

  const byDay = DAYS.map((_, d) =>
    Array.from({ length: 24 }, (_, h) => grid.get(`${d + 1}-${h}`) ?? 0).reduce((a, b) => a + b, 0)
  );
  const byHour = Array.from({ length: 24 }, (_, h) =>
    DAYS.reduce((sum, _, d) => sum + (grid.get(`${d + 1}-${h}`) ?? 0), 0)
  );
  const bestDay = byDay.indexOf(Math.max(...byDay));
  const bestHour = byHour.indexOf(Math.max(...byHour));

  const hovered = hover ? grid.get(`${hover.dow}-${hover.hour}`) ?? 0 : null;

  return (
    <section className="min-w-0 rounded-2xl border border-black/5 bg-paper-surface p-4 shadow-sm md:p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Quand vos visiteurs viennent</h2>
          <p className="text-xs text-neutral-500">Visites par jour et par heure (heure de Paris)</p>
        </div>
        {total > 0 && (
          <p className="text-xs text-neutral-600">
            Pic : <strong className="font-semibold text-neutral-900">{DAYS[bestDay]}</strong> · vers{" "}
            <strong className="font-semibold text-neutral-900">{bestHour}h</strong>
          </p>
        )}
      </div>

      <p className="mb-2 h-4 text-xs text-neutral-600" aria-live="polite">
        {hover && hovered !== null
          ? `${DAYS[hover.dow - 1]} ${hover.hour}h–${hover.hour + 1}h : ${formatNumber(hovered)} visite${hovered > 1 ? "s" : ""}${total ? ` (${formatPercent(hovered / total, 1)})` : ""}`
          : "Survolez une case pour le détail."}
      </p>

      <div className="overflow-x-auto pb-1">
        <div className="min-w-[560px]">
          <div className="grid gap-[2px]" style={{ gridTemplateColumns: "72px repeat(24, minmax(0, 1fr))" }}>
            {DAYS.map((day, d) => (
              <div key={day} className="contents">
                <span className="pr-2 text-right text-[11px] leading-5 text-neutral-500">{day.slice(0, 3)}.</span>
                {Array.from({ length: 24 }, (_, h) => {
                  const value = grid.get(`${d + 1}-${h}`) ?? 0;
                  const active = hover?.dow === d + 1 && hover.hour === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      aria-label={`${day} ${h}h : ${value} visites`}
                      onPointerEnter={() => setHover({ dow: d + 1, hour: h })}
                      onPointerLeave={() => setHover(null)}
                      onFocus={() => setHover({ dow: d + 1, hour: h })}
                      onBlur={() => setHover(null)}
                      className={clsx(
                        "h-5 rounded-[3px] outline-none transition",
                        active && "ring-2 ring-neutral-900/70 ring-offset-1 ring-offset-paper-surface"
                      )}
                      style={{ background: color(value) }}
                    />
                  );
                })}
              </div>
            ))}
            <span />
            {Array.from({ length: 24 }, (_, h) => (
              <span key={h} className="pt-1 text-center text-[10px] text-neutral-400">
                {h % 3 === 0 ? `${h}h` : ""}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-neutral-500">
        <span>Moins</span>
        <span className="h-2.5 w-2.5 rounded-[2px]" style={{ background: EMPTY }} />
        {RAMP.map((c) => (
          <span key={c} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: c }} />
        ))}
        <span>Plus</span>
      </div>
    </section>
  );
}
