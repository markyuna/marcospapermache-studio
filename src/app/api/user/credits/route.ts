import { NextResponse } from "next/server";

import { getAuthenticatedUser, isAdminEmail } from "@/lib/admin-auth";
import { FREE_GENERATION_LIMIT, getUserGenerationQuota } from "@/lib/user-credits";

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  if (isAdminEmail(user.email)) {
    return NextResponse.json({ unlimited: true });
  }

  const quota = await getUserGenerationQuota(user.id);

  return NextResponse.json({
    paidCredits: quota.paidCredits,
    freeRemaining: quota.freeRemaining,
    freeLimit: FREE_GENERATION_LIMIT,
    imagesGenerated: quota.imagesGenerated,
    paymentStatus: quota.paymentStatus,
  });
}
