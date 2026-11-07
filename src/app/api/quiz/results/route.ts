// src/app/api/quiz/results/route.ts
import { NextResponse } from "next/server";

import { resolveQuizOutcome } from "@/data/quiz/outcome";
import { getAuthenticatedUser } from "@/lib/admin-auth";
import {
  QUIZ_CODE_PATTERN,
  UUID_PATTERN,
  parseQuizLocale,
  type QuizErrorBody,
} from "@/lib/quiz-api";
import {
  QuizImageDeleteFailed,
  QuizLimitReached,
  deleteQuizResult,
  getQuizResult,
  listQuizResults,
  saveQuizResult,
  toQuizResultDTOs,
} from "@/lib/quiz-results";

// Per-user data and signed URLs: never cache.
const NO_STORE = { "Cache-Control": "no-store" };

function error(status: number, body: QuizErrorBody) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

function unauthenticated() {
  return error(401, { errorCode: "unauthenticated", requiresSignup: true });
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json();
    return body !== null && typeof body === "object"
      ? (body as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

// The user's saved results, newest first (at most 20). ?code= narrows to one.
export async function GET(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthenticated();

  try {
    const code = new URL(request.url).searchParams.get("code");

    if (code !== null && !QUIZ_CODE_PATTERN.test(code)) {
      return error(400, { errorCode: "invalid_code" });
    }

    const records =
      code === null
        ? await listQuizResults(user.id)
        : [await getQuizResult(user.id, code)].filter(
            (record) => record !== null,
          );

    const results = await toQuizResultDTOs(records, user.id);

    return NextResponse.json({ results }, { headers: NO_STORE });
  } catch (err) {
    console.error("/api/quiz/results GET failed:", err);
    return error(500, { errorCode: "save_failed" });
  }
}

// Save (idempotent per code). The client sends only the code and the locale:
// profile and configuration are recomputed here.
export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthenticated();

  const body = await readJson(request);
  if (!body) return error(400, { errorCode: "invalid_request" });

  const locale = parseQuizLocale(body.locale);
  if (!locale) return error(400, { errorCode: "invalid_locale" });

  const outcome = resolveQuizOutcome(
    typeof body.r === "string" ? body.r : null,
  );
  if (!outcome) return error(400, { errorCode: "invalid_code" });

  try {
    const { record, created } = await saveQuizResult({
      userId: user.id,
      outcome,
      locale,
    });
    const [result] = await toQuizResultDTOs([record], user.id);

    return NextResponse.json({ result, created }, { headers: NO_STORE });
  } catch (err) {
    if (err instanceof QuizLimitReached) {
      return error(409, { errorCode: "limit_reached" });
    }

    console.error("/api/quiz/results POST failed:", err);
    return error(500, { errorCode: "save_failed" });
  }
}

// Deletes a result and its image. The id comes from ?id= or the JSON body.
export async function DELETE(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthenticated();

  const fromQuery = new URL(request.url).searchParams.get("id");
  const fromBody = fromQuery === null ? (await readJson(request))?.id : null;
  const id = fromQuery ?? (typeof fromBody === "string" ? fromBody : null);

  if (id === null || !UUID_PATTERN.test(id)) {
    return error(400, { errorCode: "invalid_request" });
  }

  try {
    const outcome = await deleteQuizResult(user.id, id);

    if (outcome === "not_found") return error(404, { errorCode: "not_found" });

    return NextResponse.json({ deleted: true }, { headers: NO_STORE });
  } catch (err) {
    // The row is kept when its file could not be removed, so this can be retried.
    if (!(err instanceof QuizImageDeleteFailed)) {
      console.error("/api/quiz/results DELETE failed:", err);
    }
    return error(500, { errorCode: "delete_failed" });
  }
}
