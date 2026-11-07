// src/lib/quiz-results.ts
// Server-side access to saved quiz results and their private images.
//
// Every function takes the user id explicitly and scopes by it, so one user can
// never read, change or delete another one's result. Nothing here trusts data
// coming from the browser: the profile and configuration are stored from an
// outcome the server computed itself (resolveQuizOutcome).
import type { Prisma, QuizResult } from "@/generated/prisma/client/client";
import type { ResolvedQuizOutcome } from "@/data/quiz/outcome";
import { parseGeneratorConfig } from "@/data/quiz/generator-params";
import { prisma } from "@/lib/prisma";
import {
  GENERATING_STALE_SECONDS,
  MAX_QUIZ_RESULTS,
  QUIZ_IMAGES_BUCKET,
  SIGNED_URL_TTL_SECONDS,
  parseQuizLocale,
  type QuizLocale,
  type QuizResultDTO,
} from "@/lib/quiz-api";
import { supabaseAdmin } from "@/lib/supabase";

export type { QuizResult };

export class QuizLimitReached extends Error {
  constructor() {
    super("quiz_results_limit_reached");
    this.name = "QuizLimitReached";
  }
}

export class QuizImageDeleteFailed extends Error {
  constructor() {
    super("quiz_image_delete_failed");
    this.name = "QuizImageDeleteFailed";
  }
}

// Prisma wraps database errors, so the Postgres message can sit in different
// places depending on the driver path: look at the message, the cause chain and
// the metadata.
function errorTexts(error: unknown, depth = 0): string[] {
  if (depth > 4 || error === null || typeof error !== "object") return [];

  const e = error as {
    message?: unknown;
    code?: unknown;
    cause?: unknown;
    meta?: unknown;
  };
  const texts = [String(e.message ?? ""), String(e.code ?? "")];

  if (e.meta && typeof e.meta === "object") {
    texts.push(JSON.stringify(e.meta));
  }

  return [...texts, ...errorTexts(e.cause, depth + 1)];
}

export function isQuizLimitError(error: unknown) {
  return errorTexts(error).some((text) =>
    text.includes("quiz_results_limit_reached"),
  );
}

function isUniqueViolation(error: unknown) {
  return errorTexts(error).some((text) => text === "P2002");
}

function configJson(outcome: ResolvedQuizOutcome) {
  return outcome.config as unknown as Prisma.InputJsonValue;
}

// --- reads -----------------------------------------------------------------

export async function getQuizResult(userId: string, code: string) {
  return prisma.quizResult.findUnique({
    where: { userId_code: { userId, code } },
  });
}

export async function getQuizResultById(userId: string, id: string) {
  // findFirst with both conditions: an id that belongs to someone else is
  // indistinguishable from one that does not exist.
  return prisma.quizResult.findFirst({ where: { id, userId } });
}

export async function listQuizResults(userId: string) {
  return prisma.quizResult.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: MAX_QUIZ_RESULTS,
  });
}

// --- writes ----------------------------------------------------------------

// Idempotent per (user, code). Re-saving refreshes the server-computed snapshot
// and never counts as a new result. The 20-result cap is enforced by a database
// trigger (race-safe); it surfaces here as QuizLimitReached.
export async function saveQuizResult(params: {
  userId: string;
  outcome: ResolvedQuizOutcome;
  locale: QuizLocale;
}): Promise<{ record: QuizResult; created: boolean }> {
  const { userId, outcome, locale } = params;
  const where = { userId_code: { userId, code: outcome.code } };
  const data = {
    profile: outcome.profileId,
    config: configJson(outcome),
    locale,
  };

  const existing = await prisma.quizResult.findUnique({ where });

  const upsert = () =>
    prisma.quizResult.upsert({
      where,
      create: { userId, code: outcome.code, ...data },
      update: data,
    });

  try {
    let record: QuizResult;

    try {
      record = await upsert();
    } catch (error) {
      // Two simultaneous first saves of the same code: the loser retries as an update.
      if (!isUniqueViolation(error)) throw error;
      record = await upsert();
    }

    return { record, created: existing === null };
  } catch (error) {
    if (isQuizLimitError(error)) throw new QuizLimitReached();
    throw error;
  }
}

// Atomically claims the right to generate for this result. Returns the claim
// token (the stored timestamp, millisecond precision) or null when another
// request holds a claim younger than GENERATING_STALE_SECONDS.
export async function claimGeneration(
  userId: string,
  code: string,
): Promise<Date | null> {
  const rows = await prisma.$queryRaw<Array<{ generating_since: Date }>>`
    UPDATE public.quiz_results
    SET generating_since = date_trunc('milliseconds', now())
    WHERE user_id = ${userId}::uuid
      AND code = ${code}
      AND (
        generating_since IS NULL
        OR generating_since < now() - (${GENERATING_STALE_SECONDS}::int * interval '1 second')
      )
    RETURNING generating_since
  `;

  return rows[0]?.generating_since ?? null;
}

// Releases only OUR claim: if it went stale and someone else took over, their
// claim stays.
export async function releaseGeneration(
  userId: string,
  code: string,
  token: Date,
) {
  await prisma.quizResult.updateMany({
    where: { userId, code, generatingSince: token },
    data: { generatingSince: null },
  });
}

export async function markImageGenerated(params: {
  userId: string;
  id: string;
  imagePath: string;
  promptKey: string;
}) {
  const { userId, id, imagePath, promptKey } = params;

  const result = await prisma.quizResult.updateMany({
    where: { id, userId },
    data: {
      imagePath,
      promptKey,
      imageGeneratedAt: new Date(),
      generatingSince: null,
    },
  });

  // The row vanished meanwhile (e.g. deleted while generating): treat as failure.
  if (result.count !== 1) throw new Error("quiz_result_missing");
}

// --- storage ---------------------------------------------------------------

export function imagePathFor(userId: string, code: string) {
  return `${userId}/${code}.webp`;
}

function ownsPath(userId: string, path: string) {
  return path.startsWith(`${userId}/`);
}

export async function uploadQuizImage(
  userId: string,
  code: string,
  webp: Buffer,
) {
  const path = imagePathFor(userId, code);

  const { error } = await supabaseAdmin.storage
    .from(QUIZ_IMAGES_BUCKET)
    .upload(path, webp, { contentType: "image/webp", upsert: true });

  if (error) throw new Error(`quiz image upload failed: ${error.message}`);

  return path;
}

export async function removeQuizImage(userId: string, path: string) {
  if (!ownsPath(userId, path)) throw new Error("path not owned by user");

  const { error } = await supabaseAdmin.storage
    .from(QUIZ_IMAGES_BUCKET)
    .remove([path]);

  if (error) throw new Error(`quiz image removal failed: ${error.message}`);
}

async function removeWithOneRetry(userId: string, path: string) {
  try {
    await removeQuizImage(userId, path);
  } catch (firstError) {
    console.error("Quiz image removal failed, retrying once:", firstError);

    try {
      await removeQuizImage(userId, path);
    } catch (secondError) {
      console.error("Quiz image removal failed again:", secondError);
      throw new QuizImageDeleteFailed();
    }
  }
}

// Removes the file first and the row second, so a failure never leaves a row
// pointing at a deleted file or a file nobody can find again: if the file
// cannot be removed the row stays and the caller can simply retry.
export async function deleteQuizResult(
  userId: string,
  id: string,
): Promise<"deleted" | "not_found"> {
  const row = await getQuizResultById(userId, id);
  if (!row) return "not_found";

  if (row.imagePath) {
    await removeWithOneRetry(userId, row.imagePath);
  }

  await prisma.quizResult.deleteMany({ where: { id, userId } });

  return "deleted";
}

// The only way an image URL is produced. It is signed for the owner only: a
// record that does not belong to the requester, or whose path is not under the
// requester's folder, yields null. One hour, then it stops working.
export async function signImageUrl(
  record: Pick<QuizResult, "userId" | "imagePath">,
  requesterId: string,
): Promise<string | null> {
  if (!record.imagePath) return null;
  if (record.userId !== requesterId) return null;
  if (!ownsPath(requesterId, record.imagePath)) return null;

  const { data, error } = await supabaseAdmin.storage
    .from(QUIZ_IMAGES_BUCKET)
    .createSignedUrl(record.imagePath, SIGNED_URL_TTL_SECONDS);

  if (error || !data) {
    console.error("Could not sign quiz image URL:", error);
    return null;
  }

  return data.signedUrl;
}

// Same rule for a list, with one round trip to Storage instead of up to 20.
async function signImageUrls(
  records: QuizResult[],
  requesterId: string,
): Promise<Map<string, string>> {
  const owned = records.filter(
    (record) =>
      record.imagePath &&
      record.userId === requesterId &&
      ownsPath(requesterId, record.imagePath),
  );
  const urls = new Map<string, string>();
  if (owned.length === 0) return urls;

  const { data, error } = await supabaseAdmin.storage
    .from(QUIZ_IMAGES_BUCKET)
    .createSignedUrls(
      owned.map((record) => record.imagePath as string),
      SIGNED_URL_TTL_SECONDS,
    );

  if (error || !data) {
    console.error("Could not sign quiz image URLs:", error);
    return urls;
  }

  for (const entry of data) {
    if (entry.error || !entry.signedUrl || !entry.path) continue;
    const record = owned.find((item) => item.imagePath === entry.path);
    if (record) urls.set(record.id, entry.signedUrl);
  }

  return urls;
}

// --- API shape -------------------------------------------------------------

export function toQuizResultDTO(
  record: QuizResult,
  signedUrl: string | null,
): QuizResultDTO {
  return {
    id: record.id,
    code: record.code,
    profile: record.profile,
    config: parseGeneratorConfig(record.config),
    locale: parseQuizLocale(record.locale) ?? "fr",
    promptKey: record.promptKey,
    signedUrl,
    imageGeneratedAt: record.imageGeneratedAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
  };
}

export async function toQuizResultDTOs(
  records: QuizResult[],
  requesterId: string,
): Promise<QuizResultDTO[]> {
  const urls = await signImageUrls(records, requesterId);

  return records.map((record) =>
    toQuizResultDTO(record, urls.get(record.id) ?? null),
  );
}
