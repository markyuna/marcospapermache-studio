// src/app/admin/(protected)/analytics/page.tsx
// First-party traffic dashboard. Period, filters and options live in the URL;
// every block below is computed for the same slice so the numbers agree.
import type { Metadata } from "next";
import { Database, ShieldCheck } from "lucide-react";
import BreakdownCard, { type BreakdownTab } from "@/components/admin/analytics/BreakdownCard";
import EventsCard from "@/components/admin/analytics/EventsCard";
import FilterBar from "@/components/admin/analytics/FilterBar";
import Funnels from "@/components/admin/analytics/Funnels";
import Heatmap from "@/components/admin/analytics/Heatmap";
import IgnoreToggle from "@/components/admin/analytics/IgnoreToggle";
import OverviewPanel from "@/components/admin/analytics/OverviewPanel";
import RealtimePanel from "@/components/admin/analytics/RealtimePanel";
import {
  dimensionLabel,
  formatDuration,
  formatNumber,
  formatPercent,
  NONE,
  type DimensionKey,
} from "@/components/admin/analytics/format";
import {
  analyticsTablesExist,
  getBreakdown,
  getEvents,
  getFunnels,
  getHeatmap,
  getPages,
  getRealtime,
  getSummary,
  getTimeSeries,
  parseFilters,
  parseRange,
  previousRange,
  type BreakdownDimension,
  type BreakdownRow,
  type QueryOptions,
} from "@/lib/analytics/dashboard";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const KNOWN_PARAMS = new Set([
  "range",
  "from",
  "to",
  "merge",
  "page",
  "event",
  "entry",
  "exit",
  "channel",
  "referrer",
  "source",
  "medium",
  "campaign",
  "country",
  "region",
  "city",
  "device",
  "browser",
  "os",
  "locale",
  "language",
]);

function normalizeParams(raw: Record<string, string | string[] | undefined>) {
  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!KNOWN_PARAMS.has(key)) continue;
    const first = Array.isArray(value) ? value[0] : value;
    if (first) params[key] = first;
  }
  return params;
}

function sessionTab(
  id: BreakdownDimension,
  label: string,
  rows: BreakdownRow[],
  totalVisitors: number,
  variant: "acquisition" | "audience",
  options: { hideNone?: boolean; note?: string } = {}
): BreakdownTab {
  const visible = options.hideNone ? rows.filter((row) => row.value !== NONE) : rows;
  const dimension: DimensionKey = id;

  return {
    id,
    label,
    filterKey: id,
    note: options.note,
    columns:
      variant === "acquisition"
        ? [label, "Visiteurs", "Rebond", "Commandes"]
        : [label, "Visiteurs", "Part", "Durée moy."],
    rows: visible.map((row) => ({
      value: row.value,
      label: dimensionLabel(dimension, row.value),
      bar: row.visitors,
      cells:
        variant === "acquisition"
          ? [formatNumber(row.visitors), formatPercent(row.bounceRate), formatNumber(row.conversions)]
          : [
              formatNumber(row.visitors),
              totalVisitors ? formatPercent(row.visitors / totalVisitors) : "—",
              formatDuration(row.avgDurationMs),
            ],
    })),
  };
}

function SetupNotice() {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-paper-surface p-6 md:p-8">
      <Database className="mb-3 h-6 w-6 text-neutral-400" />
      <h2 className="text-lg font-semibold text-neutral-900">Les tables d’analytics n’existent pas encore</h2>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600">
        Exécutez le script <code className="rounded bg-black/5 px-1.5 py-0.5">supabase/analytics.sql</code> dans
        l’éditeur SQL de Supabase. Le suivi démarre automatiquement dès que les tables sont créées : aucune autre
        configuration n’est nécessaire.
      </p>
    </div>
  );
}

export default async function AdminAnalyticsPage({ searchParams }: PageProps) {
  const params = normalizeParams(await searchParams);
  const query = new URLSearchParams(params).toString();
  const range = parseRange(params);
  const previous = previousRange(range);
  const filters = parseFilters(params);
  const mergeLocales = params.merge === "1";
  const opts: QueryOptions = { filters, mergeLocales };

  let ready = false;
  try {
    ready = await analyticsTablesExist();
  } catch (error) {
    console.error("[ANALYTICS] table check", error);
  }

  const header = (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-950 md:text-3xl">Analytics</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
          <ShieldCheck className="h-4 w-4" aria-hidden />
          Mesure d’audience interne, sans cookie · données conservées 13 mois
        </p>
      </div>
      <IgnoreToggle />
    </div>
  );

  if (!ready) {
    return (
      <main className="min-h-screen bg-paper-base px-4 py-8 text-neutral-950 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          {header}
          <SetupNotice />
        </div>
      </main>
    );
  }

  const [
    summary,
    previousSummary,
    series,
    previousSeries,
    pages,
    realtime,
    heatmap,
    funnels,
    events,
    breakdowns,
  ] = await Promise.all([
    getSummary(range, opts),
    getSummary(previous, opts),
    getTimeSeries(range, opts),
    getTimeSeries(previous, opts),
    getPages(range, opts),
    getRealtime(),
    getHeatmap(range, opts),
    getFunnels(range, opts),
    getEvents(range, opts),
    Promise.all(
      (
        [
          "channel",
          "referrer",
          "source",
          "medium",
          "campaign",
          "country",
          "region",
          "city",
          "device",
          "browser",
          "os",
          "locale",
          "language",
          "entry",
        ] as const
      ).map(async (dimension) => [dimension, await getBreakdown(dimension, range, opts)] as const)
    ).then((entries) => Object.fromEntries(entries) as Record<BreakdownDimension, BreakdownRow[]>),
  ]);

  const visitors = summary.visitors;

  const pageTabs: BreakdownTab[] = [
    {
      id: "pages",
      label: "Les plus vues",
      filterKey: "page",
      columns: ["Page", "Vues", "Visiteurs", "Temps moy.", "Lecture"],
      rows: pages.map((row) => ({
        value: row.value,
        label: row.value,
        bar: row.pageviews,
        cells: [
          formatNumber(row.pageviews),
          formatNumber(row.visitors),
          formatDuration(row.avgTimeMs),
          row.avgScroll === null ? "—" : `${Math.round(row.avgScroll)} %`,
        ],
      })),
      note: "Temps moyen = attention réelle (onglet visible). Lecture = profondeur de défilement moyenne.",
    },
    {
      id: "entry",
      label: "Entrée",
      filterKey: "entry",
      columns: ["Page d’entrée", "Visites", "Rebond", "Commandes"],
      rows: breakdowns.entry.map((row) => ({
        value: row.value,
        label: row.value,
        bar: row.sessions,
        cells: [formatNumber(row.sessions), formatPercent(row.bounceRate), formatNumber(row.conversions)],
      })),
      note: "Première page vue de chaque visite.",
    },
    {
      id: "exit",
      label: "Sortie",
      filterKey: "exit",
      columns: ["Page de sortie", "Sorties", "Taux de sortie"],
      rows: [...pages]
        .filter((row) => row.exits > 0)
        .sort((a, b) => b.exits - a.exits)
        .map((row) => ({
          value: row.value,
          label: row.value,
          bar: row.exits,
          cells: [formatNumber(row.exits), formatPercent(row.exitRate)],
        })),
      note: "Taux de sortie = sorties ÷ vues de la page.",
    },
  ];

  const acquisitionTabs: BreakdownTab[] = [
    sessionTab("channel", "Canaux", breakdowns.channel, visitors, "acquisition"),
    sessionTab("referrer", "Référents", breakdowns.referrer, visitors, "acquisition"),
    sessionTab("source", "Source UTM", breakdowns.source, visitors, "acquisition", {
      hideNone: true,
      note: "Liens tagués ?utm_source=… (ex. Instagram bio, newsletter).",
    }),
    sessionTab("medium", "Support UTM", breakdowns.medium, visitors, "acquisition", { hideNone: true }),
    sessionTab("campaign", "Campagnes", breakdowns.campaign, visitors, "acquisition", { hideNone: true }),
  ];

  const geoTabs: BreakdownTab[] = [
    sessionTab("country", "Pays", breakdowns.country, visitors, "audience"),
    sessionTab("region", "Régions", breakdowns.region, visitors, "audience"),
    sessionTab("city", "Villes", breakdowns.city, visitors, "audience", {
      note: "Localisation approximative déduite par l’hébergeur ; l’adresse IP n’est jamais enregistrée.",
    }),
  ];

  const techTabs: BreakdownTab[] = [
    sessionTab("device", "Appareils", breakdowns.device, visitors, "audience"),
    sessionTab("browser", "Navigateurs", breakdowns.browser, visitors, "audience"),
    sessionTab("os", "Systèmes", breakdowns.os, visitors, "audience"),
  ];

  const languageTabs: BreakdownTab[] = [
    sessionTab("locale", "Version du site", breakdowns.locale, visitors, "audience", {
      note: "Langue de la première page de la visite.",
    }),
    sessionTab("language", "Langue du navigateur", breakdowns.language, visitors, "audience", {
      note: "Utile pour savoir s’il manque une traduction : comparez avec la version du site consultée.",
    }),
  ];

  return (
    <main className="min-h-screen bg-paper-base px-4 py-8 text-neutral-950 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-5">
        {header}

        <FilterBar range={range} filters={filters} mergeLocales={mergeLocales} query={query} />

        <OverviewPanel
          summary={summary}
          previousSummary={previousSummary}
          series={series}
          previousSeries={previousSeries}
          granularity={range.granularity}
          periodLabel={`${range.label} · comparé à la période précédente`}
        />

        <div>
          <p className="mb-2 text-xs text-neutral-500">Temps réel — tout le site, indépendamment des filtres</p>
          <RealtimePanel initial={realtime} />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <BreakdownCard title="Pages" subtitle="Contenus consultés" tabs={pageTabs} query={query} />
          <BreakdownCard title="Acquisition" subtitle="D’où viennent vos visiteurs" tabs={acquisitionTabs} query={query} />
          <BreakdownCard title="Géographie" subtitle={`${formatNumber(visitors)} visiteurs`} tabs={geoTabs} query={query} />
          <BreakdownCard title="Technologie" subtitle="Appareils et logiciels utilisés" tabs={techTabs} query={query} />
          <BreakdownCard title="Langues" subtitle="Version consultée et langue des visiteurs" tabs={languageTabs} query={query} />
          <Heatmap cells={heatmap} />
          <EventsCard events={events.events} props={events.props} sessions={summary.sessions} query={query} />
          <Funnels funnels={funnels} />
        </div>

        <p className="pt-2 text-center text-[11px] text-neutral-400">
          Visiteurs uniques comptés par jour (empreinte anonyme renouvelée chaque jour, sans cookie) · robots exclus ·
          heure de Paris
        </p>
      </div>
    </main>
  );
}
