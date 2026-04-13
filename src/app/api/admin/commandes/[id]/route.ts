import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const numericId = Number(id);

    if (!Number.isInteger(numericId)) {
      return NextResponse.json(
        { error: "Identifiant invalide." },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin
      .from("commandes")
      .delete()
      .eq("id", numericId);

    if (error) {
      return NextResponse.json(
        { error: error.message || "Suppression impossible." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/commandes/[id] error:", error);

    return NextResponse.json(
      { error: "Erreur serveur pendant la suppression." },
      { status: 500 },
    );
  }
}