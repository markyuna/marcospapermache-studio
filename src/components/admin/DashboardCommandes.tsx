"use client";

import { useEffect, useMemo, useState } from "react";
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
  ExternalLink,
  Filter,
  FolderKanban,
  Mail,
  PauseCircle,
  Search,
  Sparkles,
  Trash2,
  X,
  XCircle,
} from "lucide-react";

import type { Commande } from "@/types/commande";
import CommandeStatusSelect from "@/components/admin/CommandeStatusSelect";
import type { CommandeStatus } from "@/lib/commandes-status";

type Props = {
  commandes: Commande[];
};

type ImagePreviewState = {
  url: string;
  alt: string;
} | null;

const statusOptions = [
  { value: "all", label: "Tous" },
  { value: "nouvelle", label: "Nouvelle" },
  { value: "en_cours", label: "En cours" },
  { value: "en_attente", label: "En attente" },
  { value: "terminee", label: "Terminée" },
  { value: "annulee", label: "Annulée" },
] as const;

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
      return <Sparkles className="h-3.5 w-3.5" />;
    case "en_cours":
      return <CircleDashed className="h-3.5 w-3.5" />;
    case "en_attente":
      return <PauseCircle className="h-3.5 w-3.5" />;
    case "terminee":
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    case "annulee":
      return <XCircle className="h-3.5 w-3.5" />;
    default:
      return <Clock3 className="h-3.5 w-3.5" />;
  }
}

function useIsDesktop(breakpoint = 1280) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= breakpoint);

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);

  return isDesktop;
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

function ExpandableText({
  text,
  previewChars = 110,
  previewCharsMobile = 180,
}: {
  text: string | null | undefined;
  previewChars?: number;
  previewCharsMobile?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const value = (text ?? "").trim();

  if (!value) {
    return <p className="text-sm leading-6 text-neutral-500">Aucun message</p>;
  }

  const shouldCollapse = value.length > previewChars || value.includes("\n");

  const desktopText =
    !expanded && shouldCollapse
      ? `${value.slice(0, previewChars).trimEnd()}…`
      : value;

  const mobileText =
    !expanded && value.length > previewCharsMobile
      ? `${value.slice(0, previewCharsMobile).trimEnd()}…`
      : value;

  return (
    <div>
      <p className="hidden whitespace-pre-line text-sm leading-6 text-neutral-600 xl:block">
        {desktopText}
      </p>

      <p className="whitespace-pre-line text-sm leading-6 text-neutral-700 xl:hidden">
        {mobileText}
      </p>

      {shouldCollapse || value.length > previewCharsMobile ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-3 inline-flex rounded-full border border-orange-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-orange-700 transition hover:bg-orange-50"
        >
          {expanded ? "Voir moins" : "Voir plus"}
        </button>
      ) : null}
    </div>
  );
}

function ImageLightbox({
  preview,
  onClose,
}: {
  preview: ImagePreviewState;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!preview) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [preview, onClose]);

  if (!preview) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl rounded-[2rem] border border-white/10 bg-[#111111] p-3 shadow-2xl md:p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-white/80">Aperçu grand format</p>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/15"
            aria-label="Fermer l’aperçu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex max-h-[82vh] min-h-[420px] items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#0b0b0c]">
          <div className="relative h-[82vh] w-full">
            <Image
              src={preview.url}
              alt={preview.alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <a
            href={preview.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
          >
            <ExternalLink className="h-4 w-4" />
            Ouvrir l’image
          </a>
        </div>
      </div>
    </div>
  );
}

function MobileCommandeCard({
  commande,
  currentStatus,
  deletingId,
  onDelete,
  onPreview,
  onStatusChange,
}: {
  commande: Commande;
  currentStatus: CommandeStatus;
  deletingId: number | null;
  onDelete: (commandeId: number) => void;
  onPreview: (preview: { url: string; alt: string }) => void;
  onStatusChange: (commandeId: number, status: CommandeStatus) => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-5 p-5 sm:flex-row">
        <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-2xl bg-neutral-100 sm:h-40 sm:w-44">
          {commande.image_url ? (
            <>
              <Image
                src={commande.image_url}
                alt={commande.name || `Commande ${commande.id}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 176px"
              />

              <button
                type="button"
                onClick={() =>
                  onPreview({
                    url: commande.image_url!,
                    alt: commande.name || `Commande ${commande.id}`,
                  })
                }
                className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/55 via-black/10 to-transparent p-4 text-white"
              >
                <span className="rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-medium backdrop-blur-sm">
                  Voir en grand
                </span>
              </button>
            </>
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
                getStatusStyles(currentStatus),
              )}
            >
              {getStatusIcon(currentStatus)}
              {getStatusLabel(currentStatus)}
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
              <div className="mt-2">
                <ExpandableText
                  text={commande.message}
                  previewChars={140}
                  previewCharsMobile={220}
                />
              </div>
            </div>
          ) : null}

          <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              Changer le statut
            </p>
            <div className="mt-3">
              <CommandeStatusSelect
                commandeId={commande.id}
                initialStatus={currentStatus}
                onStatusChange={(nextStatus) =>
                  onStatusChange(commande.id, nextStatus)
                }
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/admin/commandes/${commande.id}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
            >
              <Eye className="h-4 w-4" />
              Détail
            </Link>

            {commande.image_url ? (
              <button
                type="button"
                onClick={() =>
                  onPreview({
                    url: commande.image_url!,
                    alt: commande.name || `Commande ${commande.id}`,
                  })
                }
                className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
              >
                <Eye className="h-4 w-4" />
                Voir image
              </button>
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

            <button
              type="button"
              disabled={deletingId === commande.id}
              onClick={() => onDelete(commande.id)}
              className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              {deletingId === commande.id ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopCommandesTable({
  commandes,
  localStatuses,
  deletingId,
  onDelete,
  onPreview,
  onStatusChange,
}: {
  commandes: Commande[];
  localStatuses: Record<number, CommandeStatus>;
  deletingId: number | null;
  onDelete: (commandeId: number) => void;
  onPreview: (preview: { url: string; alt: string }) => void;
  onStatusChange: (commandeId: number, status: CommandeStatus) => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] table-fixed text-left">
          <thead className="bg-[linear-gradient(to_right,#fff4ea,#fffaf6)] text-sm text-neutral-600">
            <tr>
              <th className="w-[130px] px-4 py-4 font-medium">Image</th>
              <th className="w-[270px] px-4 py-4 font-medium">Client</th>
              <th className="w-[180px] px-4 py-4 font-medium">Projet</th>
              <th className="w-[130px] px-4 py-4 font-medium">Budget</th>
              <th className="w-[100px] px-4 py-4 font-medium">Date</th>
              <th className="w-[220px] px-4 py-4 font-medium">Statut</th>
              <th className="w-[170px] px-4 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {commandes.map((commande) => {
              const currentStatus = localStatuses[commande.id] ?? "nouvelle";

              return (
                <tr
                  key={commande.id}
                  className="border-t border-neutral-100 align-top transition hover:bg-orange-50/20"
                >
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-neutral-100">
                        {commande.image_url ? (
                          <Image
                            src={commande.image_url}
                            alt={commande.name || `Commande ${commande.id}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-2 text-center text-[11px] text-neutral-400">
                            Pas d’image
                          </div>
                        )}
                      </div>

                      {commande.image_url ? (
                        <button
                          type="button"
                          onClick={() =>
                            onPreview({
                              url: commande.image_url!,
                              alt: commande.name || `Commande ${commande.id}`,
                            })
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Agrandir
                        </button>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="max-w-[250px]">
                      <p className="truncate text-[15px] font-semibold text-neutral-900">
                        {commande.name}
                      </p>
                      <p className="mt-1 break-all text-sm text-neutral-500">
                        {commande.email}
                      </p>

                      {commande.message ? (
                        <div className="mt-3 rounded-2xl bg-neutral-50 p-3">
                          <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                            Message client
                          </p>
                          <ExpandableText
                            text={commande.message}
                            previewChars={95}
                            previewCharsMobile={180}
                          />
                        </div>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="max-w-[170px]">
                      <p className="text-sm font-medium text-neutral-800">
                        {commande.project_type || "Non précisé"}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        {commande.dimensions || "Dimensions non précisées"}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700">
                      <Euro className="h-3.5 w-3.5" />
                      {commande.budget || "Non précisé"}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm leading-6 text-neutral-600">
                    {formatDate(commande.created_at)}
                  </td>

                  <td className="px-4 py-4">
                    <div className="w-[195px] space-y-2.5">
                      <span
                        className={clsx(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                          getStatusStyles(currentStatus),
                        )}
                      >
                        {getStatusIcon(currentStatus)}
                        {getStatusLabel(currentStatus)}
                      </span>

                      <CommandeStatusSelect
                        commandeId={commande.id}
                        initialStatus={currentStatus}
                        onStatusChange={(nextStatus) =>
                          onStatusChange(commande.id, nextStatus)
                        }
                      />
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex max-w-[160px] flex-col gap-2">
                      <Link
                        href={`/admin/commandes/${commande.id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Détail
                      </Link>

                      {commande.image_url ? (
                        <button
                          type="button"
                          onClick={() =>
                            onPreview({
                              url: commande.image_url!,
                              alt: commande.name || `Commande ${commande.id}`,
                            })
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Image
                        </button>
                      ) : null}

                      {commande.file_url ? (
                        <Link
                          href={commande.file_url}
                          target="_blank"
                          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Fichier
                        </Link>
                      ) : null}

                      <button
                        type="button"
                        disabled={deletingId === commande.id}
                        onClick={() => onDelete(commande.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deletingId === commande.id ? "Suppression..." : "Supprimer"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {commandes.length === 0 && (
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
  );
}

export default function DashboardCommandes({ commandes }: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [imagePreview, setImagePreview] = useState<ImagePreviewState>(null);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const isDesktop = useIsDesktop();

  const [localStatuses, setLocalStatuses] = useState<Record<number, CommandeStatus>>(
    () =>
      Object.fromEntries(
        commandes.map((commande) => [
          commande.id,
          (commande.status ?? "nouvelle") as CommandeStatus,
        ]),
      ),
  );

  const normalizedQuery = query.trim().toLowerCase();

  const visibleCommandes = useMemo(() => {
    const deletedIdsSet = new Set(deletedIds);
    return commandes.filter((commande) => !deletedIdsSet.has(commande.id));
  }, [commandes, deletedIds]);

  const filteredCommandes = useMemo(() => {
    return visibleCommandes.filter((commande) => {
      const searchable = [
        commande.name,
        commande.email,
        commande.project_type ?? "",
        commande.budget ?? "",
        commande.dimensions ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = searchable.includes(normalizedQuery);
      const currentStatus = localStatuses[commande.id] ?? "nouvelle";
      const matchesStatus =
        statusFilter === "all" || currentStatus === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [visibleCommandes, normalizedQuery, statusFilter, localStatuses]);

  const stats = useMemo(() => {
    const source = visibleCommandes;

    return {
      total: source.length,
      nouvelles: source.filter(
        (commande) => (localStatuses[commande.id] ?? "nouvelle") === "nouvelle",
      ).length,
      enCours: source.filter(
        (commande) => (localStatuses[commande.id] ?? "nouvelle") === "en_cours",
      ).length,
      terminees: source.filter(
        (commande) => (localStatuses[commande.id] ?? "nouvelle") === "terminee",
      ).length,
    };
  }, [visibleCommandes, localStatuses]);

  function updateLocalStatus(commandeId: number, status: CommandeStatus) {
    setLocalStatuses((prev) => ({
      ...prev,
      [commandeId]: status,
    }));
  }

  async function handleDelete(commandeId: number) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette commande ? Cette action est irréversible.",
    );

    if (!confirmed) return;

    try {
      setDeletingId(commandeId);

      const response = await fetch(`/api/admin/commandes/${commandeId}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Impossible de supprimer la commande.");
      }

      setDeletedIds((prev) => [...prev, commandeId]);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant la suppression.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
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

        {isDesktop === null ? (
          <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="grid gap-4 rounded-2xl border border-neutral-100 p-4 md:grid-cols-[100px_1.2fr_0.8fr_0.6fr]"
                >
                  <div className="h-20 w-20 rounded-2xl bg-neutral-200" />
                  <div className="space-y-3">
                    <div className="h-4 w-40 rounded-full bg-neutral-200" />
                    <div className="h-4 w-56 rounded-full bg-neutral-100" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-32 rounded-full bg-neutral-200" />
                    <div className="h-4 w-24 rounded-full bg-neutral-100" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-10 w-28 rounded-2xl bg-neutral-200" />
                    <div className="h-10 w-24 rounded-2xl bg-neutral-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : isDesktop ? (
          <DesktopCommandesTable
            commandes={filteredCommandes}
            localStatuses={localStatuses}
            deletingId={deletingId}
            onDelete={handleDelete}
            onPreview={(preview) => setImagePreview(preview)}
            onStatusChange={updateLocalStatus}
          />
        ) : (
          <div className="grid gap-4">
            {filteredCommandes.map((commande) => (
              <MobileCommandeCard
                key={commande.id}
                commande={commande}
                currentStatus={localStatuses[commande.id] ?? "nouvelle"}
                deletingId={deletingId}
                onDelete={handleDelete}
                onPreview={(preview) => setImagePreview(preview)}
                onStatusChange={updateLocalStatus}
              />
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
        )}
      </div>

      <ImageLightbox
        preview={imagePreview}
        onClose={() => setImagePreview(null)}
      />
    </>
  );
}