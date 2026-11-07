export type ProfileId =
  | "contemplativo"
  | "onirico"
  | "animal"
  | "vibrante"
  | "minimalista";

export interface QuizProfile {
  id: ProfileId;
  // Slugs de esculturas reales del catálogo (los "REEMPLAZAR-..." son placeholders)
  sculptureSlugs: string[];
  // Claves de next-intl: quiz.profiles.<id>.prompts.<key>
  promptKeys: string[];
}

const PROMPT_KEYS = ["p1", "p2", "p3", "p4", "p5", "p6"];

// El orden define el desempate: en caso de empate gana el primero
export const PROFILES: QuizProfile[] = [
  { id: "contemplativo", sculptureSlugs: ["REEMPLAZAR-slug-1", "REEMPLAZAR-slug-2"], promptKeys: PROMPT_KEYS },
  { id: "onirico", sculptureSlugs: ["REEMPLAZAR-slug-3", "REEMPLAZAR-slug-4"], promptKeys: PROMPT_KEYS },
  { id: "animal", sculptureSlugs: ["REEMPLAZAR-slug-5", "REEMPLAZAR-slug-6"], promptKeys: PROMPT_KEYS },
  { id: "vibrante", sculptureSlugs: ["REEMPLAZAR-slug-7", "REEMPLAZAR-slug-8"], promptKeys: PROMPT_KEYS },
  { id: "minimalista", sculptureSlugs: ["REEMPLAZAR-slug-9", "REEMPLAZAR-slug-10"], promptKeys: PROMPT_KEYS },
];

export const PROFILE_IDS: ProfileId[] = PROFILES.map((p) => p.id);

export function isProfileId(value: string | null): value is ProfileId {
  return value !== null && (PROFILE_IDS as string[]).includes(value);
}
