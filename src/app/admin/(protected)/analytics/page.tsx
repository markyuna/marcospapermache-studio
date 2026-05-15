// src/app/admin/(protected)/analytics/page.tsx
import Link from "next/link";
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

const stats = [
  {
    label: "Sessions",
    value: "—",
    description: "Trafic total du site",
    icon: Eye,
  },
  {
    label: "Clicks",
    value: "—",
    description: "Interactions utilisateurs",
    icon: MousePointerClick,
  },
  {
    label: "Recordings",
    value: "—",
    description: "Sessions enregistrées",
    icon: PlayCircle,
  },
  {
    label: "Mobile",
    value: "—",
    description: "Trafic depuis téléphone",
    icon: Smartphone,
  },
];

const insights = [
  "Analysez les pages sculptures les plus consultées.",
  "Repérez les abandons avant une demande personnalisée.",
  "Observez les clics sur les boutons principaux.",
  "Comprenez le comportement mobile et desktop.",
];

export default function AdminAnalyticsPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-10 text-neutral-950 md:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 overflow-hidden rounded-[2rem] border border-black/10 bg-neutral-950 p-8 text-white shadow-2xl md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/70">
                <Activity size={14} />
                Analytics dashboard
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                Suivez le trafic et le comportement de vos visiteurs.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
                Un espace centralisé pour accéder rapidement aux données Clarity,
                analyser les sessions, les heatmaps et les interactions sur votre site.
              </p>
            </div>

            <a
              href="https://clarity.microsoft.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-950 transition hover:bg-white/90"
            >
              Ouvrir Clarity
              <ArrowUpRight size={16} />
            </a>
          </div>
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
                  Trafic du site
                </h2>
              </div>

              <BarChart3 className="text-neutral-400" />
            </div>

            <div className="flex h-72 items-center justify-center rounded-[1.5rem] border border-dashed border-black/15 bg-[#faf7f1] text-center">
              <div className="max-w-sm px-6">
                <Flame className="mx-auto mb-4 text-neutral-400" />
                <p className="text-sm font-medium text-neutral-700">
                  Les données détaillées peuvent être connectées ensuite avec
                  Clarity API, Vercel Analytics ou Google Analytics.
                </p>
              </div>
            </div>
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