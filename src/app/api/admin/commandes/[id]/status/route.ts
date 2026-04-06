import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  isCommandeStatus,
  type CommandeStatus,
} from "@/lib/commandes-status";

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
    const rawStatus = body?.status;

    if (typeof rawStatus !== "string" || !isCommandeStatus(rawStatus)) {
      return NextResponse.json(
        { error: "Statut invalide." },
        { status: 400 }
      );
    }

    const status: CommandeStatus = rawStatus;

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

    return NextResponse.json({
      success: true,
      commande: data,
    });
  } catch (error) {
    console.error("PATCH /api/admin/commandes/[id]/status error:", error);

    return NextResponse.json(
      { error: "Erreur serveur inattendue." },
      { status: 500 }
    );
  }
}