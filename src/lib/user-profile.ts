import { prisma } from "@/lib/prisma";

export type ProfileFields = {
  fullName?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
};

export async function getUserProfile(supabaseUserId: string) {
  return prisma.userProfile.findUnique({ where: { supabaseUserId } });
}

export async function upsertUserProfile(
  supabaseUserId: string,
  fields: ProfileFields,
) {
  return prisma.userProfile.upsert({
    where: { supabaseUserId },
    create: { supabaseUserId, ...fields },
    update: fields,
  });
}
