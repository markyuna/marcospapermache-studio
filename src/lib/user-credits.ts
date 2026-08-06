import { prisma } from "@/lib/prisma";
import {
  CREDIT_PACKAGE,
  FREE_GENERATION_LIMIT,
} from "@/lib/generation-limits";

export { CREDIT_PACKAGE, FREE_GENERATION_LIMIT };

export type GenerationQuota = {
  imagesGenerated: number;
  freeRemaining: number;
  paidCredits: number;
  paymentStatus: string;
  canGenerate: boolean;
};

function toQuota(record: {
  imagesGenerated: number;
  paidCredits: number;
  paymentStatus: string;
} | null): GenerationQuota {
  const imagesGenerated = record?.imagesGenerated ?? 0;
  const paidCredits = record?.paidCredits ?? 0;
  const freeRemaining = Math.max(FREE_GENERATION_LIMIT - imagesGenerated, 0);

  return {
    imagesGenerated,
    freeRemaining,
    paidCredits,
    paymentStatus: record?.paymentStatus ?? "free",
    canGenerate: freeRemaining > 0 || paidCredits > 0,
  };
}

export async function getUserCredits(supabaseUserId: string): Promise<number> {
  const record = await prisma.userCredits.findUnique({
    where: { supabaseUserId },
  });

  return record?.paidCredits ?? 0;
}

export async function getUserGenerationQuota(
  supabaseUserId: string,
): Promise<GenerationQuota> {
  const record = await prisma.userCredits.findUnique({
    where: { supabaseUserId },
  });

  return toQuota(record);
}

/**
 * Claims one generation for the user: the free allowance first, then a paid
 * credit. Both branches are single conditional UPDATEs so two concurrent
 * requests can never spend the same slot twice.
 */
export async function tryConsumeGeneration(supabaseUserId: string): Promise<
  | { allowed: true; source: "free" | "paid"; quota: GenerationQuota }
  | { allowed: false; quota: GenerationQuota }
> {
  // Ensure the row exists so the conditional updates below have a target.
  await prisma.userCredits.upsert({
    where: { supabaseUserId },
    create: { supabaseUserId },
    update: {},
  });

  const freeClaim = await prisma.userCredits.updateMany({
    where: { supabaseUserId, imagesGenerated: { lt: FREE_GENERATION_LIMIT } },
    data: { imagesGenerated: { increment: 1 } },
  });

  if (freeClaim.count === 1) {
    return {
      allowed: true,
      source: "free",
      quota: await getUserGenerationQuota(supabaseUserId),
    };
  }

  const paidClaim = await prisma.userCredits.updateMany({
    where: { supabaseUserId, paidCredits: { gt: 0 } },
    data: { paidCredits: { decrement: 1 }, imagesGenerated: { increment: 1 } },
  });

  if (paidClaim.count === 1) {
    return {
      allowed: true,
      source: "paid",
      quota: await getUserGenerationQuota(supabaseUserId),
    };
  }

  return {
    allowed: false,
    quota: await getUserGenerationQuota(supabaseUserId),
  };
}

/**
 * Gives back a slot claimed by tryConsumeGeneration when the generation itself
 * failed — the counter tracks completed images, not attempts.
 */
export async function refundGeneration(
  supabaseUserId: string,
  source: "free" | "paid",
): Promise<void> {
  try {
    await prisma.userCredits.update({
      where: { supabaseUserId },
      data: {
        imagesGenerated: { decrement: 1 },
        ...(source === "paid" ? { paidCredits: { increment: 1 } } : {}),
      },
    });
  } catch (error) {
    console.error("Failed to refund generation slot:", error);
  }
}

export async function addUserCredits(
  supabaseUserId: string,
  amount: number,
): Promise<number> {
  const updated = await prisma.userCredits.upsert({
    where: { supabaseUserId },
    create: { supabaseUserId, paidCredits: amount, paymentStatus: "paid" },
    update: { paidCredits: { increment: amount }, paymentStatus: "paid" },
  });

  return updated.paidCredits;
}
