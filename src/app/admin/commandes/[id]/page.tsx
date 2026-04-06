import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import type { Commande } from "@/types/commande";
import CommandeStatusSelect from "@/components/admin/CommandeStatusSelect";
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
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(date));
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
    <div className="grid gap-2 border-b border-neutral-100 py-4 md:grid-cols-[180px_minmax(0,1fr)]">
      <dt className="text-sm font-medium text-neutral-500">{label}</dt>

      <dd className="min-w-0 text-neutral-900">
        {!value ? (
          "—"
        ) : isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="break-all text-amber-700 underline decoration-amber-300 underline-offset-4 transition hover:text-amber-800"
          >
            {value}
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
    <main className="min-h-screen bg-[#fffaf6] px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/admin/commandes"
              className="text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
            >
              ← Retour aux commandes
            </Link>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
              Commande #{commande.id}
            </h1>

            <p className="mt-2 text-neutral-600">
              Détail complet de la demande client.
            </p>
          </div>

          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ring-1 ring-inset ${getCommandeStatusClasses(
              commande.status
            )}`}
          >
            {getCommandeStatusLabel(commande.status)}
          </span>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Informations client
            </h2>

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
              <InfoRow label="Message" value={commande.message} />
              <InfoRow
                label="Image URL"
                value={commande.image_url}
                isLink
              />
              <InfoRow
                label="Fichier URL"
                value={commande.file_url}
                isLink
              />
            </dl>

            {commande.image_url ? (
              <div className="mt-8">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-medium text-neutral-500">
                    Aperçu image
                  </h3>

                  <a
                    href={commande.image_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-amber-700 transition hover:text-amber-800"
                  >
                    Ouvrir l’image
                  </a>
                </div>

                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={commande.image_url}
                    alt={`Commande ${commande.id}`}
                    className="h-[240px] w-full object-contain md:h-[300px] xl:h-[360px]"
                  />
                </div>
              </div>
            ) : null}
          </section>

          <aside className="space-y-6 xl:sticky xl:top-24">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">
                Changer le statut
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Mettez à jour l’avancement de cette commande.
              </p>

              <div className="mt-5">
                <CommandeStatusSelect
                  commandeId={commande.id}
                  initialStatus={commande.status}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
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