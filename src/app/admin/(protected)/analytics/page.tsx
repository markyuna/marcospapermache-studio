import { headers } from "next/headers";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Eye,
  Flame,
  MousePointerClick,
  PlayCircle,
  Smartphone,
} from "lucide-react";

type ClarityAnalytics = {
  period: string;
  stats: {
    sessions: number;
    botSessions: number;
    users: number;
    mobileSessions: number;
    mobilePercentage: number;
  };
  topPages: {
    url: string;
    sessions: number;
    users: number;
  }[];
};

function formatNumber(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("fr-FR").format(value);
}

async function getClarityAnalytics(): Promise<ClarityAnalytics | null> {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") ?? "http";
    const cookie = headersList.get("cookie") ?? "";

    if (!host) return null;

    const response = await fetch(`${protocol}://${host}/api/admin/clarity`, {
      cache: "no-store",
      headers: { cookie },
    });

    if (!response.ok) return null;

    return response.json();
  } catch {
    return null;
  }
}

export default async function AdminAnalyticsPage() {
  const analytics = await getClarityAnalytics();

  const stats = [
    {
      label: "Sessions",
      value: formatNumber(analytics?.stats.sessions),
      description: "Dernières 24h",
      icon: Eye,
    },
    {
      label: "Utilisateurs",
      value: formatNumber(analytics?.stats.users),
      description: "Utilisateurs détectés",
      icon: MousePointerClick,
    },
    {
      label: "Bots",
      value: formatNumber(analytics?.stats.botSessions),
      description: "Sessions automatisées",
      icon: PlayCircle,
    },
    {
      label: "Mobile",
      value:
        typeof analytics?.stats.mobilePercentage === "number"
          ? `${analytics.stats.mobilePercentage}%`
          : "—",
      description: `${formatNumber(analytics?.stats.mobileSessions)} sessions`,
      icon: Smartphone,
    },
  ];

  return (
    <main className="min-h-screen bg-paper-base px-4 py-8 text-neutral-950 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">Admin</p>
            <h1 className="mt-2 text-2xl font-semibold text-neutral-950 md:text-3xl">Analytics</h1>
          </div>
          <a
            href="https://clarity.microsoft.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-xl border border-neutral-200 bg-paper-surface px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900"
          >
            <Activity className="h-4 w-4" />
            Ouvrir Clarity
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Stat cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-black/5 bg-paper-surface p-5 shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f1e8dc] text-neutral-800">
                  <Icon size={18} />
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-neutral-500">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Top pages */}
        <div className="rounded-2xl border border-black/5 bg-paper-surface p-5 shadow-sm md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-400">
                Vue générale
              </p>
              <h2 className="mt-1 text-lg font-semibold text-neutral-900">
                Pages les plus consultées
              </h2>
            </div>
            <BarChart3 className="h-5 w-5 text-neutral-300" />
          </div>

          {analytics?.topPages?.length ? (
            <div className="space-y-2">
              {analytics.topPages.map((page, index) => (
                <div
                  key={`${page.url}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-black/5 bg-[#faf7f1] px-4 py-3"
                >
                  <p className="min-w-0 truncate text-sm font-medium text-neutral-800">
                    {page.url}
                  </p>
                  <div className="flex shrink-0 items-center gap-4 text-sm text-neutral-500">
                    <span>{formatNumber(page.users)} utilisateurs</span>
                    <span className="font-semibold text-neutral-900">
                      {formatNumber(page.sessions)} sessions
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-52 items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-[#faf7f1] text-center">
              <div className="max-w-xs px-6">
                <Flame className="mx-auto mb-3 h-5 w-5 text-neutral-300" />
                <p className="text-sm text-neutral-500">
                  Aucune donnée Clarity disponible pour le moment.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
