// src/app/api/admin/analytics/export/route.ts
// CSV export of the visits matching the dashboard's period and filters.
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSessionsForExport, parseFilters, parseRange } from "@/lib/analytics/dashboard";

export const dynamic = "force-dynamic";

function csvCell(value: unknown) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  // Neutralize spreadsheet formulas and quote when needed.
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return /[",\n;]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const range = parseRange(params);
  const opts = { filters: parseFilters(params), mergeLocales: params.merge === "1" };

  try {
    const rows = await getSessionsForExport(range, opts);
    const columns = rows[0] ? Object.keys(rows[0]) : ["started_at"];
    const lines = [
      columns.join(","),
      ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")),
    ];

    return new Response(`﻿${lines.join("\n")}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="visites_${range.fromDay}_${range.toDay}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[ANALYTICS] export", error);
    return NextResponse.json({ error: "Export impossible." }, { status: 500 });
  }
}
