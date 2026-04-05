import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "marcospapermache-studio",
    timestamp: new Date().toISOString(),
  });
}