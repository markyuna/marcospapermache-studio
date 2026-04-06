import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { CommandeStatus } from "@/types/commande";

const ALLOWED_STATUSES: CommandeStatus[] = [
  "nouvelle",
  "en_cours",
  "terminee",
  "livree",
  "annulee",
];

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const numericId = Number(id);

    if (!Number.isInteger(numericId)) {
      return NextResponse.json(
        { error: "ID de commande invalide." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const status = body?.status as CommandeStatus | undefined;

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("commandes")
      .update({ status })
      .eq("id", numericId)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Impossible de mettre à jour le statut." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, commande: data });
  } catch (error) {
    console.error("PATCH /api/admin/commandes/[id]/status error:", error);

    return NextResponse.json(
      { error: "Erreur serveur inattendue." },
      { status: 500 }
    );
  }
}