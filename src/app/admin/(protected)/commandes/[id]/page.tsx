import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  ExternalLink,
  FolderKanban,
  Mail,
  Palette,
  Ruler,
  Wallet,
} from "lucide-react";

import { supabaseAdmin } from "@/lib/supabase";
import type { Commande } from "@/types/commande";
import CommandeStatusSelect from "@/components/admin/CommandeStatusSelect";
import AdminCommandeImagePreview from "@/components/admin/AdminCommandeImagePreview";
import ExpandableMessage from "@/components/admin/ExpandableMessage";
import {
  getCommandeStatusClasses,
  getCommandeStatusLabel,
} from "@/lib/commandes-status";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(to_bottom_right,#fff1e6,#ffe2c7)] text-orange-700">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
            {label}
          </p>
          <p className="mt-2 break-words text-sm font-medium leading-6 text-neutral-900">
            {value || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  isLink = false,
}: {
  label: string;
  value: string | null | undefined;
  isLink?: boolean;
}) {
  return (
    <div className="grid gap-2 border-b border-neutral-100 py-4 md:grid-cols-[190px_minmax(0,1fr)]">
      <dt className="text-sm font-medium text-neutral-500">{label}</dt>

      <dd className="min-w-0 text-neutral-900">
        {!value ? (
          "—"
        ) : isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 break-all text-amber-700 underline decoration-amber-300 underline-offset-4 transition hover:text-amber-800"
          >
            <span>{value}</span>
            <ExternalLink className="h-4 w-4 shrink-0" />
          </a>
        ) : (
          <span className="break-words">{value}</span>
        )}
      </dd>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function AdminCommandeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId)) {
    notFound();
  }

  const { data, error } = await supabaseAdmin
    .from("commandes")
    .select("*")
    .eq("id", numericId)
    .single();

  if (error || !data) {
    notFound();
  }

  const commande = data as Commande;

  return (
    <main className="min-h-screen bg-[linear-gradient(to_bottom,#fffaf5,#fff7f1,#ffffff)] px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/admin/commandes"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux commandes
            </Link>

            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.32em] text-orange-500">
                Commande client
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
                Commande #{commande.id}
              </h1>

              <p className="mt-2 text-neutral-600">
                Détail complet de la demande et gestion de son avancement.
              </p>
            </div>
          </div>

          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ring-1 ring-inset ${getCommandeStatusClasses(
              commande.status,
            )}`}
          >
            {getCommandeStatusLabel(commande.status)}
          </span>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            icon={<Mail className="h-5 w-5" />}
            label="Client"
            value={commande.email}
          />
          <InfoCard
            icon={<Palette className="h-5 w-5" />}
            label="Projet"
            value={commande.project_type}
          />
          <InfoCard
            icon={<Wallet className="h-5 w-5" />}
            label="Budget"
            value={commande.budget}
          />
          <InfoCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Créée le"
            value={formatDate(commande.created_at)}
          />
        </section>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0 space-y-6">
            <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(to_bottom_right,#fff1e6,#ffe2c7)] text-orange-700">
                  <FolderKanban className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Informations de la commande
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Données transmises par le client
                  </p>
                </div>
              </div>

              <dl className="mt-6">
                <InfoRow label="Nom" value={commande.name} />
                <InfoRow label="Email" value={commande.email} />
                <InfoRow label="Type de projet" value={commande.project_type} />
                <InfoRow label="Dimensions" value={commande.dimensions} />
                <InfoRow label="Budget" value={commande.budget} />
                <InfoRow
                  label="Date de création"
                  value={formatDate(commande.created_at)}
                />
              </dl>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                Message du client
              </h2>

              <div className="mt-4 rounded-2xl bg-[linear-gradient(to_bottom_right,#fffaf6,#fff3e8)] p-5">
                <ExpandableMessage
                  text={commande.message || ""}
                  emptyText="Aucun message fourni."
                  previewLines={5}
                />
              </div>
            </div>

            {commande.image_url ? (
              <AdminCommandeImagePreview
                imageUrl={commande.image_url}
                alt={`Commande ${commande.id}`}
              />
            ) : null}
          </section>

          <aside className="space-y-6 xl:sticky xl:top-24">
            <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <h2 className="text-lg font-semibold text-neutral-900">
                Changer le statut
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Mettez à jour l’avancement de cette commande en quelques clics.
              </p>

              <div className="mt-5">
                <CommandeStatusSelect
                  commandeId={commande.id}
                  initialStatus={commande.status}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <h2 className="text-lg font-semibold text-neutral-900">
                Résumé rapide
              </h2>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-neutral-400">
                    Nom client
                  </p>
                  <p className="mt-1 text-sm font-medium text-neutral-900">
                    {commande.name || "—"}
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-neutral-400">
                    Dimensions
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-sm font-medium text-neutral-900">
                    <Ruler className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                    <span>{commande.dimensions || "Non précisées"}</span>
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-neutral-400">
                    Pièce jointe
                  </p>
                  <p className="mt-1 text-sm font-medium text-neutral-900">
                    {commande.file_url ? "Disponible" : "Aucun fichier"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <h2 className="text-lg font-semibold text-neutral-900">
                Actions rapides
              </h2>

              <div className="mt-4 space-y-3">
                <a
                  href={`mailto:${commande.email}?subject=Suivi de votre commande #${commande.id}`}
                  className="flex w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-center text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
                >
                  Envoyer un email
                </a>

                {commande.file_url ? (
                  <a
                    href={commande.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-center text-sm font-medium text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
                  >
                    <Download className="h-4 w-4" />
                    Ouvrir le fichier
                  </a>
                ) : null}

                <Link
                  href="/admin/commandes"
                  className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] hover:shadow-md"
                >
                  Retour à la liste
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}