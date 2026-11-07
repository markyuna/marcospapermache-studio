// src/lib/quiz-api.ts
// Contract between the quiz API routes and the browser. Keep it free of server
// imports: the client reads these codes and types too.
import type { GeneratorConfig } from "@/data/quiz/generator";

export const QUIZ_LOCALES = ["fr", "en", "es"] as const;
export type QuizLocale = (typeof QUIZ_LOCALES)[number];

export function parseQuizLocale(value: unknown): QuizLocale | null {
  return QUIZ_LOCALES.find((locale) => locale === value) ?? null;
}

export const QUIZ_IMAGES_BUCKET = "quiz-images";
export const MAX_QUIZ_RESULTS = 20;
export const SIGNED_URL_TTL_SECONDS = 60 * 60;
// A generation that has not finished after this long is considered dead, so a
// crashed request cannot lock a result forever (maxDuration is 60 s).
export const GENERATING_STALE_SECONDS = 90;

// Shape of a stored answers code: digits and "-" only. The server still decodes
// and validates it with resolveQuizOutcome; this only filters query parameters.
export const QUIZ_CODE_PATTERN = /^[0-9-]{1,32}$/;
export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Every failure carries one of these; the browser maps it to translated text.
// Raw database / OpenAI messages never reach the client.
export type QuizErrorCode =
  | "unauthenticated"
  | "invalid_request"
  | "invalid_code"
  | "invalid_locale"
  | "limit_reached"
  | "not_found"
  | "replace_required"
  | "already_generating"
  | "quota_exhausted"
  | "moderation"
  | "generation_failed"
  | "save_failed"
  | "delete_failed";

export type QuizErrorBody = {
  errorCode: QuizErrorCode;
  // Mirrors what /api/generate-image has always sent, so existing client
  // handling (sign-up modal, payment panel) keeps working.
  requiresSignup?: boolean;
  requiresPayment?: boolean;
  freeGenerationsRemaining?: number;
  paidCreditsRemaining?: number;
  imagesGenerated?: number;
};

export type QuizQuotaPayload =
  | { unlimited: true }
  | {
      freeGenerationsRemaining: number;
      paidCreditsRemaining: number;
      imagesGenerated: number;
    };

// What the API tells the owner about one saved result. No user id, no storage
// path: the image is only ever reachable through a short-lived signed URL.
export type QuizResultDTO = {
  id: string;
  code: string;
  profile: string;
  config: GeneratorConfig | null;
  locale: QuizLocale;
  promptKey: string | null;
  signedUrl: string | null;
  imageGeneratedAt: string | null;
  createdAt: string;
};

export type QuizGenerateSuccess = {
  signedUrl: string | null;
  quota: QuizQuotaPayload;
  resultId: string;
};
