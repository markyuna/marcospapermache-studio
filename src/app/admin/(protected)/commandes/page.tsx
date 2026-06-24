// src/app/admin/(protected)/commandes/page.tsx

import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { pool } from "@/lib/prisma";
import DashboardCommandes from "@/components/admin/DashboardCommandes";
import type { Commande } from "@/types/commande";

export const dynamic = "force-dynamic";

const getCachedCommandes = unstable_cache(
  async (): Promise<Commande[]> => {
    const result = await pool.query<{
      id: number;
      name: string;
      email: string;
      project_type: string | null;
      message: string | null;
      budget: string | null;
      dimensions: string | null;
      status: string | null;
      created_at: Date;
      image_url: string | null;
      file_url: string | null;
    }>(
      `SELECT id, name, email, project_type, message, budget, dimensions,
              status, created_at, image_url, file_url
       FROM commandes
       ORDER BY created_at DESC
       LIMIT 100`
    );
    return result.rows.map((r) => ({
      ...r,
      created_at: r.created_at.toISOString(),
    })) as Commande[];
  },
  ["admin-commandes"],
  { revalidate: 60, tags: ["commandes"] }
);

async function CommandesData() {
  let rows: Commande[];
  try {
    rows = await getCachedCommandes();
  } catch (err) {
    console.error("[commandes] DB query error:", err);
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
        Erreur lors du chargement des commandes.
      </div>
    );
  }

  return <DashboardCommandes commandes={rows} />;
}

function CommandesSkeleton() {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="animate-pulse space-y-4">
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
  );
}

export default function AdminCommandesPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(to_bottom,#fffaf5,#fff7f1,#ffffff)] px-4 py-8 md:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={<CommandesSkeleton />}>
          <CommandesData />
        </Suspense>
      </div>
    </main>
  );
}
