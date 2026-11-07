// src/components/quiz/QuizFlow.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import QuestionCard from "@/components/quiz/QuestionCard";
import QuizResult, { type QuizArtwork } from "@/components/quiz/QuizResult";
import { GradientTitle } from "@/components/ui/GradientTitle";
import {
  outcomeFromAnswers,
  resolveQuizOutcome,
  type QuizOutcome,
} from "@/data/quiz/outcome";
import { isProfileId } from "@/data/quiz/profiles";
import { getVisibleQuestions, pruneAnswers, type Answers } from "@/data/quiz/scoring";
import { useRouter } from "@/i18n/navigation";

const AUTO_ADVANCE_MS = 250;

// Shared links: ?r=<answers code> carries everything; a bare ?p=<profile> from
// the first version of the quiz still opens that profile. Anything that does
// not decode to a complete set of answers is ignored.
function outcomeFromParams(params: {
  get(name: string): string | null;
}): QuizOutcome | null {
  const fromCode = resolveQuizOutcome(params.get("r"));
  if (fromCode) return fromCode;

  const legacy = params.get("p");
  if (isProfileId(legacy)) {
    return { profileId: legacy, config: null, code: null };
  }

  return null;
}

type QuizFlowProps = {
  artworks: QuizArtwork[];
};

export default function QuizFlow({ artworks }: QuizFlowProps) {
  const t = useTranslations("quiz");
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  // Read once: the component owns the state afterwards and only mirrors the
  // outcome into the URL.
  const [outcome, setOutcome] = useState<QuizOutcome | null>(() =>
    outcomeFromParams(searchParams)
  );
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearAdvanceTimer, [clearAdvanceTimer]);

  // "marco" only exists for mural pieces, so the total can change after the
  // "forma" answer; clamp in case the user went back and shrank the list.
  const visibleQuestions = getVisibleQuestions(answers);
  const total = visibleQuestions.length;
  const safeIndex = Math.min(index, total - 1);
  const question = visibleQuestions[safeIndex];
  const selectedOptionId = answers[question.id];

  const finish = useCallback(
    (finalAnswers: Answers) => {
      const pruned = pruneAnswers(finalAnswers);
      const result = outcomeFromAnswers(pruned);

      setOutcome(result);
      router.replace(`/quiz?r=${result.code}`, { scroll: false });
    },
    [router]
  );

  const goNext = useCallback(
    (currentAnswers: Answers) => {
      clearAdvanceTimer();

      if (safeIndex >= getVisibleQuestions(currentAnswers).length - 1) {
        finish(currentAnswers);
        return;
      }

      setIndex(safeIndex + 1);
    },
    [clearAdvanceTimer, finish, safeIndex]
  );

  function handleSelect(optionId: string) {
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);

    clearAdvanceTimer();
    advanceTimerRef.current = setTimeout(() => goNext(nextAnswers), AUTO_ADVANCE_MS);
  }

  function handleBack() {
    clearAdvanceTimer();

    if (safeIndex === 0) {
      setStarted(false);
      return;
    }

    setIndex(safeIndex - 1);
  }

  function handleRetake() {
    clearAdvanceTimer();
    setOutcome(null);
    setStarted(false);
    setIndex(0);
    setAnswers({});
    router.replace("/quiz", { scroll: false });
  }

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const };
  const offset = reduceMotion ? 0 : 24;

  if (outcome) {
    return (
      <QuizResult
        profileId={outcome.profileId}
        config={outcome.config}
        code={outcome.code}
        artworks={artworks}
        onRetake={handleRetake}
      />
    );
  }

  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: offset }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="mx-auto max-w-2xl py-8 text-center md:py-16"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#ead9cb] bg-white/80 shadow-[0_10px_30px_rgba(70,48,24,0.06)]">
          <Sparkles className="h-6 w-6 text-[#c8873f]" />
        </div>

        <h1 className="mt-8 text-4xl font-semibold tracking-[-0.05em] text-[#1c1c1a] md:text-6xl">
          <GradientTitle text={t("title")} />
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[#6c5d50] md:text-lg">
          {t("subtitle")}
        </p>

        <button
          type="button"
          onClick={() => setStarted(true)}
          className="btn-gold-shimmer mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c65400]/50 focus-visible:ring-offset-2"
        >
          {t("start")}
          <ArrowRight className="h-4 w-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 md:mb-10">
        <p
          aria-live="polite"
          className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b07a52]"
        >
          {t("progress", { current: safeIndex + 1, total })}
        </p>

        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={safeIndex + 1}
          aria-label={t("progress", { current: safeIndex + 1, total })}
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#ead9cb]"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#ff6a00] to-[#c8873f] transition-[width] duration-500"
            style={{ width: `${((safeIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: offset }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -offset }}
          transition={transition}
        >
          <QuestionCard
            question={question}
            selectedOptionId={selectedOptionId}
            onSelect={handleSelect}
          />
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between gap-4 md:mt-10">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-full border border-[#e7d5c5] bg-white/80 px-5 py-3 text-sm font-medium text-[#4f4338] transition duration-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c65400]/50 focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </button>

        <button
          type="button"
          disabled={!selectedOptionId}
          onClick={() => goNext(answers)}
          className="inline-flex items-center gap-2 rounded-full bg-[#171311] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c65400]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("next")}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
