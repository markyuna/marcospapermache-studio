import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/admin-auth";
import { getUserCredits } from "@/lib/user-credits";

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const paidCredits = await getUserCredits(user.id);

  return NextResponse.json({ paidCredits });
}
