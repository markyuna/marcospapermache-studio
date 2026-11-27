// src/components/admin/analytics/FilterBar.tsx
// Period presets, custom range, active filters and page options — all plain
// links / a GET form, so the dashboard state lives in the URL (shareable,
// back-button friendly).
import Link from "next/link";
import clsx from "clsx";
import { Calendar, Download, Languages, X } from "lucide-react";
import {
  FILTER_LABELS,
  RANGE_PRESETS,
  type DateRange,
  type FilterKey,
  type Filters,
} from "@/lib/analytics/dashboard";
import { eventLabel } from "@/lib/analytics/shared";
import { DASHBOARD_PATH, dimensionLabel } from "@/components/admin/analytics/format";

type Props = {
  range: DateRange;
  filters: Filters;
  mergeLocales: boolean;
  query: string;
};

function href(query: string, changes: Record<string, string | null>) {
  const params = new URLSearchParams(query);
  for (const [key, value] of Object.entries(changes)) {
    if (value === null) params.delete(key);
    else params.set(key, value);
  }
  const text = params.toString();
  return text ? `${DASHBOARD_PATH}?${text}` : DASHBOARD_PATH;
}

export default function FilterBar({ range, filters, mergeLocales, query }: Props) {
  const activeFilters = Object.entries(filters) as [FilterKey, string][];
  const clearAll = Object.fromEntries(activeFilters.map(([key]) => [key, null]));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <nav aria-label="Période" className="flex flex-wrap gap-1 rounded-xl border border-black/5 bg-paper-surface p-1 shadow-sm">
          {(Object.entries(RANGE_PRESETS) as [keyof typeof RANGE_PRESETS, string][]).map(([key, label]) => (
            <Link
              key={key}
              href={href(query, { range: key === "30d" ? null : key, from: null, to: null })}
              aria-current={range.key === key ? "true" : undefined}
              className={clsx(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                range.key === key ? "bg-neutral-900 text-white!" : "text-neutral-600! hover:bg-black/5 hover:text-neutral-900!"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <details className="group relative">
          <summary
            className={clsx(
              "flex cursor-pointer list-none items-center gap-1.5 rounded-xl border border-black/5 bg-paper-surface px-3 py-2 text-xs font-medium shadow-sm transition hover:text-neutral-900",
              range.key === "custom" ? "text-neutral-900 ring-1 ring-neutral-900" : "text-neutral-600"
            )}
          >
            <Calendar className="h-3.5 w-3.5" />
            {range.key === "custom" ? range.label : "Personnalisé"}
          </summary>
          <form
            action={DASHBOARD_PATH}
            method="get"
            className="absolute left-0 z-30 mt-2 w-72 rounded-2xl border border-black/10 bg-white p-4 shadow-xl"
          >
            {[...new URLSearchParams(query).entries()]
              .filter(([key]) => !["range", "from", "to"].includes(key))
              .map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
              ))}
            <input type="hidden" name="range" value="custom" />
            <label className="block text-xs font-medium text-neutral-600">
              Du
              <input
                type="date"
                name="from"
                defaultValue={range.fromDay}
                required
                className="mt-1 w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900"
              />
            </label>
            <label className="mt-3 block text-xs font-medium text-neutral-600">
              Au
              <input
                type="date"
                name="to"
                defaultValue={range.toDay}
                required
                className="mt-1 w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900"
              />
            </label>
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              Appliquer
            </button>
          </form>
        </details>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Link
            href={href(query, { merge: mergeLocales ? null : "1" })}
            aria-pressed={mergeLocales}
            title="Regrouper /fr/x, /en/x et /es/x comme une seule page"
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-xl border border-black/5 bg-paper-surface px-3 py-2 text-xs font-medium shadow-sm transition",
              mergeLocales ? "text-neutral-900! ring-1 ring-neutral-900" : "text-neutral-600! hover:text-neutral-900!"
            )}
          >
            <Languages className="h-3.5 w-3.5" />
            {mergeLocales ? "Langues regroupées" : "Regrouper les langues"}
          </Link>
          <a
            href={`/api/admin/analytics/export${query ? `?${query}` : ""}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-black/5 bg-paper-surface px-3 py-2 text-xs font-medium text-neutral-600! shadow-sm transition hover:text-neutral-900!"
          >
            <Download className="h-3.5 w-3.5" />
            Exporter (CSV)
          </a>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2" aria-label="Filtres actifs">
          <span className="text-xs text-neutral-500">Filtré par</span>
          {activeFilters.map(([key, value]) => (
            <Link
              key={key}
              href={href(query, { [key]: null })}
              scroll={false}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#257de0]/10 px-3 py-1 text-xs text-neutral-900! ring-1 ring-[#257de0]/30 transition hover:bg-[#257de0]/20"
              aria-label={`Retirer le filtre ${FILTER_LABELS[key]}`}
            >
              <span className="text-neutral-500">{FILTER_LABELS[key]} :</span>
              <span className="max-w-[16rem] truncate font-medium">
                {key === "event" ? eventLabel(value) : dimensionLabel(key, value)}
              </span>
              <X className="h-3 w-3" />
            </Link>
          ))}
          {activeFilters.length > 1 && (
            <Link href={href(query, clearAll)} scroll={false} className="text-xs font-medium text-neutral-500! underline-offset-2 hover:underline">
              Tout effacer
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
