import { prisma } from "@/lib/prisma";

export const CREDIT_PACKAGE = {
  credits: 3,
  priceEurCents: 100,
};

export async function getUserCredits(supabaseUserId: string): Promise<number> {
  const record = await prisma.userCredits.findUnique({
    where: { supabaseUserId },
  });

  return record?.paidCredits ?? 0;
}

export async function tryConsumeUserCredit(
  supabaseUserId: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const record = await prisma.userCredits.findUnique({
    where: { supabaseUserId },
  });

  if (!record || record.paidCredits <= 0) {
    return { allowed: false, remaining: 0 };
  }

  const updated = await prisma.userCredits.update({
    where: { supabaseUserId },
    data: { paidCredits: { decrement: 1 } },
  });

  return { allowed: true, remaining: updated.paidCredits };
}

export async function addUserCredits(
  supabaseUserId: string,
  amount: number,
): Promise<number> {
  const updated = await prisma.userCredits.upsert({
    where: { supabaseUserId },
    create: { supabaseUserId, paidCredits: amount },
    update: { paidCredits: { increment: amount } },
  });

  return updated.paidCredits;
}
