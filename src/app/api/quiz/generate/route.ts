// src/app/api/quiz/generate/route.ts
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

import { resolveQuizOutcome } from "@/data/quiz/outcome";
import { getAuthenticatedUser, isAdminEmail } from "@/lib/admin-auth";
import { IMAGE_MODEL, openai } from "@/lib/openai";
import { parseQuizLocale, type QuizErrorBody } from "@/lib/quiz-api";
import { generateQuizImage } from "@/lib/quiz-generation";
import { refundGeneration, tryConsumeGeneration } from "@/lib/user-credits";

// Same budget as /api/generate-image: a generation takes ~10 s or more.
export const maxDuration = 60;

const NO_STORE = { "Cache-Control": "no-store" };

function error(status: number, body: QuizErrorBody) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

// Body: { r, locale, confirmReplace? }. Nothing else is read: the profile, the
// configuration and the prompt are all recomputed from the answers code.
export async function POST(request: Request) {
  try {
    // Same origin guard as /api/generate-image: this route spends money.
    const origin = request.headers.get("origin") ?? "";
    const referer = request.headers.get("referer") ?? "";
    if (
      process.env.NODE_ENV === "production" &&
      !origin.includes("marcospapermache.com") &&
      !referer.includes("marcospapermache.com")
    ) {
      return error(403, { errorCode: "invalid_request" });
    }

    // Also applies the idle-session timeout, like every authenticated route.
    const user = await getAuthenticatedUser();
    if (!user) {
      return error(401, { errorCode: "unauthenticated", requiresSignup: true });
    }

    let body: Record<string, unknown> | null = null;
    try {
      const parsed: unknown = await request.json();
      if (parsed !== null && typeof parsed === "object") {
        body = parsed as Record<string, unknown>;
      }
    } catch {
      body = null;
    }
    if (!body) return error(400, { errorCode: "invalid_request" });

    const locale = parseQuizLocale(body.locale);
    if (!locale) return error(400, { errorCode: "invalid_locale" });

    const outcome = resolveQuizOutcome(
      typeof body.r === "string" ? body.r : null,
    );
    if (!outcome) return error(400, { errorCode: "invalid_code" });

    const tQuiz = await getTranslations({ locale, namespace: "quiz" });
    const tPanel = await getTranslations({ locale, namespace: "AIExperience" });

    const result = await generateQuizImage({
      userId: user.id,
      isAdmin: isAdminEmail(user.email),
      outcome,
      locale,
      confirmReplace: body.confirmReplace === true,
      prompts: {
        quizPrompt: (profileId, promptKey) =>
          tQuiz(`profiles.${profileId}.prompts.${promptKey}`),
        generation: {
          enrichedSuffix: tPanel("promptEnrichedSuffix"),
          stylePrompt: (styleId) => tPanel(`styles.${styleId}.prompt`),
        },
      },
      deps: {
        openai,
        fetch: globalThis.fetch,
        model: IMAGE_MODEL,
        apiKey: process.env.OPENAI_API_KEY,
        tryConsumeGeneration,
        refundGeneration,
      },
    });

    return NextResponse.json(result.body, {
      status: result.ok ? 200 : result.status,
      headers: NO_STORE,
    });
  } catch (err) {
    console.error("/api/quiz/generate failed:", err);
    return error(500, { errorCode: "generation_failed" });
  }
}
