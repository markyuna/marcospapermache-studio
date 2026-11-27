// src/components/admin/analytics/EventsCard.tsx
// Custom events (orders, AI generations, clicks…) with their property values.
"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronRight, Filter, Target } from "lucide-react";
import type { EventPropRow, EventRow } from "@/lib/analytics/dashboard";
import { EVENT_CATALOG, eventLabel } from "@/lib/analytics/shared";
import { formatNumber, formatPercent, withParam } from "@/components/admin/analytics/format";

const PROP_LABELS: Record<string, string> = {
  label: "Bouton",
  host: "Site",
  url: "Lien",
  file: "Fichier",
  method: "Méthode",
  reason: "Raison",
  type: "Type",
  profile: "Profil",
  source: "Origine",
  with_image: "Avec image",
};

type Props = {
  events: EventRow[];
  props: EventPropRow[];
  sessions: number;
  query: string;
};

export default function EventsCard({ events, props, sessions, query }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const max = Math.max(1, ...events.map((e) => e.total));

  return (
    <section className="min-w-0 rounded-2xl border border-black/5 bg-paper-surface p-4 shadow-sm md:p-5">
      <h2 className="text-base font-semibold text-neutral-900">Événements & conversions</h2>
      <p className="mb-3 text-xs text-neutral-500">
        Actions réalisées sur le site. <Target className="inline-block h-3 w-3 align-[-1px]" aria-hidden /> = objectif de conversion.
      </p>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300/70 py-10 text-center text-sm text-neutral-400">
          Aucun événement sur cette période
        </div>
      ) : (
        <div className="text-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:gap-x-4 px-2 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
            <span>Événement</span>
            <span className="text-right">Total</span>
            <span className="hidden text-right sm:block">Visites</span>
            <span className="text-right">% visites</span>
          </div>
          <ul className="space-y-0.5">
            {events.map((event) => {
              const details = props.filter((p) => p.name === event.name);
              const isOpen = open === event.name;
              const conversion = (EVENT_CATALOG as Record<string, { conversion: boolean }>)[event.name]?.conversion;
              return (
                <li key={event.name}>
                  <div className="group relative grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-3 rounded-md px-2 py-1.5 hover:bg-black/[0.03]">
                    <span
                      aria-hidden
                      className="absolute inset-y-0.5 left-0 rounded-r-[4px] bg-[#cfe1f8]"
                      style={{ width: `${Math.max(1.5, (event.total / max) * 100)}%` }}
                    />
                    <span className="relative flex min-w-0 items-center gap-1.5">
                      {details.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : event.name)}
                          aria-expanded={isOpen}
                          className="flex min-w-0 items-center gap-1 text-left text-neutral-800"
                        >
                          <ChevronRight className={clsx("h-3.5 w-3.5 shrink-0 text-neutral-500 transition", isOpen && "rotate-90")} />
                          <span className="truncate">{eventLabel(event.name)}</span>
                        </button>
                      ) : (
                        <span className="truncate pl-[18px] text-neutral-800">{eventLabel(event.name)}</span>
                      )}
                      {conversion && <Target className="h-3 w-3 shrink-0 text-neutral-500" aria-label="Objectif" />}
                      <Link
                        href={withParam(query, "event", event.name)}
                        scroll={false}
                        className="opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
                        aria-label={`Filtrer les visites avec : ${eventLabel(event.name)}`}
                        title="Voir uniquement les visites avec cet événement"
                      >
                        <Filter className="h-3 w-3 text-neutral-400" />
                      </Link>
                    </span>
                    <span className="relative text-right font-semibold tabular-nums text-neutral-900">{formatNumber(event.total)}</span>
                    <span className="relative hidden text-right tabular-nums text-neutral-500 sm:block">{formatNumber(event.sessions)}</span>
                    <span className="relative text-right tabular-nums text-neutral-500">
                      {sessions ? formatPercent(event.sessions / sessions, 1) : "—"}
                    </span>
                  </div>

                  {isOpen && (
                    <div className="mb-2 ml-6 mt-1 rounded-xl border border-black/5 bg-[#fbf7f0] p-2.5">
                      <ul className="space-y-1 text-xs">
                        {details.slice(0, 30).map((detail) => (
                          <li key={`${detail.key}-${detail.value}`} className="flex justify-between gap-3">
                            <span className="min-w-0 truncate text-neutral-700" title={detail.value}>
                              <span className="text-neutral-400">{PROP_LABELS[detail.key] ?? detail.key} :</span> {detail.value}
                            </span>
                            <span className="font-semibold tabular-nums text-neutral-900">{formatNumber(detail.total)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
