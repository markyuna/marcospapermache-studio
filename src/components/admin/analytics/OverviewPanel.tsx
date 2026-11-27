// src/components/admin/analytics/OverviewPanel.tsx
// KPI tiles (with change vs the previous period) driving one trend chart.
"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { Granularity, SeriesPoint, Summary } from "@/lib/analytics/dashboard";
import {
  formatDecimal,
  formatDuration,
  formatNumber,
  formatPercent,
  relativeChange,
} from "@/components/admin/analytics/format";

type MetricKey =
  | "visitors"
  | "sessions"
  | "pageviews"
  | "pagesPerSession"
  | "avgDurationMs"
  | "bounceRate"
  | "commandes"
  | "conversionRate";

type Metric = {
  key: MetricKey;
  label: string;
  hint: string;
  higherIsBetter: boolean;
  format: (value: number) => string;
  point: (point: SeriesPoint) => number;
  chartKey?: MetricKey; // chart shown when the tile is selected
};

const METRICS: Metric[] = [
  {
    key: "visitors",
    label: "Visiteurs uniques",
    hint: "Personnes distinctes, comptées une fois par jour (sans cookie).",
    higherIsBetter: true,
    format: formatNumber,
    point: (p) => p.visitors,
  },
  {
    key: "sessions",
    label: "Visites",
    hint: "Une visite se termine après 30 minutes d’inactivité.",
    higherIsBetter: true,
    format: formatNumber,
    point: (p) => p.sessions,
  },
  {
    key: "pageviews",
    label: "Pages vues",
    hint: "Chaque affichage de page, navigation interne comprise.",
    higherIsBetter: true,
    format: formatNumber,
    point: (p) => p.pageviews,
  },
  {
    key: "pagesPerSession",
    label: "Pages / visite",
    hint: "Nombre moyen de pages consultées par visite.",
    higherIsBetter: true,
    format: (v) => formatDecimal(v, 1),
    point: (p) => (p.sessions ? p.pageviews / p.sessions : 0),
  },
  {
    key: "avgDurationMs",
    label: "Durée moyenne",
    hint: "Temps d’attention réel (onglet visible) par visite.",
    higherIsBetter: true,
    format: formatDuration,
    point: (p) => p.avgDurationMs,
  },
  {
    key: "bounceRate",
    label: "Taux de rebond",
    hint: "Visites d’une seule page, moins de 10 s d’attention et aucune interaction.",
    higherIsBetter: false,
    format: (v) => formatPercent(v),
    point: (p) => p.bounceRate,
  },
  {
    key: "commandes",
    label: "Commandes",
    hint: "Formulaires de commande envoyés avec succès.",
    higherIsBetter: true,
    format: formatNumber,
    point: (p) => p.commandes,
  },
  {
    key: "conversionRate",
    label: "Taux de conversion",
    hint: "Part des visites qui ont envoyé une commande.",
    higherIsBetter: true,
    format: (v) => formatPercent(v, 1),
    point: (p) => p.commandes,
    chartKey: "commandes",
  },
];

const COLOR_CURRENT = "#257de0";
const COLOR_PREVIOUS = "#a39a8c";

function niceMax(value: number) {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const base = 10 ** exponent;
  const fraction = value / base;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return nice * base;
}

function bucketLabel(bucket: string, granularity: Granularity, long = false) {
  const date = new Date(`${bucket}:00Z`);
  if (granularity === "hour") {
    const hour = `${date.getUTCHours()}h`;
    return long
      ? `${new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(date)}, ${hour}`
      : hour;
  }
  if (granularity === "month") {
    return new Intl.DateTimeFormat("fr-FR", { month: long ? "long" : "short", year: "numeric", timeZone: "UTC" }).format(date);
  }
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: long ? "short" : undefined,
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

function Delta({ current, previous, higherIsBetter }: { current: number; previous: number; higherIsBetter: boolean }) {
  const change = relativeChange(current, previous);

  if (change === null) {
    return <span className="text-xs text-neutral-400">Nouveau</span>;
  }
  if (Math.abs(change) < 0.005) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
        <Minus className="h-3 w-3" aria-hidden /> stable
      </span>
    );
  }

  const up = change > 0;
  const good = up === higherIsBetter;
  const Icon = up ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        good ? "text-[#006c10]" : "text-[#b42318]"
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {up ? "+" : "−"}
      {formatPercent(Math.abs(change))}
    </span>
  );
}

type Props = {
  summary: Summary;
  previousSummary: Summary;
  series: SeriesPoint[];
  previousSeries: SeriesPoint[];
  granularity: Granularity;
  periodLabel: string;
};

export default function OverviewPanel({
  summary,
  previousSummary,
  series,
  previousSeries,
  granularity,
  periodLabel,
}: Props) {
  const [selected, setSelected] = useState<MetricKey>("visitors");
  const metric = METRICS.find((m) => m.key === (METRICS.find((x) => x.key === selected)?.chartKey ?? selected))!;
  const tile = METRICS.find((m) => m.key === selected)!;

  return (
    <section aria-label="Vue d’ensemble" className="min-w-0 rounded-2xl border border-black/5 bg-paper-surface shadow-sm">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-t-2xl bg-black/5 sm:grid-cols-4">
        {METRICS.map((m) => {
          const active = m.key === selected;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setSelected(m.key)}
              aria-pressed={active}
              title={m.hint}
              className={clsx(
                "relative bg-paper-surface px-4 py-4 text-left transition hover:bg-[#f6efe3] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#257de0] md:px-5",
                active && "bg-[#fbf7f0]"
              )}
            >
              {active && <span className="absolute inset-x-0 top-0 h-0.5 bg-[#257de0]" aria-hidden />}
              <p className="text-xs font-medium text-neutral-500">{m.label}</p>
              <p className="mt-1.5 text-2xl font-semibold tracking-tight text-neutral-950">
                {m.format(summary[m.key])}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <Delta current={summary[m.key]} previous={previousSummary[m.key]} higherIsBetter={m.higherIsBetter} />
                <span className="hidden text-xs text-neutral-400 lg:inline">
                  vs {m.format(previousSummary[m.key])}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4 md:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">{metric.label}</h2>
            <p className="text-sm text-neutral-500">
              {periodLabel}
              {tile.key !== metric.key && ` · le taux de conversion suit les commandes`}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-600" aria-label="Légende">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-0.5 w-4 rounded-full" style={{ background: COLOR_CURRENT }} aria-hidden />
              Période sélectionnée
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-0.5 w-4 rounded-full" style={{ background: COLOR_PREVIOUS }} aria-hidden />
              Période précédente
            </span>
          </div>
        </div>

        <TrendChart metric={metric} series={series} previousSeries={previousSeries} granularity={granularity} />
      </div>
    </section>
  );
}

const HEIGHT = 240;
const WIDTH = 1000;

function TrendChart({
  metric,
  series,
  previousSeries,
  granularity,
}: {
  metric: Metric;
  series: SeriesPoint[];
  previousSeries: SeriesPoint[];
  granularity: Granularity;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);

  const current = useMemo(() => series.map(metric.point), [series, metric]);
  const previous = useMemo(
    () => series.map((_, i) => (previousSeries[i] ? metric.point(previousSeries[i]) : null)),
    [series, previousSeries, metric]
  );

  const max = niceMax(Math.max(0, ...current, ...previous.map((v) => v ?? 0)) * 1.05);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const n = current.length;
  const x = (i: number) => (n <= 1 ? WIDTH / 2 : (i / (n - 1)) * WIDTH);
  const y = (v: number) => HEIGHT - (v / max) * HEIGHT;

  const line = (values: (number | null)[]) =>
    values
      .map((v, i) => (v === null ? null : `${i === 0 || values[i - 1] === null ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`))
      .filter(Boolean)
      .join(" ");

  const area = n ? `${line(current)} L${x(n - 1)},${HEIGHT} L${x(0)},${HEIGHT} Z` : "";

  const labelEvery = Math.max(1, Math.ceil(n / 7));

  const pick = (clientX: number) => {
    const rect = plotRef.current?.getBoundingClientRect();
    if (!rect || n === 0) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setHover(Math.round(ratio * (n - 1)));
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") setHover((h) => Math.min(n - 1, (h ?? -1) + 1));
    else if (event.key === "ArrowLeft") setHover((h) => Math.max(0, (h ?? n) - 1));
    else if (event.key === "Escape") setHover(null);
    else return;
    event.preventDefault();
  };

  const allZero = current.every((v) => v === 0) && previous.every((v) => !v);

  return (
    <div>
      <div className="flex gap-3">
        {/* Y axis */}
        <div className="relative w-12 shrink-0 text-right text-[11px] text-neutral-500" style={{ height: HEIGHT }}>
          {ticks.map((tick) => (
            <span key={tick} className="absolute right-0 -translate-y-1/2 tabular-nums" style={{ top: y(tick) }}>
              {metric.format(tick)}
            </span>
          ))}
        </div>

        <div
          ref={plotRef}
          className="relative min-w-0 flex-1 touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-[#257de0]/40"
          style={{ height: HEIGHT }}
          tabIndex={0}
          role="img"
          aria-label={`Évolution : ${metric.label}. Utilisez les flèches pour parcourir les valeurs.`}
          onPointerMove={(e: PointerEvent) => pick(e.clientX)}
          onPointerDown={(e: PointerEvent) => pick(e.clientX)}
          onPointerLeave={() => setHover(null)}
          onKeyDown={onKey}
          onBlur={() => setHover(null)}
        >
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            {ticks.map((tick) => (
              <line
                key={tick}
                x1={0}
                x2={WIDTH}
                y1={y(tick)}
                y2={y(tick)}
                stroke={tick === 0 ? "#cfc5b5" : "#e4dbcc"}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <path d={line(previous)} fill="none" stroke={COLOR_PREVIOUS} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d={area} fill={COLOR_CURRENT} fillOpacity={0.1} stroke="none" />
            <path d={line(current)} fill="none" stroke={COLOR_CURRENT} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>

          {allZero && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400">
              Aucune donnée sur cette période
            </div>
          )}

          {hover !== null && n > 0 && (
            <>
              <div className="pointer-events-none absolute inset-y-0 w-px bg-neutral-400/60" style={{ left: `${(x(hover) / WIDTH) * 100}%` }} />
              <span
                className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-paper-surface"
                style={{ left: `${(x(hover) / WIDTH) * 100}%`, top: y(current[hover]), background: COLOR_CURRENT }}
              />
              <div
                className={clsx(
                  "pointer-events-none absolute top-2 z-10 min-w-40 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs shadow-lg",
                  hover > n / 2 ? "-translate-x-[calc(100%+12px)]" : "translate-x-3"
                )}
                style={{ left: `${(x(hover) / WIDTH) * 100}%` }}
                role="status"
              >
                <p className="mb-1.5 text-neutral-500">{bucketLabel(series[hover].bucket, granularity, true)}</p>
                <p className="flex items-center gap-2">
                  <span className="h-0.5 w-3 rounded-full" style={{ background: COLOR_CURRENT }} />
                  <span className="text-sm font-semibold text-neutral-950">{metric.format(current[hover])}</span>
                  <span className="text-neutral-500">sélection</span>
                </p>
                {previous[hover] !== null && (
                  <p className="mt-1 flex items-center gap-2">
                    <span className="h-0.5 w-3 rounded-full" style={{ background: COLOR_PREVIOUS }} />
                    <span className="font-semibold text-neutral-800">{metric.format(previous[hover] ?? 0)}</span>
                    <span className="text-neutral-500">
                      {previousSeries[hover] ? bucketLabel(previousSeries[hover].bucket, granularity) : "précédent"}
                    </span>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* X axis */}
      <div className="relative ml-15 mt-2 h-4 text-[11px] text-neutral-500">
        {series.map((point, i) =>
          i % labelEvery === 0 || i === n - 1 ? (
            <span
              key={point.bucket}
              className={clsx(
                "absolute whitespace-nowrap",
                i === 0 ? "" : i === n - 1 ? "-translate-x-full" : "-translate-x-1/2",
                i !== n - 1 && i % labelEvery === 0 && n - 1 - i < labelEvery / 2 && "hidden"
              )}
              style={{ left: `${(x(i) / WIDTH) * 100}%` }}
            >
              {bucketLabel(point.bucket, granularity)}
            </span>
          ) : null
        )}
      </div>

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-xs font-medium text-neutral-500 hover:text-neutral-800">
          Voir les données en tableau
        </summary>
        <div className="mt-2 max-h-72 overflow-auto rounded-xl border border-black/5 bg-[#fbf7f0]">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-[#f6efe3] text-neutral-500">
              <tr>
                <th className="px-3 py-2 font-medium">Période</th>
                <th className="px-3 py-2 text-right font-medium">{metric.label}</th>
                <th className="px-3 py-2 text-right font-medium">Période précédente</th>
              </tr>
            </thead>
            <tbody>
              {series.map((point, i) => (
                <tr key={point.bucket} className="border-t border-black/5">
                  <td className="px-3 py-1.5 text-neutral-700">{bucketLabel(point.bucket, granularity, true)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-neutral-900">{metric.format(current[i])}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-neutral-500">
                    {previous[i] === null ? "—" : metric.format(previous[i] ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
