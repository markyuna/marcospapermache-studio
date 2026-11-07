// src/components/quiz/QuizSavePanel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Sparkles, UserPlus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import AuthModal from "@/components/auth/AuthModal";
import { Link } from "@/i18n/navigation";
import type {
  QuizErrorBody,
  QuizErrorCode,
  QuizGenerateSuccess,
  QuizQuotaPayload,
  QuizResultDTO,
} from "@/lib/quiz-api";

type QuizSavePanelProps = {
  // The answers code (?r=). It is the only thing sent to the server besides the
  // locale: profile, configuration and prompt are recomputed there.
  code: string;
  // null until the browser session is known.
  hasSession: boolean | null;
};

// Remaining generations as the account page counts them; null = unknown yet.
type Credits = { unlimited: true } | { unlimited: false; remaining: number };

type Busy = "idle" | "saving" | "generating";

type Confirmation = { replace: boolean; last: boolean };

type ApiOutcome<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: QuizErrorBody | null };

const KNOWN_ERRORS: readonly QuizErrorCode[] = [
  "unauthenticated",
  "invalid_request",
  "invalid_code",
  "invalid_locale",
  "limit_reached",
  "not_found",
  "replace_required",
  "already_generating",
  "quota_exhausted",
  "moderation",
  "generation_failed",
  "save_failed",
  "delete_failed",
];

async function callApi<T>(
  input: string,
  init?: RequestInit,
): Promise<ApiOutcome<T>> {
  try {
    const response = await fetch(input, init);
    const body: unknown = await response.json().catch(() => null);

    if (response.ok) return { ok: true, data: body as T };

    const error =
      body && typeof body === "object" && "errorCode" in body
        ? (body as QuizErrorBody)
        : null;

    return { ok: false, status: response.status, error };
  } catch {
    return { ok: false, status: 0, error: null };
  }
}

// What the signed-in owner already has for this code. A shared link opened by
// someone else asks for THEIR results, so it can never return this image.
async function fetchSaved(code: string): Promise<QuizResultDTO | null> {
  const outcome = await callApi<{ results: QuizResultDTO[] }>(
    `/api/quiz/results?code=${encodeURIComponent(code)}`,
  );

  return outcome.ok ? (outcome.data.results[0] ?? null) : null;
}

async function fetchCredits(): Promise<Credits | null> {
  const outcome = await callApi<{
    unlimited?: boolean;
    paidCredits?: number;
    freeRemaining?: number;
  }>("/api/user/credits");

  if (!outcome.ok) return null;

  return outcome.data.unlimited
    ? { unlimited: true }
    : {
        unlimited: false,
        remaining:
          (outcome.data.freeRemaining ?? 0) + (outcome.data.paidCredits ?? 0),
      };
}

function creditsFromQuota(quota: QuizQuotaPayload): Credits {
  if ("unlimited" in quota) return { unlimited: true };

  return {
    unlimited: false,
    remaining: quota.freeGenerationsRemaining + quota.paidCreditsRemaining,
  };
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c65400]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const primaryButton = `${buttonBase} bg-[#171311] text-white hover:bg-black`;
const secondaryButton = `${buttonBase} border border-[#e7d5c5] bg-white/80 text-[#4f4338] hover:bg-white`;

export default function QuizSavePanel({ code, hasSession }: QuizSavePanelProps) {
  const t = useTranslations("quiz.save");
  const locale = useLocale();

  const [saved, setSaved] = useState<QuizResultDTO | null>(null);
  // False until the first lookup answers, so "Save" is never offered for a
  // result that turns out to be saved already.
  const [ready, setReady] = useState(false);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [busy, setBusy] = useState<Busy>("idle");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [errorCode, setErrorCode] = useState<QuizErrorCode | "network" | "unknown" | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

  // Read-only on open: nothing is saved or generated just by loading the page.
  useEffect(() => {
    if (hasSession !== true) return;

    let active = true;

    void Promise.all([fetchSaved(code), fetchCredits()]).then(
      ([savedResult, creditsResult]) => {
        if (!active) return;
        setSaved(savedResult);
        setReady(true);
        if (creditsResult) setCredits(creditsResult);
      },
    );

    return () => {
      active = false;
    };
  }, [hasSession, code]);

  useEffect(() => {
    if (confirmation) confirmButtonRef.current?.focus();
  }, [confirmation]);

  function fail(outcome: Extract<ApiOutcome<unknown>, { ok: false }>) {
    if (outcome.status === 0) {
      setErrorCode("network");
      return;
    }

    const known = KNOWN_ERRORS.find((item) => item === outcome.error?.errorCode);
    setErrorCode(known ?? "unknown");

    if (known === "unauthenticated") setShowAuth(true);
  }

  async function handleSave() {
    setErrorCode(null);
    setBusy("saving");

    const outcome = await callApi<{ result: QuizResultDTO }>(
      "/api/quiz/results",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ r: code, locale }),
      },
    );

    setBusy("idle");

    if (outcome.ok) setSaved(outcome.data.result);
    else fail(outcome);
  }

  async function runGenerate(confirmReplace: boolean) {
    setConfirmation(null);
    setErrorCode(null);
    setBusy("generating");

    const outcome = await callApi<QuizGenerateSuccess>("/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ r: code, locale, confirmReplace }),
    });

    if (outcome.ok) {
      setCredits(creditsFromQuota(outcome.data.quota));
      // The server saved the result too: take its version as the truth.
      setSaved(await fetchSaved(code));
      setBusy("idle");
      return;
    }

    setBusy("idle");

    // The server is stricter than our local state (e.g. an image created in
    // another tab): ask for the confirmation instead of failing.
    if (outcome.error?.errorCode === "replace_required") {
      setConfirmation({ replace: true, last: false });
      return;
    }

    if (outcome.error?.errorCode === "quota_exhausted") setCredits({ unlimited: false, remaining: 0 });

    fail(outcome);
    setSaved(await fetchSaved(code));
  }

  function requestGenerate() {
    setErrorCode(null);

    if (credits && !credits.unlimited && credits.remaining <= 0) {
      setErrorCode("quota_exhausted");
      return;
    }

    const replace = Boolean(saved?.signedUrl || saved?.imageGeneratedAt);
    const last = Boolean(credits && !credits.unlimited && credits.remaining === 1);

    if (replace || last) {
      setConfirmation({ replace, last });
      return;
    }

    void runGenerate(false);
  }

  if (hasSession === null) return null;

  const isBusy = busy !== "idle" || !ready;
  const hasImage = Boolean(saved?.signedUrl);

  return (
    <section
      aria-labelledby="quiz-save-title"
      className="rounded-[2rem] border border-[#e7d5c5] bg-white/70 p-6 md:p-8"
    >
      <h2
        id="quiz-save-title"
        className="text-2xl font-semibold tracking-[-0.04em] text-[#1c1c1a] md:text-3xl"
      >
        {t("title")}
      </h2>

      {hasSession === false ? (
        <>
          <p className="mt-3 text-base leading-7 text-[#6c5d50]">
            {t("signedOutHint")}
          </p>
          <button
            type="button"
            onClick={() => setShowAuth(true)}
            className={`${primaryButton} mt-5`}
          >
            <UserPlus className="h-4 w-4" />
            {t("createAccount")}
          </button>
        </>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#6c5d50]">
            {saved ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-[#3d6b3d]">
                <Check className="h-4 w-4" />
                {t("saved")}
              </span>
            ) : null}

            {credits ? (
              <span>
                {credits.unlimited
                  ? t("creditsUnlimited")
                  : credits.remaining > 0
                    ? t("creditsLeft", { count: credits.remaining })
                    : t("creditsNone")}
              </span>
            ) : null}

            {saved ? (
              <Link
                href="/mon-compte"
                className="font-medium text-[#c65400] underline-offset-4 hover:underline"
              >
                {t("viewAccount")}
              </Link>
            ) : null}
          </div>

          {hasImage ? (
            <figure className="mt-5">
              {/* Short-lived signed URL from the private bucket: a plain <img>, no image optimizer in between */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={saved?.signedUrl ?? undefined}
                alt={t("imageAlt")}
                className="mx-auto max-h-[70vh] w-full max-w-md rounded-[1.5rem] border border-[#e7d5c5] object-contain shadow-[0_20px_60px_rgba(35,25,15,0.12)]"
              />
              <figcaption className="mx-auto mt-3 max-w-md text-center text-xs leading-5 text-[#7b6d61]">
                {t("disclaimer")}
              </figcaption>
            </figure>
          ) : null}

          {confirmation ? (
            <div
              role="group"
              aria-labelledby="quiz-confirm-text"
              className="mt-5 rounded-[1.25rem] border border-[#e1c9a8] bg-[#fcf6ec] p-4"
            >
              <p id="quiz-confirm-text" className="text-sm leading-6 text-[#4f4338]">
                {confirmation.replace ? `${t("confirmReplace")} ` : ""}
                {confirmation.last ? `${t("confirmLast")} ` : ""}
                {t("confirmQuestion")}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  ref={confirmButtonRef}
                  type="button"
                  onClick={() => void runGenerate(confirmation.replace)}
                  className={primaryButton}
                >
                  {t("confirm")}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmation(null)}
                  className={secondaryButton}
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap gap-3">
              {!saved ? (
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={isBusy}
                  className={secondaryButton}
                >
                  {busy === "saving" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  {busy === "saving" ? t("saving") : t("save")}
                </button>
              ) : null}

              <button
                type="button"
                onClick={requestGenerate}
                disabled={isBusy}
                className={primaryButton}
              >
                {busy === "generating" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {hasImage ? t("regenerate") : t("generate")}
              </button>
            </div>
          )}

          {/* Announced to screen readers; also visible while the image is created. */}
          <p
            aria-live="polite"
            className={
              busy === "generating"
                ? "mt-4 text-sm leading-6 text-[#6c5d50]"
                : "sr-only"
            }
          >
            {busy === "generating" ? t("generating") : ""}
          </p>
        </>
      )}

      <div aria-live="assertive" className={errorCode ? "mt-4" : undefined}>
        {errorCode ? (
          <p
            role="alert"
            className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800"
          >
            {t(`errors.${errorCode}`)}
            {errorCode === "quota_exhausted" ? (
              <>
                {" "}
                <Link
                  href="/mon-compte"
                  className="font-medium underline underline-offset-4"
                >
                  {t("viewAccount")}
                </Link>
              </>
            ) : null}
          </p>
        ) : null}
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        // Nothing is saved or generated after signing in: the visitor comes back
        // to the same result and presses the buttons themselves.
        onAuthSuccess={() => undefined}
      />
    </section>
  );
}
