// Keepalive: the proxy renews the activity cookie on every request that goes
// through it, so the client only has to call this while the user is active.
import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/admin-auth";

export async function POST() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Session expirée." }, { status: 401 });
  }

  return new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}
