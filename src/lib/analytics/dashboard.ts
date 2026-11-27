// src/lib/analytics/dashboard.ts
// Read side of the first-party analytics: every query the admin dashboard runs.
// All SQL is parameterized; identifiers (columns, units) only ever come from the
// whitelists below.
import "server-only";
import { Prisma } from "@/generated/prisma/client/client";
import { prisma } from "@/lib/prisma";

export const TIME_ZONE = "Europe/Paris";

// ---------------------------------------------------------------------------
// Period
// ---------------------------------------------------------------------------

export const RANGE_PRESETS = {
  today: "Aujourd’hui",
  yesterday: "Hier",
  "7d": "7 jours",
  "30d": "30 jours",
  "90d": "90 jours",
  "12m": "12 mois",
} as const;

export type RangeKey = keyof typeof RANGE_PRESETS | "custom";
export type Granularity = "hour" | "day" | "month";

export type DateRange = {
  key: RangeKey;
  from: Date; // inclusive
  to: Date; // exclusive
  granularity: Granularity;
  label: string;
  fromDay: string; // YYYY-MM-DD (Paris)
  toDay: string; // YYYY-MM-DD (Paris), inclusive
};

const DAY_MS = 24 * 60 * 60 * 1000;

function parisDay(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function offsetMs(at: Date) {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    timeZoneName: "longOffset",
  })
    .formatToParts(at)
    .find((part) => part.type === "timeZoneName")?.value;
  const match = name?.match(/GMT([+-])(\d{2}):?(\d{2})?/);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3] ?? 0)) * 60 * 1000;
}

/** Paris midnight of a YYYY-MM-DD day, as a UTC instant. */
function parisMidnight(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d);
  const first = guess - offsetMs(new Date(guess));
  return new Date(guess - offsetMs(new Date(first)));
}

function addDays(day: string, days: number) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

function isDay(value: string | undefined): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function formatDayLabel(day: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${day}T00:00:00Z`));
}

export function parseRange(params: Record<string, string | undefined>): DateRange {
  const now = new Date();
  const today = parisDay(now);
  const key = (params.range ?? "30d") as RangeKey;

  const build = (
    k: RangeKey,
    fromDay: string,
    toDayInclusive: string,
    granularity: Granularity,
    label: string
  ): DateRange => {
    const to = toDayInclusive === today ? now : parisMidnight(addDays(toDayInclusive, 1));
    return {
      key: k,
      from: parisMidnight(fromDay),
      to,
      granularity,
      label,
      fromDay,
      toDay: toDayInclusive,
    };
  };

  switch (key) {
    case "today":
      return build("today", today, today, "hour", RANGE_PRESETS.today);
    case "yesterday": {
      const day = addDays(today, -1);
      return build("yesterday", day, day, "hour", RANGE_PRESETS.yesterday);
    }
    case "7d":
      return build("7d", addDays(today, -6), today, "day", "7 derniers jours");
    case "90d":
      return build("90d", addDays(today, -89), today, "day", "90 derniers jours");
    case "12m": {
      const [y, m] = today.split("-").map(Number);
      const start = new Date(Date.UTC(y, m - 1 - 11, 1)).toISOString().slice(0, 10);
      return build("12m", start, today, "month", "12 derniers mois");
    }
    case "custom": {
      let fromDay = isDay(params.from) ? params.from : addDays(today, -29);
      let toDay = isDay(params.to) ? params.to : today;
      if (toDay > today) toDay = today;
      if (fromDay > toDay) [fromDay, toDay] = [toDay, fromDay];
      const days = (Date.parse(toDay) - Date.parse(fromDay)) / DAY_MS + 1;
      const granularity: Granularity = days <= 1 ? "hour" : days > 180 ? "month" : "day";
      return build(
        "custom",
        fromDay,
        toDay,
        granularity,
        days <= 1 ? formatDayLabel(fromDay) : `${formatDayLabel(fromDay)} – ${formatDayLabel(toDay)}`
      );
    }
    case "30d":
    default:
      return build("30d", addDays(today, -29), today, "day", "30 derniers jours");
  }
}

/** The period of the same length just before `range`, for comparisons. */
export function previousRange(range: DateRange): DateRange {
  const length = range.to.getTime() - range.from.getTime();
  return {
    ...range,
    from: new Date(range.from.getTime() - length),
    to: range.from,
    label: "Période précédente",
  };
}

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

/** Filters that are a column of analytics_sessions. */
const SESSION_FILTERS = {
  entry: { column: "entry_path", label: "Page d’entrée", path: true },
  exit: { column: "exit_path", label: "Page de sortie", path: true },
  channel: { column: "channel", label: "Canal", path: false },
  referrer: { column: "referrer_host", label: "Référent", path: false },
  source: { column: "utm_source", label: "Source UTM", path: false },
  medium: { column: "utm_medium", label: "Support UTM", path: false },
  campaign: { column: "utm_campaign", label: "Campagne", path: false },
  country: { column: "country", label: "Pays", path: false },
  region: { column: "region", label: "Région", path: false },
  city: { column: "city", label: "Ville", path: false },
  device: { column: "device", label: "Appareil", path: false },
  browser: { column: "browser", label: "Navigateur", path: false },
  os: { column: "os", label: "Système", path: false },
  locale: { column: "locale", label: "Langue du site", path: false },
  language: { column: "language", label: "Langue du navigateur", path: false },
} as const;

export const FILTER_LABELS: Record<FilterKey, string> = {
  page: "Page",
  event: "Événement",
  ...Object.fromEntries(Object.entries(SESSION_FILTERS).map(([key, def]) => [key, def.label])),
} as Record<FilterKey, string>;

export type SessionFilterKey = keyof typeof SESSION_FILTERS;
export type FilterKey = SessionFilterKey | "page" | "event";
export const FILTER_KEYS = ["page", "event", ...Object.keys(SESSION_FILTERS)] as FilterKey[];

/** Placeholder used in URLs for "no value" (direct traffic, unknown city…). */
export const NONE = "__none";

export type Filters = Partial<Record<FilterKey, string>>;

export type QueryOptions = {
  filters: Filters;
  /** Group /fr/x, /en/x and /es/x as one page. */
  mergeLocales: boolean;
};

export function parseFilters(params: Record<string, string | undefined>): Filters {
  const filters: Filters = {};
  for (const key of FILTER_KEYS) {
    const value = params[key];
    if (typeof value === "string" && value.length > 0 && value.length <= 512) {
      filters[key] = value;
    }
  }
  return filters;
}

const LOCALE_PREFIX = "^/(fr|en|es)(/|$)";

function pathExpr(column: Prisma.Sql, merge: boolean) {
  return merge ? Prisma.sql`regexp_replace(${column}, ${LOCALE_PREFIX}, '/')` : column;
}

function sessionFilterSql(opts: QueryOptions): Prisma.Sql[] {
  const parts: Prisma.Sql[] = [];

  for (const [key, def] of Object.entries(SESSION_FILTERS) as [
    SessionFilterKey,
    (typeof SESSION_FILTERS)[SessionFilterKey],
  ][]) {
    const value = opts.filters[key];
    if (value === undefined) continue;
    const column = Prisma.raw(`s.${def.column}`);

    if (value === NONE) {
      parts.push(Prisma.sql`${column} is null`);
    } else if (def.path) {
      parts.push(Prisma.sql`${pathExpr(column, opts.mergeLocales)} = ${value}`);
    } else if (key === "language") {
      // The breakdown groups "fr-FR", "fr-CA"… under "fr".
      parts.push(Prisma.sql`split_part(${column}, '-', 1) = ${value}`);
    } else {
      parts.push(Prisma.sql`${column} = ${value}`);
    }
  }

  if (opts.filters.page) {
    parts.push(Prisma.sql`exists (
      select 1 from public.analytics_events fp
      where fp.session_id = s.id and fp.type = 'pageview'
        and ${pathExpr(Prisma.raw("fp.path"), opts.mergeLocales)} = ${opts.filters.page}
    )`);
  }

  if (opts.filters.event) {
    parts.push(Prisma.sql`exists (
      select 1 from public.analytics_events fe
      where fe.session_id = s.id and fe.type = 'event' and fe.name = ${opts.filters.event}
    )`);
  }

  return parts;
}

function and(parts: Prisma.Sql[]) {
  return parts.length ? Prisma.join(parts, " and ") : Prisma.sql`true`;
}

/** WHERE for queries over analytics_sessions s (visits started in the range). */
function sessionWhere(range: DateRange, opts: QueryOptions) {
  return and([
    Prisma.sql`s.started_at >= ${range.from} and s.started_at < ${range.to}`,
    ...sessionFilterSql(opts),
  ]);
}

/**
 * WHERE for queries over analytics_events e joined to its session s (events
 * that happened in the range). The page filter also narrows page views to
 * that page.
 */
function eventWhere(range: DateRange, opts: QueryOptions) {
  const parts = [
    Prisma.sql`e.created_at >= ${range.from} and e.created_at < ${range.to}`,
    ...sessionFilterSql(opts),
  ];
  if (opts.filters.page) {
    parts.push(
      Prisma.sql`(e.type <> 'pageview' or ${pathExpr(Prisma.raw("e.path"), opts.mergeLocales)} = ${opts.filters.page})`
    );
  }
  return and(parts);
}

// A "bounce" is a visit without engagement (same idea as GA4): one page,
// under 10 seconds of attention and no interaction.
const BOUNCE = Prisma.sql`(s.pageviews <= 1 and s.events = 0 and s.duration_ms < 10000)`;
const CONVERTED = Prisma.sql`exists (
  select 1 from public.analytics_events ce
  where ce.session_id = s.id and ce.type = 'event' and ce.name = 'commande_submitted'
)`;

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

export type Summary = {
  visitors: number;
  sessions: number;
  pageviews: number;
  pagesPerSession: number;
  avgDurationMs: number;
  bounceRate: number; // 0..1
  commandes: number;
  conversionRate: number; // 0..1
};

export async function getSummary(range: DateRange, opts: QueryOptions): Promise<Summary> {
  const [sessionRows, eventRows] = await Promise.all([
    prisma.$queryRaw<
      { visitors: number; sessions: number; bounces: number; avg_duration: number; converted: number }[]
    >`
      select count(distinct s.visitor_id)::int as visitors,
             count(*)::int as sessions,
             (count(*) filter (where ${BOUNCE}))::int as bounces,
             coalesce(avg(s.duration_ms), 0)::float8 as avg_duration,
             (count(*) filter (where ${CONVERTED}))::int as converted
      from public.analytics_sessions s
      where ${sessionWhere(range, opts)}`,
    prisma.$queryRaw<{ pageviews: number; commandes: number }[]>`
      select (count(*) filter (where e.type = 'pageview'))::int as pageviews,
             (count(*) filter (where e.type = 'event' and e.name = 'commande_submitted'))::int as commandes
      from public.analytics_events e
      join public.analytics_sessions s on s.id = e.session_id
      where ${eventWhere(range, opts)}`,
  ]);

  const s = sessionRows[0];
  const e = eventRows[0];
  const sessions = s?.sessions ?? 0;

  return {
    visitors: s?.visitors ?? 0,
    sessions,
    pageviews: e?.pageviews ?? 0,
    pagesPerSession: sessions ? (e?.pageviews ?? 0) / sessions : 0,
    avgDurationMs: s?.avg_duration ?? 0,
    bounceRate: sessions ? (s?.bounces ?? 0) / sessions : 0,
    commandes: e?.commandes ?? 0,
    conversionRate: sessions ? (s?.converted ?? 0) / sessions : 0,
  };
}

// ---------------------------------------------------------------------------
// Time series
// ---------------------------------------------------------------------------

export type SeriesPoint = {
  bucket: string; // local Paris time, "YYYY-MM-DDTHH:MI"
  visitors: number;
  sessions: number;
  pageviews: number;
  bounceRate: number;
  avgDurationMs: number;
  commandes: number;
};

export async function getTimeSeries(range: DateRange, opts: QueryOptions): Promise<SeriesPoint[]> {
  const unit = Prisma.raw(`'${range.granularity}'`);
  const step = Prisma.raw(`interval '1 ${range.granularity}'`);
  const tz = TIME_ZONE;

  const rows = await prisma.$queryRaw<
    {
      bucket: string;
      visitors: number;
      sessions: number;
      bounces: number;
      avg_duration: number;
      pageviews: number;
      commandes: number;
    }[]
  >`
    with buckets as (
      select generate_series(
        date_trunc(${unit}, ${range.from}::timestamptz at time zone ${tz}),
        date_trunc(${unit}, (${range.to}::timestamptz - interval '1 millisecond') at time zone ${tz}),
        ${step}
      ) as b
    ),
    ss as (
      select date_trunc(${unit}, s.started_at at time zone ${tz}) as b,
             count(distinct s.visitor_id)::int as visitors,
             count(*)::int as sessions,
             (count(*) filter (where ${BOUNCE}))::int as bounces,
             avg(s.duration_ms)::float8 as avg_duration
      from public.analytics_sessions s
      where ${sessionWhere(range, opts)}
      group by 1
    ),
    ev as (
      select date_trunc(${unit}, e.created_at at time zone ${tz}) as b,
             (count(*) filter (where e.type = 'pageview'))::int as pageviews,
             (count(*) filter (where e.type = 'event' and e.name = 'commande_submitted'))::int as commandes
      from public.analytics_events e
      join public.analytics_sessions s on s.id = e.session_id
      where ${eventWhere(range, opts)}
      group by 1
    )
    select to_char(buckets.b, 'YYYY-MM-DD"T"HH24:MI') as bucket,
           coalesce(ss.visitors, 0)::int as visitors,
           coalesce(ss.sessions, 0)::int as sessions,
           coalesce(ss.bounces, 0)::int as bounces,
           coalesce(ss.avg_duration, 0)::float8 as avg_duration,
           coalesce(ev.pageviews, 0)::int as pageviews,
           coalesce(ev.commandes, 0)::int as commandes
    from buckets
    left join ss on ss.b = buckets.b
    left join ev on ev.b = buckets.b
    order by buckets.b`;

  return rows.map((row) => ({
    bucket: row.bucket,
    visitors: row.visitors,
    sessions: row.sessions,
    pageviews: row.pageviews,
    bounceRate: row.sessions ? row.bounces / row.sessions : 0,
    avgDurationMs: row.avg_duration,
    commandes: row.commandes,
  }));
}

// ---------------------------------------------------------------------------
// Breakdowns
// ---------------------------------------------------------------------------

export type BreakdownRow = {
  value: string; // NONE for null
  visitors: number;
  sessions: number;
  bounceRate: number;
  avgDurationMs: number;
  conversions: number;
};

export const BREAKDOWN_DIMENSIONS = {
  channel: "channel",
  referrer: "referrer_host",
  source: "utm_source",
  medium: "utm_medium",
  campaign: "utm_campaign",
  country: "country",
  region: "region",
  city: "city",
  device: "device",
  browser: "browser",
  os: "os",
  locale: "locale",
  language: "language",
  entry: "entry_path",
} as const satisfies Partial<Record<SessionFilterKey, string>>;

export type BreakdownDimension = keyof typeof BREAKDOWN_DIMENSIONS;

const LIMIT = 50;

export async function getBreakdown(
  dimension: BreakdownDimension,
  range: DateRange,
  opts: QueryOptions
): Promise<BreakdownRow[]> {
  const raw = Prisma.raw(`s.${BREAKDOWN_DIMENSIONS[dimension]}`);
  const column =
    dimension === "entry"
      ? pathExpr(raw, opts.mergeLocales)
      : dimension === "language"
        ? Prisma.sql`split_part(${raw}, '-', 1)`
        : raw;

  const rows = await prisma.$queryRaw<
    { value: string | null; visitors: number; sessions: number; bounces: number; avg_duration: number; conversions: number }[]
  >`
    select ${column} as value,
           count(distinct s.visitor_id)::int as visitors,
           count(*)::int as sessions,
           (count(*) filter (where ${BOUNCE}))::int as bounces,
           coalesce(avg(s.duration_ms), 0)::float8 as avg_duration,
           (count(*) filter (where ${CONVERTED}))::int as conversions
    from public.analytics_sessions s
    where ${sessionWhere(range, opts)}
    group by 1
    order by visitors desc, sessions desc
    limit ${LIMIT}`;

  return rows.map((row) => ({
    value: row.value ?? NONE,
    visitors: row.visitors,
    sessions: row.sessions,
    bounceRate: row.sessions ? row.bounces / row.sessions : 0,
    avgDurationMs: row.avg_duration,
    conversions: row.conversions,
  }));
}

export type PageRow = {
  value: string;
  pageviews: number;
  visitors: number;
  avgTimeMs: number | null;
  avgScroll: number | null;
  exits: number;
  exitRate: number;
};

export async function getPages(range: DateRange, opts: QueryOptions): Promise<PageRow[]> {
  const path = pathExpr(Prisma.raw("e.path"), opts.mergeLocales);
  const exitPath = pathExpr(Prisma.raw("s.exit_path"), opts.mergeLocales);

  const [pages, exits] = await Promise.all([
    prisma.$queryRaw<
      { value: string; pageviews: number; visitors: number; avg_time: number | null; avg_scroll: number | null }[]
    >`
      select ${path} as value,
             count(*)::int as pageviews,
             count(distinct s.visitor_id)::int as visitors,
             (avg(e.duration_ms) filter (where e.duration_ms > 0))::float8 as avg_time,
             (avg(e.scroll_depth) filter (where e.scroll_depth is not null))::float8 as avg_scroll
      from public.analytics_events e
      join public.analytics_sessions s on s.id = e.session_id
      where ${eventWhere(range, opts)} and e.type = 'pageview'
      group by 1
      order by pageviews desc
      limit ${LIMIT}`,
    prisma.$queryRaw<{ value: string; exits: number }[]>`
      select ${exitPath} as value, count(*)::int as exits
      from public.analytics_sessions s
      where ${sessionWhere(range, opts)} and s.pageviews > 0
      group by 1`,
  ]);

  const exitMap = new Map(exits.map((row) => [row.value, row.exits]));

  return pages.map((row) => {
    const pageExits = exitMap.get(row.value) ?? 0;
    return {
      value: row.value,
      pageviews: row.pageviews,
      visitors: row.visitors,
      avgTimeMs: row.avg_time,
      avgScroll: row.avg_scroll,
      exits: pageExits,
      exitRate: row.pageviews ? Math.min(1, pageExits / row.pageviews) : 0,
    };
  });
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export type EventRow = { name: string; total: number; sessions: number };
export type EventPropRow = { name: string; key: string; value: string; total: number };

export async function getEvents(range: DateRange, opts: QueryOptions) {
  const [events, props] = await Promise.all([
    prisma.$queryRaw<EventRow[]>`
      select e.name, count(*)::int as total, count(distinct e.session_id)::int as sessions
      from public.analytics_events e
      join public.analytics_sessions s on s.id = e.session_id
      where ${eventWhere(range, opts)} and e.type = 'event'
      group by 1
      order by total desc`,
    prisma.$queryRaw<EventPropRow[]>`
      select e.name, kv.key, kv.value, count(*)::int as total
      from public.analytics_events e
      join public.analytics_sessions s on s.id = e.session_id
      cross join lateral jsonb_each_text(e.props) as kv(key, value)
      where ${eventWhere(range, opts)} and e.type = 'event' and e.props is not null
      group by 1, 2, 3
      order by total desc
      limit 300`,
  ]);

  return { events, props };
}

// ---------------------------------------------------------------------------
// Heatmap (weekday × hour, Paris time)
// ---------------------------------------------------------------------------

export type HeatCell = { dow: number; hour: number; sessions: number };

export async function getHeatmap(range: DateRange, opts: QueryOptions): Promise<HeatCell[]> {
  const tz = TIME_ZONE;
  return prisma.$queryRaw<HeatCell[]>`
    select extract(isodow from s.started_at at time zone ${tz})::int as dow,
           extract(hour from s.started_at at time zone ${tz})::int as hour,
           count(*)::int as sessions
    from public.analytics_sessions s
    where ${sessionWhere(range, opts)}
    group by 1, 2`;
}

// ---------------------------------------------------------------------------
// Funnels
// ---------------------------------------------------------------------------

type FunnelStep =
  | { label: string; kind: "all" }
  | { label: string; kind: "page"; pattern: string }
  | { label: string; kind: "event"; name: string };

export const FUNNELS: { id: string; label: string; steps: FunnelStep[] }[] = [
  {
    id: "commande",
    label: "Commande sur mesure",
    steps: [
      { label: "Visite du site", kind: "all" },
      { label: "Page sur mesure ou commande", kind: "page", pattern: "^/(fr|en|es)/(creations-sur-mesure|commande)(/|$)" },
      { label: "Page commande", kind: "page", pattern: "^/(fr|en|es)/commande(/|$)" },
      { label: "Commande envoyée", kind: "event", name: "commande_submitted" },
    ],
  },
  {
    id: "ai",
    label: "Créateur IA",
    steps: [
      { label: "Visite du site", kind: "all" },
      { label: "Page Créer (IA)", kind: "page", pattern: "^/(fr|en|es)/create(/|$)" },
      { label: "Image générée", kind: "event", name: "image_generated" },
      { label: "Commande envoyée", kind: "event", name: "commande_submitted" },
    ],
  },
  {
    id: "quiz",
    label: "Quiz",
    steps: [
      { label: "Visite du site", kind: "all" },
      { label: "Quiz commencé", kind: "event", name: "quiz_started" },
      { label: "Quiz terminé", kind: "event", name: "quiz_completed" },
      { label: "Résultat enregistré", kind: "event", name: "quiz_saved" },
    ],
  },
];

export type FunnelResult = { id: string; label: string; steps: { label: string; sessions: number }[] };

export async function getFunnels(range: DateRange, opts: QueryOptions): Promise<FunnelResult[]> {
  return Promise.all(
    FUNNELS.map(async (funnel) => {
      const flags = funnel.steps.map((step, index) => {
        const alias = Prisma.raw(`f${index}`);
        if (step.kind === "all") return Prisma.sql`true as ${alias}`;
        if (step.kind === "page") {
          return Prisma.sql`coalesce(bool_or(e.type = 'pageview' and e.path ~ ${step.pattern}), false) as ${alias}`;
        }
        return Prisma.sql`coalesce(bool_or(e.type = 'event' and e.name = ${step.name}), false) as ${alias}`;
      });

      const counts = funnel.steps.map((_, index) => {
        const condition = Prisma.join(
          funnel.steps.slice(0, index + 1).map((__, i) => Prisma.raw(`per_session.f${i}`)),
          " and "
        );
        return Prisma.sql`(count(*) filter (where ${condition}))::int as ${Prisma.raw(`c${index}`)}`;
      });

      const rows = await prisma.$queryRaw<Record<string, number>[]>`
        with per_session as (
          select s.id, ${Prisma.join(flags, ", ")}
          from public.analytics_sessions s
          left join public.analytics_events e on e.session_id = s.id
          where ${sessionWhere(range, opts)}
          group by s.id
        )
        select ${Prisma.join(counts, ", ")} from per_session`;

      const row = rows[0] ?? {};
      return {
        id: funnel.id,
        label: funnel.label,
        steps: funnel.steps.map((step, index) => ({
          label: step.label,
          sessions: Number(row[`c${index}`] ?? 0),
        })),
      };
    })
  );
}

// ---------------------------------------------------------------------------
// Realtime & visit explorer
// ---------------------------------------------------------------------------

export type RecentSession = {
  id: string;
  startedAt: string;
  lastSeenAt: string;
  entryPath: string;
  exitPath: string;
  pageviews: number;
  events: number;
  durationMs: number;
  channel: string;
  referrerHost: string | null;
  utmCampaign: string | null;
  country: string | null;
  city: string | null;
  device: string;
  browser: string | null;
  os: string | null;
  locale: string | null;
};

export async function getRealtime() {
  const [active, pages, perMinute, recent] = await Promise.all([
    prisma.$queryRaw<{ visitors: number }[]>`
      select count(distinct visitor_id)::int as visitors
      from public.analytics_sessions
      where last_seen_at > now() - interval '5 minutes'`,
    prisma.$queryRaw<{ path: string; visitors: number }[]>`
      select latest.path, count(*)::int as visitors
      from public.analytics_sessions s
      cross join lateral (
        select e.path from public.analytics_events e
        where e.session_id = s.id and e.type = 'pageview'
        order by e.created_at desc limit 1
      ) latest
      where s.last_seen_at > now() - interval '5 minutes'
      group by 1
      order by visitors desc
      limit 10`,
    prisma.$queryRaw<{ minute: number; pageviews: number }[]>`
      select floor(extract(epoch from now() - e.created_at) / 60)::int as minute,
             count(*)::int as pageviews
      from public.analytics_events e
      where e.type = 'pageview' and e.created_at > now() - interval '30 minutes'
      group by 1`,
    prisma.analyticsSession.findMany({
      orderBy: { lastSeenAt: "desc" },
      take: 25,
      select: {
        id: true,
        startedAt: true,
        lastSeenAt: true,
        entryPath: true,
        exitPath: true,
        pageviews: true,
        events: true,
        durationMs: true,
        channel: true,
        referrerHost: true,
        utmCampaign: true,
        country: true,
        city: true,
        device: true,
        browser: true,
        os: true,
        locale: true,
      },
    }),
  ]);

  const minutes = Array.from({ length: 30 }, (_, i) => {
    const minute = 29 - i; // oldest first
    return perMinute.find((row) => row.minute === minute)?.pageviews ?? 0;
  });

  return {
    activeVisitors: active[0]?.visitors ?? 0,
    pages,
    minutes,
    recent: recent.map<RecentSession>((session) => ({
      ...session,
      startedAt: session.startedAt.toISOString(),
      lastSeenAt: session.lastSeenAt.toISOString(),
    })),
  };
}

export type RealtimeData = Awaited<ReturnType<typeof getRealtime>>;

export async function getSessionJourney(id: string) {
  const events = await prisma.analyticsEvent.findMany({
    where: { sessionId: id },
    orderBy: { createdAt: "asc" },
    take: 200,
    select: {
      createdAt: true,
      type: true,
      name: true,
      path: true,
      durationMs: true,
      scrollDepth: true,
      props: true,
    },
  });

  return events.map((event) => ({
    ...event,
    createdAt: event.createdAt.toISOString(),
  }));
}

export type JourneyEvent = Awaited<ReturnType<typeof getSessionJourney>>[number];

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export async function getSessionsForExport(range: DateRange, opts: QueryOptions) {
  return prisma.$queryRaw<Record<string, unknown>[]>`
    select to_char(s.started_at at time zone ${TIME_ZONE}, 'YYYY-MM-DD HH24:MI:SS') as started_at,
           s.entry_path, s.exit_path, s.pageviews, s.events,
           round(s.duration_ms / 1000.0)::int as duration_s,
           s.channel, s.referrer_host, s.utm_source, s.utm_medium, s.utm_campaign,
           s.utm_term, s.utm_content, s.country, s.region, s.city,
           s.device, s.browser, s.os, s.screen_width, s.locale, s.language,
           ${BOUNCE} as bounce, ${CONVERTED} as commande
    from public.analytics_sessions s
    where ${sessionWhere(range, opts)}
    order by s.started_at desc
    limit 50000`;
}

/** Whether the analytics tables exist (the SQL file may not have been run yet). */
export async function analyticsTablesExist() {
  const rows = await prisma.$queryRaw<{ ok: boolean }[]>`
    select (to_regclass('public.analytics_sessions') is not null
        and to_regclass('public.analytics_events') is not null) as ok`;
  return rows[0]?.ok ?? false;
}
