import type { GeneratorConfig } from "./generator";
import type { ProfileId } from "./profiles";
import {
  computeGeneratorConfig,
  computeProfile,
  getVisibleQuestions,
  pruneAnswers,
  type Answers,
} from "./scoring";
import { codeQuestionIds, decodeAnswers, encodeAnswers } from "./share";

export type QuizOutcome = {
  profileId: ProfileId;
  // null for legacy ?p= links: only the profile is known.
  config: GeneratorConfig | null;
  // Canonical answers code; also the seed for the stable prompt pick.
  // null for legacy ?p= links (seed 0, shared back as ?p=).
  code: string | null;
};

// What a valid answers code always resolves to: nothing is missing.
export type ResolvedQuizOutcome = {
  profileId: ProfileId;
  config: GeneratorConfig;
  code: string;
};

export function outcomeFromAnswers(answers: Answers): ResolvedQuizOutcome {
  // Answers to questions that are not visible (e.g. "marco" after switching the
  // form away from mural) must not change the code.
  const pruned = pruneAnswers(answers);

  return {
    profileId: computeProfile(pruned),
    config: computeGeneratorConfig(pruned),
    code: encodeAnswers(pruned),
  };
}

// Turns an untrusted ?r= code into the outcome the quiz shows, or null when it
// is not a complete, well-formed set of answers. Pure and shared by the quiz UI
// and anything on the server that must not trust what the client claims: the
// profile and configuration are always recomputed from the answers.
export function resolveQuizOutcome(
  code: string | null | undefined
): ResolvedQuizOutcome | null {
  const decoded = decodeAnswers(code ?? null);
  if (!decoded) return null;

  // A code only answers the questions that existed when it was made.
  const covered = new Set(codeQuestionIds(code ?? ""));
  const complete = getVisibleQuestions(decoded).every(
    (question) => !covered.has(question.id) || decoded[question.id] !== undefined
  );
  if (!complete) return null;

  // Re-encoding gives the canonical code, so a hand-edited one cannot alias.
  return outcomeFromAnswers(decoded);
}
