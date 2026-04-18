import { supabaseAdmin } from "@/lib/supabase";
import DashboardCommandes from "@/components/admin/DashboardCommandes";
import type { Commande } from "@/types/commande";

export const dynamic = "force-dynamic";

async function getCommandes(): Promise<{
  commandes: Commande[];
  errorMessage: string | null;
}> {
  try {
    console.time("getCommandes:query");

    const { data, error } = await supabaseAdmin
      .from("commandes")
      .select(`
        id,
        name,
        email,
        project_type,
        message,
        budget,
        dimensions,
        status,
        created_at,
        image_url,
        file_url
      `)
      .order("created_at", { ascending: false })
      .limit(30);

    console.timeEnd("getCommandes:query");

    if (error) {
      throw error;
    }

    return {
      commandes: (data ?? []) as Commande[],
      errorMessage: null,
    };
  } catch (error) {
    console.error("Error loading commandes:", error);

    return {
      commandes: [],
      errorMessage:
        error instanceof Error
          ? error.message
          : "Impossible de charger les commandes.",
    };
  }
}

export default async function AdminCommandesPage() {
  const { commandes, errorMessage } = await getCommandes();

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-[linear-gradient(to_bottom,#fffaf5,#fff7f1,#ffffff)] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            Erreur lors du chargement des commandes : {errorMessage}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(to_bottom,#fffaf5,#fff7f1,#ffffff)] px-4 py-8 md:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <DashboardCommandes commandes={commandes} />
      </div>
    </main>
  );
}