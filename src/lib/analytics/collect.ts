// src/lib/analytics/collect.ts
// Server-side ingestion for the first-party analytics. Called by
// /api/analytics/collect after the response has been sent (next/server `after`).
//
// Privacy: the IP address and user agent are only used in memory, to compute a
// daily-rotating visitor hash and the device/browser family. Neither is stored.
import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { userAgent } from "next/server";
import { Prisma } from "@/generated/prisma/client/client";
import { prisma } from "@/lib/prisma";
import { classifyChannel, referrerHost } from "@/lib/analytics/channels";
import {
  MAX_PAGE_DURATION_MS,
  SESSION_TIMEOUT_MINUTES,
  SITE_LOCALES,
  type CollectPayload,
} from "@/lib/analytics/shared";

const BOT_PATTERN =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|preview|prerender|playwright|puppeteer|selenium|phantom|python-requests|curl|wget|axios|node-fetch|go-http|java\/|scrapy|facebookexternalhit|embedly|vercel-screenshot/i;

export type RequestContext = {
  ip: string | null;
  ua: string;
  host: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  device: string;
  browser: string | null;
  os: string | null;
  isBot: boolean;
};

function header(headers: Headers, name: string) {
  const value = headers.get(name);
  return value && value.trim() ? value.trim() : null;
}

function decodeHeader(value: string | null) {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function readRequestContext(headers: Headers): RequestContext {
  const ua = header(headers, "user-agent") ?? "";
  const parsed = userAgent({ headers });

  const forwarded = header(headers, "x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ip = forwarded || header(headers, "x-real-ip");

  const deviceType = parsed.device.type;
  const device =
    deviceType === "mobile" || deviceType === "tablet"
      ? deviceType
      : deviceType === undefined
        ? "desktop"
        : "other";

  const country = header(headers, "x-vercel-ip-country");

  return {
    ip,
    ua,
    host: header(headers, "x-forwarded-host") ?? header(headers, "host"),
    country: country && /^[A-Z]{2}$/.test(country) ? country : null,
    region: decodeHeader(header(headers, "x-vercel-ip-country-region"))?.slice(0, 64) ?? null,
    city: decodeHeader(header(headers, "x-vercel-ip-city"))?.slice(0, 120) ?? null,
    device,
    browser: parsed.browser.name?.slice(0, 64) ?? null,
    os: parsed.os.name?.slice(0, 64) ?? null,
    isBot: !ua || parsed.isBot || BOT_PATTERN.test(ua),
  };
}

function salt() {
  // A dedicated secret is best; the service-role key is a server-only secret
  // too, so it is an acceptable fallback that keeps the hash unguessable.
  return process.env.ANALYTICS_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || "mp-analytics";
}

/** Same person, same day, same browser → same id. Changes every UTC day. */
export function visitorId(ctx: Pick<RequestContext, "ip" | "ua" | "host">) {
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256")
    .update(`${salt()}|${day}|${ctx.host ?? ""}|${ctx.ip ?? ""}|${ctx.ua}`)
    .digest("hex")
    .slice(0, 32);
}

function localeOf(path: string) {
  const first = path.split("/")[1] ?? "";
  return (SITE_LOCALES as readonly string[]).includes(first) ? first : null;
}

function clean(value: string | undefined | null, max: number) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function cleanReferrer(referrer: string | undefined) {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    // Keep origin + path only: query strings can carry personal data.
    return `${url.origin}${url.pathname}`.slice(0, 512);
  } catch {
    return referrer.slice(0, 512);
  }
}

type HitPayload = Extract<CollectPayload, { t: "pageview" | "event" }>;
type PageviewPayload = Extract<CollectPayload, { t: "pageview" }>;

/** Acquisition and client details carried by a page view. */
function visitDetails(pageview: PageviewPayload, ctx: RequestContext) {
  const host = referrerHost(pageview.r, ctx.host);
  const utm = pageview.utm;

  return {
    channel: classifyChannel({
      host,
      utmSource: utm?.source,
      utmMedium: utm?.medium,
      adClick: pageview.ad,
    }),
    referrer: host ? cleanReferrer(pageview.r) : null,
    referrerHost: host,
    utmSource: clean(utm?.source, 120)?.toLowerCase() ?? null,
    utmMedium: clean(utm?.medium, 120)?.toLowerCase() ?? null,
    utmCampaign: clean(utm?.campaign, 120),
    utmTerm: clean(utm?.term, 120),
    utmContent: clean(utm?.content, 120),
    screenWidth: pageview.w ?? null,
    locale: localeOf(pageview.p),
    language: clean(pageview.l, 16)?.toLowerCase() ?? null,
  };
}

async function recordHit(payload: HitPayload, ctx: RequestContext) {
  const visitor = visitorId(ctx);
  const isPageview = payload.t === "pageview";

  await prisma.$transaction(async (tx) => {
    // Serialize hits of the same visitor so two parallel requests cannot open
    // two sessions for one visit.
    await tx.$executeRaw`select pg_advisory_xact_lock(hashtext(${visitor}))`;

    if (isPageview) {
      const duplicate = await tx.analyticsEvent.findFirst({
        where: { pageviewId: payload.pid, type: "pageview" },
        select: { id: true },
      });
      if (duplicate) return;
    }

    const since = new Date(Date.now() - SESSION_TIMEOUT_MINUTES * 60 * 1000);
    const active = await tx.analyticsSession.findFirst({
      where: { visitorId: visitor, lastSeenAt: { gte: since } },
      orderBy: { lastSeenAt: "desc" },
      select: { id: true, pageviews: true },
    });

    let sessionId: string;

    if (active) {
      sessionId = active.id;
      await tx.analyticsSession.update({
        where: { id: sessionId },
        data: {
          lastSeenAt: new Date(),
          ...(isPageview
            ? {
                pageviews: { increment: 1 },
                exitPath: payload.p,
                // The visit was opened by an event whose beacon beat the page
                // view: the first page view brings the real entry/acquisition.
                ...(active.pageviews === 0 ? { entryPath: payload.p, ...visitDetails(payload, ctx) } : {}),
              }
            : { events: { increment: 1 } }),
        },
      });
    } else {
      sessionId = randomUUID();
      await tx.analyticsSession.create({
        data: {
          id: sessionId,
          visitorId: visitor,
          entryPath: payload.p,
          exitPath: payload.p,
          pageviews: isPageview ? 1 : 0,
          events: isPageview ? 0 : 1,
          country: ctx.country,
          region: ctx.region,
          city: ctx.city,
          device: ctx.device,
          browser: ctx.browser,
          os: ctx.os,
          locale: localeOf(payload.p),
          ...(isPageview ? visitDetails(payload, ctx) : {}),
        },
      });
    }

    await tx.analyticsEvent.create({
      data: {
        sessionId,
        type: payload.t,
        name: isPageview ? "pageview" : payload.n,
        path: payload.p,
        pageviewId: payload.pid ?? null,
        props: !isPageview && payload.props ? payload.props : undefined,
      },
    });
  });
}

/**
 * The visitor is leaving a page: store its engaged time and scroll depth.
 * The beacon can fire several times for one page (each time the tab is hidden),
 * always with the cumulative value, so only increases are applied.
 */
async function recordLeave(payload: Extract<CollectPayload, { t: "leave" }>) {
  const duration = Math.min(payload.d, MAX_PAGE_DURATION_MS);
  const scroll = Math.min(Math.max(payload.s, 0), 100);

  await prisma.$executeRaw`
    with previous as (
      select id, session_id, coalesce(duration_ms, 0) as duration_ms
      from public.analytics_events
      where pageview_id = ${payload.pid}::uuid and type = 'pageview'
      for update
    ),
    updated as (
      update public.analytics_events e
      set duration_ms  = greatest(coalesce(e.duration_ms, 0), ${duration}::int),
          scroll_depth = greatest(coalesce(e.scroll_depth, 0), ${scroll}::smallint)
      from previous
      where e.id = previous.id
      returning e.session_id, e.duration_ms - previous.duration_ms as delta
    )
    update public.analytics_sessions s
    set duration_ms  = s.duration_ms + updated.delta,
        last_seen_at = greatest(s.last_seen_at, now())
    from updated
    where s.id = updated.session_id`;
}

export async function collect(payload: CollectPayload, ctx: RequestContext) {
  if (payload.t === "leave") {
    await recordLeave(payload);
  } else {
    await recordHit(payload, ctx);
  }

  // Opportunistic 13-month retention purge (≈ once every 500 hits).
  if (Math.random() < 0.002) {
    await prisma.$executeRaw(Prisma.sql`select public.analytics_purge()`);
  }
}

/**
 * Whether hits are recorded at all. Off in development and on Vercel preview
 * deployments so tests do not pollute production numbers. Override with
 * ANALYTICS_ENABLED=1 / 0.
 */
export function isCollectionEnabled() {
  const flag = process.env.ANALYTICS_ENABLED;
  if (flag === "1" || flag === "true") return true;
  if (flag === "0" || flag === "false") return false;

  const vercelEnv = process.env.VERCEL_ENV;
  return process.env.NODE_ENV === "production" && (!vercelEnv || vercelEnv === "production");
}
