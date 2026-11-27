// src/components/admin/analytics/Funnels.tsx
// Conversion funnels (visits that reached each step, all previous steps included).
"use client";

import { useState } from "react";
import clsx from "clsx";
import type { FunnelResult } from "@/lib/analytics/dashboard";
import { formatNumber, formatPercent } from "@/components/admin/analytics/format";

export default function Funnels({ funnels }: { funnels: FunnelResult[] }) {
  const [activeId, setActiveId] = useState(funnels[0]?.id);
  const funnel = funnels.find((f) => f.id === activeId) ?? funnels[0];
  if (!funnel) return null;

  const first = funnel.steps[0]?.sessions ?? 0;
  const last = funnel.steps[funnel.steps.length - 1]?.sessions ?? 0;

  return (
    <section className="min-w-0 rounded-2xl border border-black/5 bg-paper-surface p-4 shadow-sm md:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Entonnoirs de conversion</h2>
          <p className="text-xs text-neutral-500">
            Visites ayant atteint chaque étape · conversion globale{" "}
            <strong className="font-semibold text-neutral-800">{first ? formatPercent(last / first, 1) : "—"}</strong>
          </p>
        </div>
        <div role="tablist" aria-label="Entonnoirs" className="flex flex-wrap gap-1 rounded-xl bg-black/[0.04] p-1">
          {funnels.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={f.id === funnel.id}
              onClick={() => setActiveId(f.id)}
              className={clsx(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition",
                f.id === funnel.id ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <ol className="space-y-3">
        {funnel.steps.map((step, index) => {
          const previous = index > 0 ? funnel.steps[index - 1].sessions : step.sessions;
          const ofTotal = first ? step.sessions / first : 0;
          const ofPrevious = previous ? step.sessions / previous : 0;
          return (
            <li key={step.label}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-neutral-800">
                  <span className="mr-2 text-xs tabular-nums text-neutral-400">{index + 1}</span>
                  {step.label}
                </span>
                <span className="shrink-0 tabular-nums">
                  <strong className="font-semibold text-neutral-950">{formatNumber(step.sessions)}</strong>
                  <span className="ml-2 text-xs text-neutral-500">{formatPercent(ofTotal, 1)}</span>
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#e9e1d3]">
                <div
                  className="h-full rounded-r-[4px] bg-[#257de0]"
                  style={{ width: `${Math.max(step.sessions ? 1 : 0, ofTotal * 100)}%` }}
                />
              </div>
              {index > 0 && (
                <p className="mt-1 text-[11px] text-neutral-500">
                  {formatPercent(ofPrevious, 1)} de l’étape précédente · {formatNumber(previous - step.sessions)} abandon
                  {previous - step.sessions > 1 ? "s" : ""}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
