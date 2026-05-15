// src/app/admin/(protected)/analytics/page.tsx
import Link from "next/link";
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

const insights = [
  "Analysez les pages sculptures les plus consultées.",
  "Repérez les abandons avant une demande personnalisée.",
  "Observez les clics sur les boutons principaux.",
  "Comprenez le comportement mobile et desktop.",
];

function formatNumber(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";

  return new Intl.NumberFormat("fr-FR").format(value);
}

async function getClarityAnalytics(): Promise<ClarityAnalytics | null> {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") ?? "http";

    if (!host) return null;

    const response = await fetch(`${protocol}://${host}/api/admin/clarity`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

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
      description: "Sessions sur les dernières 24h",
      icon: Eye,
    },
    {
      label: "Users",
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
      description: `${formatNumber(analytics?.stats.mobileSessions)} sessions mobile`,
      icon: Smartphone,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-10 text-neutral-950 md:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 rounded-[2rem] border border-black/10 bg-neutral-950 px-6 py-5 text-white shadow-xl md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <Activity size={20} />
            </div>

            <div>
              <h1 className="text-lg font-semibold md:text-xl">
                Analytics Dashboard
              </h1>

              <p className="mt-1 text-sm text-white/60">
                Suivez le trafic, les sessions et les interactions utilisateurs.
              </p>
            </div>
          </div>

          <a
            href="https://clarity.microsoft.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-neutral-950 transition hover:bg-white/90"
          >
            Ouvrir Clarity
            <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-[1.7rem] border border-black/10 bg-white p-6 shadow-sm"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1e8dc] text-neutral-950">
                  <Icon size={20} />
                </div>

                <p className="text-sm text-neutral-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  {stat.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-neutral-400">
                  Vue générale
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Pages les plus consultées
                </h2>
              </div>

              <BarChart3 className="text-neutral-400" />
            </div>

            {analytics?.topPages?.length ? (
              <div className="space-y-3">
                {analytics.topPages.map((page, index) => (
                  <div
                    key={`${page.url}-${index}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#faf7f1] p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-900">
                        {page.url}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {formatNumber(page.users)} utilisateurs
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-neutral-950">
                      {formatNumber(page.sessions)} sessions
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-72 items-center justify-center rounded-[1.5rem] border border-dashed border-black/15 bg-[#faf7f1] text-center">
                <div className="max-w-sm px-6">
                  <Flame className="mx-auto mb-4 text-neutral-400" />
                  <p className="text-sm font-medium text-neutral-700">
                    Aucune donnée Clarity disponible pour le moment.
                  </p>
                </div>
              </div>
            )}
          </section>

          <aside className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-neutral-400">
              Insights
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Ce que vous pouvez analyser
            </h2>

            <div className="mt-8 space-y-4">
              {insights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-black/10 bg-[#faf7f1] p-4 text-sm leading-6 text-neutral-700"
                >
                  {item}
                </div>
              ))}
            </div>

            <Link
              href="/admin"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-950"
            >
              Retour au dashboard
              <ArrowUpRight size={15} />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}