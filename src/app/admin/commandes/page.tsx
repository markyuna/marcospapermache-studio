import { supabaseAdmin } from "@/lib/supabase";
import CommandesTable from "@/components/admin/CommandesTable";
import type { Commande } from "@/types/commande";

export const dynamic = "force-dynamic";

export default async function AdminCommandesPage() {
  const { data, error } = await supabaseAdmin
    .from("commandes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-[#fffaf6] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            Erreur lors du chargement des commandes : {error.message}
          </div>
        </div>
      </main>
    );
  }

  const commandes = (data ?? []) as Commande[];

  return (
    <main className="min-h-screen bg-[#fffaf6] px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-400">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
            Commandes
          </h1>
          <p className="mt-2 text-neutral-600">
            Gérez les demandes clients et suivez leur statut.
          </p>
        </div>

        <CommandesTable commandes={commandes} />
      </div>
    </main>
  );
}