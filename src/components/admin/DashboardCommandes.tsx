"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
  CheckCircle2,
  CircleDashed,
  Clock3,
  Download,
  Eye,
  Euro,
  Filter,
  FolderKanban,
  Mail,
  PauseCircle,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";

import type { Commande } from "@/types/commande";

type Props = {
  commandes: Commande[];
};

const statusOptions = [
  { value: "all", label: "Tous" },
  { value: "nouvelle", label: "Nouvelle" },
  { value: "en_cours", label: "En cours" },
  { value: "en_attente", label: "En attente" },
  { value: "terminee", label: "Terminée" },
  { value: "annulee", label: "Annulée" },
];

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function getStatusLabel(status: string | null) {
  switch (status) {
    case "nouvelle":
      return "Nouvelle";
    case "en_cours":
      return "En cours";
    case "en_attente":
      return "En attente";
    case "terminee":
      return "Terminée";
    case "annulee":
      return "Annulée";
    default:
      return "Nouvelle";
  }
}

function getStatusStyles(status: string | null) {
  switch (status) {
    case "nouvelle":
      return "border-amber-200 bg-amber-100 text-amber-800";
    case "en_cours":
      return "border-blue-200 bg-blue-100 text-blue-800";
    case "en_attente":
      return "border-violet-200 bg-violet-100 text-violet-800";
    case "terminee":
      return "border-emerald-200 bg-emerald-100 text-emerald-800";
    case "annulee":
      return "border-rose-200 bg-rose-100 text-rose-800";
    default:
      return "border-neutral-200 bg-neutral-100 text-neutral-700";
  }
}

function getStatusIcon(status: string | null) {
  switch (status) {
    case "nouvelle":
      return <Sparkles className="h-4 w-4" />;
    case "en_cours":
      return <CircleDashed className="h-4 w-4" />;
    case "en_attente":
      return <PauseCircle className="h-4 w-4" />;
    case "terminee":
      return <CheckCircle2 className="h-4 w-4" />;
    case "annulee":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock3 className="h-4 w-4" />;
  }
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            {value}
          </p>
          <p className="mt-2 text-xs text-neutral-500">{subtitle}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(to_bottom_right,#fff1e6,#ffe2c7)] text-orange-700 shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardCommandes({ commandes }: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCommandes = useMemo(() => {
    return commandes.filter((commande) => {
      const searchable = [
        commande.name,
        commande.email,
        commande.project_type ?? "",
        commande.message ?? "",
        commande.budget ?? "",
        commande.dimensions ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = searchable.includes(query.toLowerCase());

      const normalizedStatus = commande.status ?? "nouvelle";
      const matchesStatus =
        statusFilter === "all" || normalizedStatus === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [commandes, query, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: commandes.length,
      nouvelles: commandes.filter(
        (c) => (c.status ?? "nouvelle") === "nouvelle"
      ).length,
      enCours: commandes.filter((c) => c.status === "en_cours").length,
      terminees: commandes.filter((c) => c.status === "terminee").length,
    };
  }, [commandes]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-orange-500">
            Administration
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
            Dashboard commandes
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
            Gérez les demandes clients, filtrez rapidement et visualisez les
            projets dans une interface plus premium.
          </p>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-white/80 px-4 py-3 text-sm text-neutral-600 shadow-sm">
          <span className="font-medium text-neutral-900">
            {filteredCommandes.length}
          </span>{" "}
          résultat{filteredCommandes.length > 1 ? "s" : ""}
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total commandes"
          value={stats.total}
          subtitle="Toutes les demandes"
          icon={<FolderKanban className="h-5 w-5" />}
        />
        <StatCard
          title="Nouvelles"
          value={stats.nouvelles}
          subtitle="À traiter rapidement"
          icon={<Sparkles className="h-5 w-5" />}
        />
        <StatCard
          title="En cours"
          value={stats.enCours}
          subtitle="Projets actifs"
          icon={<Clock3 className="h-5 w-5" />}
        />
        <StatCard
          title="Terminées"
          value={stats.terminees}
          subtitle="Demandes finalisées"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
      </div>

      <div className="mb-6 rounded-3xl border border-white/70 bg-white/85 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, projet, budget..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 w-full rounded-2xl border border-neutral-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3">
              <Filter className="h-4 w-4 text-neutral-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-12 bg-transparent text-sm text-neutral-700 outline-none"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:hidden">
        {filteredCommandes.map((commande) => (
          <div
            key={commande.id}
            className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
          >
            <div className="flex flex-col gap-5 p-5 sm:flex-row">
              <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-neutral-100 sm:h-40 sm:w-44 shrink-0">
                {commande.image_url ? (
                  <Image
                    src={commande.image_url}
                    alt={commande.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 176px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                    Pas d’image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-neutral-900">
                      {commande.name}
                    </h2>
                    <div className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="truncate">{commande.email}</span>
                    </div>
                  </div>

                  <span
                    className={clsx(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                      getStatusStyles(commande.status)
                    )}
                  >
                    {getStatusIcon(commande.status)}
                    {getStatusLabel(commande.status)}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-neutral-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-neutral-400">
                      Projet
                    </p>
                    <p className="mt-1 text-sm font-medium text-neutral-800">
                      {commande.project_type || "Non précisé"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-neutral-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-neutral-400">
                      Budget
                    </p>
                    <p className="mt-1 text-sm font-medium text-neutral-800">
                      {commande.budget || "Non précisé"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-neutral-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-neutral-400">
                      Dimensions
                    </p>
                    <p className="mt-1 text-sm font-medium text-neutral-800">
                      {commande.dimensions || "Non précisées"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-neutral-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-neutral-400">
                      Date
                    </p>
                    <p className="mt-1 text-sm font-medium text-neutral-800">
                      {formatDate(commande.created_at)}
                    </p>
                  </div>
                </div>

                {commande.message ? (
                  <div className="mt-4 rounded-2xl bg-orange-50/70 p-4">
                    <p className="text-xs uppercase tracking-wide text-orange-500">
                      Message
                    </p>
                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-neutral-700">
                      {commande.message}
                    </p>
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-3">
                  {commande.image_url ? (
                    <Link
                      href={commande.image_url}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
                    >
                      <Eye className="h-4 w-4" />
                      Voir image
                    </Link>
                  ) : null}

                  {commande.file_url ? (
                    <Link
                      href={commande.file_url}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
                    >
                      <Download className="h-4 w-4" />
                      Voir fichier
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredCommandes.length === 0 && (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/70 p-10 text-center">
            <p className="text-lg font-medium text-neutral-700">
              Aucune commande trouvée
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Essaie un autre mot-clé ou un autre filtre.
            </p>
          </div>
        )}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)] xl:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left">
            <thead className="bg-[linear-gradient(to_right,#fff4ea,#fffaf6)] text-sm text-neutral-600">
              <tr>
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Projet</th>
                <th className="px-6 py-4 font-medium">Budget</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCommandes.map((commande) => (
                <tr
                  key={commande.id}
                  className="border-t border-neutral-100 align-top transition hover:bg-orange-50/30"
                >
                  <td className="px-6 py-5">
                    <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-neutral-100">
                      {commande.image_url ? (
                        <Image
                          src={commande.image_url}
                          alt={commande.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                          Pas d’image
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="max-w-[240px]">
                      <p className="font-semibold text-neutral-900">
                        {commande.name}
                      </p>
                      <p className="mt-1 break-all text-sm text-neutral-500">
                        {commande.email}
                      </p>
                      {commande.message ? (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
                          {commande.message}
                        </p>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="max-w-[220px]">
                      <p className="font-medium text-neutral-800">
                        {commande.project_type || "Non précisé"}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        {commande.dimensions || "Dimensions non précisées"}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700">
                      <Euro className="h-4 w-4" />
                      {commande.budget || "Non précisé"}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-neutral-600">
                    {formatDate(commande.created_at)}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={clsx(
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
                        getStatusStyles(commande.status)
                      )}
                    >
                      {getStatusIcon(commande.status)}
                      {getStatusLabel(commande.status)}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      {commande.image_url ? (
                        <Link
                          href={commande.image_url}
                          target="_blank"
                          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
                        >
                          <Eye className="h-4 w-4" />
                          Image
                        </Link>
                      ) : null}

                      {commande.file_url ? (
                        <Link
                          href={commande.file_url}
                          target="_blank"
                          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
                        >
                          <Download className="h-4 w-4" />
                          Fichier
                        </Link>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCommandes.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center">
                    <p className="text-lg font-medium text-neutral-700">
                      Aucune commande trouvée
                    </p>
                    <p className="mt-2 text-sm text-neutral-500">
                      Essaie un autre mot-clé ou un autre filtre.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}