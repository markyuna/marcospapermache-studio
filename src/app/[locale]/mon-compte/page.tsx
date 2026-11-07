// src/app/[locale]/mon-compte/page.tsx

import { setRequestLocale } from "next-intl/server";

import AccountDashboard from "@/components/account/AccountDashboard";
import { Container } from "@/components/layout/container";
import { isAdminEmail } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { listQuizResults, toQuizResultDTOs } from "@/lib/quiz-results";
import { supabaseAdmin } from "@/lib/supabase";
import { requireUserPageAccess } from "@/lib/user-auth";
import { getUserGenerationQuota } from "@/lib/user-credits";
import { getUserProfile } from "@/lib/user-profile";
import type { Commande } from "@/types/commande";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

// A problem with the quiz tables must not take the whole account page down.
async function loadQuizResults(userId: string) {
  try {
    return await toQuizResultDTOs(await listQuizResults(userId), userId);
  } catch (error) {
    console.error("Could not load quiz results:", error);
    return [];
  }
}

export default async function MonComptePage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const user = await requireUserPageAccess(locale);

  const [quota, generatedImages, quizResults, commandesResult, profile] = await Promise.all([
    getUserGenerationQuota(user.id),
    prisma.generatedImage.findMany({
      where: { supabaseUserId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    loadQuizResults(user.id),
    supabaseAdmin
      .from("commandes")
      .select("*")
      .eq("supabase_user_id", user.id)
      .order("created_at", { ascending: false }),
    getUserProfile(user.id),
  ]);

  const commandes = (commandesResult.data ?? []) as Commande[];
  const isAdmin = isAdminEmail(user.email);

  return (
    <main className="min-h-screen bg-[linear-gradient(to_bottom,var(--paper-base),var(--paper-surface),var(--paper-base))] py-24 md:py-32">
      <Container className="max-w-4xl">
        <AccountDashboard
          email={user.email ?? ""}
          paidCredits={quota.paidCredits}
          freeRemaining={quota.freeRemaining}
          imagesGenerated={quota.imagesGenerated}
          generatedImages={generatedImages}
          quizResults={quizResults}
          commandes={commandes}
          profile={profile}
          isAdmin={isAdmin}
        />
      </Container>
    </main>
  );
}
