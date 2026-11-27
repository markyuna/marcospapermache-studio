// src/app/api/admin/analytics/realtime/route.ts
// Live visitors and the latest visits, polled by the dashboard every 30 s.
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getRealtime } from "@/lib/analytics/dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    return NextResponse.json(await getRealtime(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[ANALYTICS] realtime", error);
    return NextResponse.json({ error: "Données temps réel indisponibles." }, { status: 500 });
  }
}
