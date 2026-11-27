// src/components/admin/analytics/RealtimePanel.tsx
// Live visitors (polled every 30 s) and the visit explorer: the latest visits,
// each expandable into its page-by-page journey.
"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { ChevronRight, Monitor, MousePointerClick, Smartphone, Tablet } from "lucide-react";
import type { JourneyEvent, RealtimeData, RecentSession } from "@/lib/analytics/dashboard";
import { eventLabel } from "@/lib/analytics/shared";
import {
  countryFlag,
  countryName,
  dimensionLabel,
  formatDuration,
  formatNumber,
} from "@/components/admin/analytics/format";

const POLL_MS = 30_000;

function timeAgo(iso: string, now: number) {
  const seconds = Math.max(0, Math.round((now - Date.parse(iso)) / 1000));
  if (seconds < 60) return "à l’instant";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(new Date(iso));
}

function DeviceIcon({ device }: { device: string }) {
  const Icon = device === "mobile" ? Smartphone : device === "tablet" ? Tablet : Monitor;
  return <Icon className="h-3.5 w-3.5 text-neutral-400" aria-label={dimensionLabel("device", device)} />;
}

export default function RealtimePanel({ initial }: { initial: RealtimeData }) {
  const [data, setData] = useState(initial);
  const [now, setNow] = useState(() => Date.now());
  const [stale, setStale] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/analytics/realtime", { cache: "no-store" });
      if (!response.ok) throw new Error(String(response.status));
      setData(await response.json());
      setStale(false);
    } catch {
      setStale(true);
    } finally {
      setNow(Date.now());
    }
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [refresh]);

  const maxMinute = Math.max(1, ...data.minutes);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      {/* Live */}
      <section className="min-w-0 rounded-2xl border border-black/5 bg-paper-surface p-4 shadow-sm md:p-5" aria-live="polite">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold text-neutral-900">
            <span className="relative flex h-2.5 w-2.5">
              <span className={clsx("absolute inline-flex h-full w-full rounded-full bg-[#0aac23] opacity-60", data.activeVisitors > 0 && "animate-ping")} />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0aac23]" />
            </span>
            En ce moment
          </h2>
          <span className={clsx("text-[11px]", stale ? "text-[#b42318]" : "text-neutral-400")}>
            {stale ? "Connexion perdue" : "Actualisé toutes les 30 s"}
          </span>
        </div>

        <p className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">{formatNumber(data.activeVisitors)}</p>
        <p className="text-sm text-neutral-500">visiteur{data.activeVisitors > 1 ? "s" : ""} actif{data.activeVisitors > 1 ? "s" : ""} (5 dernières minutes)</p>

        <div className="mt-4">
          <p className="mb-1 text-[11px] text-neutral-500">Pages vues par minute · 30 dernières minutes</p>
          <div className="flex h-12 items-end gap-[2px]" role="img" aria-label={`Pages vues sur 30 minutes : ${data.minutes.reduce((a, b) => a + b, 0)}`}>
            {data.minutes.map((value, i) => (
              <span
                key={i}
                title={`il y a ${29 - i} min : ${value}`}
                className="flex-1 rounded-t-[3px] bg-[#257de0]"
                style={{ height: `${value ? Math.max(8, (value / maxMinute) * 100) : 3}%`, opacity: value ? 1 : 0.2 }}
              />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-400">Pages consultées</p>
          {data.pages.length ? (
            <ul className="space-y-1 text-sm">
              {data.pages.map((page) => (
                <li key={page.path} className="flex justify-between gap-3">
                  <span className="truncate text-neutral-700" title={page.path}>{page.path}</span>
                  <span className="font-semibold tabular-nums text-neutral-900">{page.visitors}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-400">Personne pour le moment.</p>
          )}
        </div>
      </section>

      {/* Visit explorer */}
      <section className="min-w-0 rounded-2xl border border-black/5 bg-paper-surface p-4 shadow-sm md:p-5">
        <h2 className="text-base font-semibold text-neutral-900">Dernières visites</h2>
        <p className="mb-3 text-xs text-neutral-500">Ouvrez une visite pour voir son parcours page par page.</p>

        {data.recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300/70 py-10 text-center text-sm text-neutral-400">
            Aucune visite enregistrée pour l’instant.
          </p>
        ) : (
          <ul className="max-h-[460px] divide-y divide-black/5 overflow-y-auto pr-1">
            {data.recent.map((session) => (
              <VisitRow key={session.id} session={session} now={now} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function VisitRow({ session, now }: { session: RecentSession; now: number }) {
  const [open, setOpen] = useState(false);
  const [journey, setJourney] = useState<JourneyEvent[] | null>(null);
  const [error, setError] = useState(false);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next && !journey) {
      try {
        const response = await fetch(`/api/admin/analytics/sessions/${session.id}`, { cache: "no-store" });
        if (!response.ok) throw new Error();
        const body = (await response.json()) as { events: JourneyEvent[] };
        setJourney(body.events);
      } catch {
        setError(true);
      }
    }
  }

  const live = now - Date.parse(session.lastSeenAt) < 5 * 60 * 1000;
  const source = session.referrerHost ?? dimensionLabel("channel", session.channel);

  return (
    <li>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 py-2.5 text-left text-sm hover:bg-black/[0.02]"
      >
        <ChevronRight className={clsx("h-4 w-4 shrink-0 text-neutral-400 transition", open && "rotate-90")} />
        <span className="w-6 shrink-0 text-base leading-none" title={session.country ? countryName(session.country) : "Pays inconnu"}>
          {session.country ? countryFlag(session.country) : "🌐"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate font-medium text-neutral-900">{session.entryPath}</span>
            {live && <span className="rounded-full bg-[#0aac23]/15 px-1.5 py-px text-[10px] font-medium text-[#006c10]">en ligne</span>}
          </span>
          <span className="flex flex-wrap items-center gap-x-2 text-xs text-neutral-500">
            <span>{session.city ? `${session.city}, ` : ""}{session.country ? countryName(session.country) : "Inconnu"}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <DeviceIcon device={session.device} /> {session.browser ?? "?"} / {session.os ?? "?"}
            </span>
            <span aria-hidden>·</span>
            <span>via {source}{session.utmCampaign ? ` (${session.utmCampaign})` : ""}</span>
          </span>
        </span>
        <span className="hidden shrink-0 text-right text-xs text-neutral-500 sm:block">
          <span className="block font-medium text-neutral-800">
            {session.pageviews} page{session.pageviews > 1 ? "s" : ""} · {formatDuration(session.durationMs)}
          </span>
          {timeAgo(session.startedAt, now)}
        </span>
      </button>

      {open && (
        <div className="mb-3 ml-7 rounded-xl border border-black/5 bg-[#fbf7f0] p-3">
          {error ? (
            <p className="text-xs text-[#b42318]">Impossible de charger le parcours.</p>
          ) : !journey ? (
            <p className="text-xs text-neutral-400">Chargement…</p>
          ) : (
            <ol className="relative space-y-2 border-l border-neutral-300/70 pl-4">
              {journey.map((event, i) => (
                <li key={i} className="relative text-xs">
                  <span
                    className={clsx(
                      "absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ring-2 ring-[#fbf7f0]",
                      event.type === "pageview" ? "bg-[#257de0]" : "bg-[#f47230]"
                    )}
                    aria-hidden
                  />
                  <span className="mr-2 tabular-nums text-neutral-400">
                    {new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Paris" }).format(new Date(event.createdAt))}
                  </span>
                  {event.type === "pageview" ? (
                    <>
                      <span className="font-medium text-neutral-800">{event.path}</span>
                      <span className="ml-2 text-neutral-500">
                        {event.durationMs ? formatDuration(event.durationMs) : "—"}
                        {event.scrollDepth !== null && ` · lu à ${event.scrollDepth} %`}
                      </span>
                    </>
                  ) : (
                    <>
                      <MousePointerClick className="mr-1 inline h-3 w-3 text-neutral-500" aria-hidden />
                      <span className="font-medium text-neutral-800">{eventLabel(event.name)}</span>
                      {event.props && typeof event.props === "object" && (
                        <span className="ml-2 text-neutral-500">
                          {Object.entries(event.props as Record<string, unknown>)
                            .map(([k, v]) => `${k}: ${String(v)}`)
                            .join(" · ")}
                        </span>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </li>
  );
}
