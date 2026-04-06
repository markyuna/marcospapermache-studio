import { supabaseAdmin } from "@/lib/supabase";
import DashboardCommandes from "@/components/admin/DashboardCommandes";
import type { Commande } from "@/types/commande";

export const dynamic = "force-dynamic";

export default async function AdminCommandesPage() {
  const { data, error } = await supabaseAdmin
    .from("commandes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-[linear-gradient(to_bottom,#fffaf5,#fff7f1,#ffffff)] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            Erreur lors du chargement des commandes : {error.message}
          </div>
        </div>
      </main>
    );
  }

  const commandes = (data ?? []) as Commande[];

  return (
    <main className="min-h-screen bg-[linear-gradient(to_bottom,#fffaf5,#fff7f1,#ffffff)] px-4 py-8 md:px-6 lg:px-10">
      <DashboardCommandes commandes={commandes} />
    </main>
  );
}