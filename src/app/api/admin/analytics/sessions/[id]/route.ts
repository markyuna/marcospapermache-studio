// src/app/api/admin/analytics/sessions/[id]/route.ts
// Page-by-page journey of one visit (visit explorer in the dashboard).
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSessionJourney } from "@/lib/analytics/dashboard";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await context.params;
  if (!UUID.test(id)) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  try {
    return NextResponse.json(
      { events: await getSessionJourney(id) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[ANALYTICS] journey", error);
    return NextResponse.json({ error: "Parcours indisponible." }, { status: 500 });
  }
}
