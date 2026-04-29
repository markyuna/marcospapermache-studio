// src/app/admin/(protected)/commandes/page.tsx

import { supabaseAdmin } from "@/lib/supabase";
import DashboardCommandes from "@/components/admin/DashboardCommandes";
import type { Commande } from "@/types/commande";

export const dynamic = "force-dynamic";

type GetCommandesResult = {
  commandes: Commande[];
  errorMessage: string | null;
};

function getReadableError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const possibleError = error as {
      message?: unknown;
      details?: unknown;
      hint?: unknown;
      code?: unknown;
    };

    const message =
      typeof possibleError.message === "string"
        ? possibleError.message
        : null;

    const details =
      typeof possibleError.details === "string"
        ? possibleError.details
        : null;

    const hint =
      typeof possibleError.hint === "string" ? possibleError.hint : null;

    const code =
      typeof possibleError.code === "string" ? possibleError.code : null;

    return [message, details, hint, code].filter(Boolean).join(" — ");
  }

  return "Impossible de charger les commandes.";
}

async function getCommandes(): Promise<GetCommandesResult> {
  try {
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

    if (error) {
      const errorMessage = getReadableError(error);

      console.log("Supabase commandes error:", {
        message: errorMessage,
        raw: Object.getOwnPropertyNames(error).reduce<Record<string, unknown>>(
          (acc, key) => {
            const errorRecord = error as unknown as Record<string, unknown>;
            acc[key] = errorRecord[key];
            return acc;
          },
          {}
        ),
      });

      return {
        commandes: [],
        errorMessage:
          errorMessage || "Impossible de charger les commandes depuis Supabase.",
      };
    }

    return {
      commandes: (data ?? []) as Commande[],
      errorMessage: null,
    };
  } catch (error) {
    const errorMessage = getReadableError(error);

    console.log("Unexpected commandes error:", {
      message: errorMessage,
      error,
    });

    return {
      commandes: [],
      errorMessage:
        errorMessage || "Erreur inattendue lors du chargement des commandes.",
    };
  }
}

export default async function AdminCommandesPage() {
  const { commandes, errorMessage } = await getCommandes();

  return (
    <main className="min-h-screen bg-[linear-gradient(to_bottom,#fffaf5,#fff7f1,#ffffff)] px-4 py-8 md:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {errorMessage ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            Erreur lors du chargement des commandes : {errorMessage}
          </div>
        ) : (
          <DashboardCommandes commandes={commandes} />
        )}
      </div>
    </main>
  );
}