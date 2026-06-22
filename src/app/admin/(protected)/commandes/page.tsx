// src/app/admin/(protected)/commandes/page.tsx

import { Suspense } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import DashboardCommandes from "@/components/admin/DashboardCommandes";
import type { Commande } from "@/types/commande";

export const dynamic = "force-dynamic";

async function CommandesData() {
  const t0 = Date.now();
  const { data, error } = await supabaseAdmin
    .from("commandes")
    .select(
      `
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
    `
    )
    .order("created_at", { ascending: false })
    .limit(10);

  console.log(`[commandes] DB query: ${Date.now() - t0}ms`);

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
        Erreur lors du chargement des commandes : {error.message}
      </div>
    );
  }

  return <DashboardCommandes commandes={(data ?? []) as Commande[]} />;
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
