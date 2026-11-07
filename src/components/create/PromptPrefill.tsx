// src/components/create/PromptPrefill.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import {
  parseGeneratorParams,
  type GeneratorPrefill,
} from "@/data/quiz/generator-params";

type PromptPrefillProps = {
  onPrefill: (prefill: GeneratorPrefill) => void;
};

// Reads the prefill params (?prompt=, ?type=, ?direction=, …) once on mount and
// hands the validated values to the generator. It only fills the form —
// generating stays an explicit user action. Rendered inside <Suspense> because
// useSearchParams opts the page out of static rendering otherwise.
export default function PromptPrefill({ onPrefill }: PromptPrefillProps) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    const prefill = parseGeneratorParams(new URLSearchParams(query));
    if (Object.keys(prefill).length > 0) onPrefill(prefill);
  }, [query, onPrefill]);

  return null;
}
