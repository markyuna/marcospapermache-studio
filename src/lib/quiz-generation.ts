// src/lib/quiz-generation.ts
// "Generate my image" for a saved quiz result. Everything is derived on the
// server from the answers code: the prompt, the configuration and the prompt
// key. The caller (the API route) only authenticates and parses the request.
import { quizConfigToSelection } from "@/data/quiz/generator-params";
import type { ResolvedQuizOutcome } from "@/data/quiz/outcome";
import { PROFILES } from "@/data/quiz/profiles";
import { pickPromptKeys, seedFromCode } from "@/data/quiz/share";
import {
  generateImageWithQuota,
  MODERATION_ERROR_MESSAGE,
  type GenerationDeps,
  type ImageGenerationResult,
} from "@/lib/generate-image-core";
import {
  buildGenerationPrompt,
  type GenerationText,
} from "@/lib/generator-prompt";
import type {
  QuizErrorBody,
  QuizGenerateSuccess,
  QuizLocale,
} from "@/lib/quiz-api";
import {
  QuizLimitReached,
  claimGeneration,
  getQuizResult,
  markImageGenerated,
  releaseGeneration,
  removeQuizImage,
  saveQuizResult,
  signImageUrl,
  uploadQuizImage,
} from "@/lib/quiz-results";

// The translated pieces, resolved by the caller for the requested locale.
export type QuizPromptSource = {
  // quiz.profiles.<profile>.prompts.<key>
  quizPrompt: (profileId: string, promptKey: string) => string;
  generation: GenerationText;
};

export type QuizGenerationResult =
  | { ok: true; body: QuizGenerateSuccess }
  | { ok: false; status: number; body: QuizErrorBody };

function fail(status: number, body: QuizErrorBody): QuizGenerationResult {
  return { ok: false, status, body };
}

// Same outcomes /create has always produced, expressed as error codes.
function mapCoreFailure(
  failure: Extract<ImageGenerationResult<string>, { ok: false }>,
): QuizGenerationResult {
  if (failure.status === 402) {
    return fail(402, {
      errorCode: "quota_exhausted",
      requiresPayment: true,
      freeGenerationsRemaining: 0,
      paidCreditsRemaining: Number(failure.body.paidCreditsRemaining ?? 0),
      imagesGenerated: Number(failure.body.imagesGenerated ?? 0),
    });
  }

  if (failure.body.error === MODERATION_ERROR_MESSAGE) {
    return fail(400, { errorCode: "moderation" });
  }

  return fail(failure.status, { errorCode: "generation_failed" });
}

export async function generateQuizImage(params: {
  userId: string;
  isAdmin: boolean;
  outcome: ResolvedQuizOutcome;
  locale: QuizLocale;
  confirmReplace: boolean;
  prompts: QuizPromptSource;
  deps: GenerationDeps;
}): Promise<QuizGenerationResult> {
  const { userId, isAdmin, outcome, locale, confirmReplace, prompts, deps } =
    params;

  // 1. Everything the client could have lied about is recomputed here.
  const profile = PROFILES.find((p) => p.id === outcome.profileId);
  if (!profile) return fail(500, { errorCode: "generation_failed" });

  // Always the first of the two prompts the result screen shows.
  const promptKey = pickPromptKeys(
    profile.promptKeys,
    seedFromCode(outcome.code),
  )[0];
  const selection = quizConfigToSelection(
    outcome.config,
    prompts.quizPrompt(outcome.profileId, promptKey),
  );
  const prompt = buildGenerationPrompt(selection, prompts.generation);
  if (!prompt) return fail(500, { errorCode: "generation_failed" });

  // 2. Replacing an existing image needs an explicit yes, and costs nothing
  //    until it gets one.
  const existing = await getQuizResult(userId, outcome.code);
  if (existing?.imagePath && !confirmReplace) {
    return fail(409, { errorCode: "replace_required" });
  }

  // 3. Generating also saves (respecting the cap of saved results).
  let record;
  try {
    ({ record } = await saveQuizResult({ userId, outcome, locale }));
  } catch (error) {
    if (error instanceof QuizLimitReached) {
      return fail(409, { errorCode: "limit_reached" });
    }
    throw error;
  }

  // 4. One generation at a time per result (double click, two tabs).
  const claim = await claimGeneration(userId, outcome.code);
  if (!claim) return fail(409, { errorCode: "already_generating" });

  try {
    // 5. Claim quota -> generate -> store -> record the path. Any failure after
    //    OpenAI answered hands the quota back (persistFailure: "refund").
    const generated = await generateImageWithQuota<string>({
      userId,
      isAdmin,
      prompt,
      creationType: selection.creationType,
      withFrame: selection.withFrame,
      referenceBuffer: null,
      persistFailure: "refund",
      deps,
      persist: async ({ webp }) => {
        const imagePath = await uploadQuizImage(userId, outcome.code, webp);

        try {
          await markImageGenerated({
            userId,
            id: record.id,
            imagePath,
            promptKey,
          });
        } catch (error) {
          // A first image whose row could not be updated would be an orphan.
          // When regenerating, the row already points at this very path, so the
          // file is still the one the row refers to and stays.
          if (!record.imagePath) {
            await removeQuizImage(userId, imagePath).catch((cleanupError) =>
              console.error("Could not clean up quiz image:", cleanupError),
            );
          }
          throw error;
        }

        return imagePath;
      },
    });

    if (!generated.ok) return mapCoreFailure(generated);

    const signedUrl = await signImageUrl(
      { userId, imagePath: generated.persisted ?? null },
      userId,
    );

    return {
      ok: true,
      body: { signedUrl, quota: generated.quota, resultId: record.id },
    };
  } finally {
    // Always, success or failure or exception.
    await releaseGeneration(userId, outcome.code, claim).catch((error) =>
      console.error("Could not release quiz generation claim:", error),
    );
  }
}
