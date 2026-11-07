// src/components/quiz/QuestionCard.tsx
"use client";

import { useRef, type KeyboardEvent } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import type { QuizQuestion } from "@/data/quiz/questions";
import { cn } from "@/lib/utils";

type QuestionCardProps = {
  question: QuizQuestion;
  selectedOptionId: string | undefined;
  onSelect: (optionId: string) => void;
};

export default function QuestionCard({
  question,
  selectedOptionId,
  onSelect,
}: QuestionCardProps) {
  const t = useTranslations("quiz.questions");
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const titleId = `quiz-question-${question.id}`;
  const lastIndex = question.options.length - 1;
  const isLong = question.options.length >= 5;
  const selectedIndex = question.options.findIndex(
    (option) => option.id === selectedOptionId
  );
  // Roving tabindex: a single tab stop, on the selected option (or the first).
  const tabStopIndex = selectedIndex >= 0 ? selectedIndex : 0;

  function focusOption(index: number) {
    optionRefs.current[index]?.focus();
  }

  // Arrow keys only move focus; Space/Enter (native button click) selects, so
  // that browsing options never triggers the auto-advance.
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        focusOption(index === lastIndex ? 0 : index + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        focusOption(index === 0 ? lastIndex : index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusOption(0);
        break;
      case "End":
        event.preventDefault();
        focusOption(lastIndex);
        break;
    }
  }

  return (
    <div>
      <h2
        id={titleId}
        className="text-center text-2xl font-semibold tracking-[-0.04em] text-[#1c1c1a] md:text-4xl"
      >
        {t(`${question.id}.title`)}
      </h2>

      <div
        role="radiogroup"
        aria-labelledby={titleId}
        className={cn(
          "mt-8 grid gap-3 md:mt-10 md:gap-4",
          // 5-6 options: two columns as soon as they fit (one only on very
          // narrow screens); fewer options keep a single column on mobile.
          isLong ? "grid-cols-1 min-[360px]:grid-cols-2" : "sm:grid-cols-2"
        )}
      >
        {question.options.map((option, index) => {
          const isSelected = option.id === selectedOptionId;

          return (
            <button
              key={option.id}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={index === tabStopIndex ? 0 : -1}
              onClick={() => onSelect(option.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "group flex min-h-[72px] items-center justify-between gap-3 rounded-[1.5rem] border px-4 py-4 text-left text-sm font-medium shadow-[0_10px_30px_rgba(70,48,24,0.05)] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c65400]/50 focus-visible:ring-offset-2 min-[420px]:gap-4 min-[420px]:px-5 min-[420px]:text-base md:min-h-[96px] md:px-6 md:text-lg",
                isSelected
                  ? "border-[#c65400] bg-white text-[#1c1c1a]"
                  : "border-[#e7d5c5] bg-white/70 text-[#4f4338] hover:-translate-y-0.5 hover:border-[#ff6a00]/40 hover:bg-white"
              )}
            >
              <span>{t(`${question.id}.options.${option.id}`)}</span>
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition duration-300",
                  isSelected
                    ? "border-[#c65400] bg-[#c65400] text-white"
                    : "border-[#d9c6b4] text-transparent"
                )}
              >
                <Check className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
