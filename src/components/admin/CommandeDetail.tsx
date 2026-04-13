"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  ExternalLink,
  Loader2,
  Mail,
  Trash2,
} from "lucide-react";

import type { CommandeStatus } from "@/lib/commandes-status";
import {
  COMMANDE_STATUS_OPTIONS,
  getCommandeStatusClasses,
  getCommandeStatusLabel,
  isCommandeStatus,
} from "@/lib/commandes-status";

type Commande = {
  id: string | number;
  name: string;
  email: string;
  project_type: string | null;
  dimensions: string | null;
  budget: string | null;
  message: string | null;
  image_url: string | null;
  file_url: string | null;
  status: string | null;
  created_at: string;
};

type FeedbackState =
  | {
      type: "success" | "error";
      message: string;
    }
  | null;

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

export default function CommandeDetail({
  commande,
}: {
  commande: Commande;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const normalizedStatus: CommandeStatus = useMemo(() => {
    return commande.status && isCommandeStatus(commande.status)
      ? commande.status
      : "nouvelle";
  }, [commande.status]);

  const [status, setStatus] = useState<CommandeStatus>(normalizedStatus);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const previewImage = commande.image_url || commande.file_url;

  async function updateStatus() {
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/commandes/${commande.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Erreur mise à jour du statut.");
      }

      setFeedback({
        type: "success",
        message: "Statut mis à jour avec succès.",
      });

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue.",
      });
    }
  }

  async function deleteCommande() {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette commande ? Cette action est irréversible.",
    );

    if (!confirmed) return;

    setFeedback(null);
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/commandes/${commande.id}`, {
        method: "DELETE",
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.error || "Erreur lors de la suppression.");
      }

      router.push("/admin/commandes");
      router.refresh();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue pendant la suppression.",
      });
      setIsDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-orange-500">
              Commande client
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
              Commande #{commande.id}
            </h1>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Consultation complète de la demande et mise à jour rapide du suivi.
            </p>
          </div>

          <span
            className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium ${getCommandeStatusClasses(
              status,
            )}`}
          >
            {getCommandeStatusLabel(status)}
          </span>
        </div>
      </div>

      {previewImage ? (
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-neutral-100">
            <div className="relative h-[320px] w-full md:h-[480px]">
              <Image
                src={previewImage}
                alt={`Commande ${commande.id}`}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 960px"
                priority
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {commande.image_url ? (
              <a
                href={commande.image_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
              >
                <ExternalLink className="h-4 w-4" />
                Ouvrir l’image
              </a>
            ) : null}

            {commande.file_url ? (
              <a
                href={commande.file_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
              >
                <Download className="h-4 w-4" />
                Ouvrir le fichier
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-semibold text-neutral-900">
              Informations de la commande
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  Client
                </p>
                <p className="mt-1 font-medium text-neutral-900">
                  {commande.name || "—"}
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  Email
                </p>
                <p className="mt-1 break-all font-medium text-neutral-900">
                  {commande.email || "—"}
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  Projet
                </p>
                <p className="mt-1 font-medium text-neutral-900">
                  {commande.project_type || "Non précisé"}
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  Dimensions
                </p>
                <p className="mt-1 font-medium text-neutral-900">
                  {commande.dimensions || "Non précisées"}
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  Budget
                </p>
                <p className="mt-1 font-medium text-neutral-900">
                  {commande.budget || "Non précisé"}
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  Date
                </p>
                <p className="mt-1 font-medium text-neutral-900">
                  {formatDate(commande.created_at)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-semibold text-neutral-900">
              Message du client
            </h2>

            <div className="mt-4 rounded-2xl bg-[linear-gradient(to_bottom_right,#fffaf6,#fff3e8)] p-5">
              <p className="whitespace-pre-line text-sm leading-7 text-neutral-700">
                {commande.message?.trim() || "Aucun message fourni."}
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-semibold text-neutral-900">
              Gestion du statut
            </h2>

            <div className="mt-4 space-y-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CommandeStatus)}
                disabled={isPending || isDeleting}
                className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium outline-none transition ${getCommandeStatusClasses(
                  status,
                )} disabled:cursor-not-allowed disabled:opacity-70`}
              >
                {COMMANDE_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={updateStatus}
                disabled={isPending || isDeleting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Enregistrer le statut
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-semibold text-neutral-900">
              Actions rapides
            </h2>

            <div className="mt-4 space-y-3">
              <a
                href={`mailto:${commande.email}?subject=Suivi de votre commande #${commande.id}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                <Mail className="h-4 w-4" />
                Envoyer un email
              </a>

              <button
                type="button"
                onClick={deleteCommande}
                disabled={isDeleting || isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Supprimer la commande
                  </>
                )}
              </button>
            </div>
          </div>

          {feedback ? (
            <div
              className={[
                "rounded-2xl border px-4 py-3 text-sm",
                feedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700",
              ].join(" ")}
            >
              <div className="flex items-start gap-2">
                {feedback.type === "success" ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}