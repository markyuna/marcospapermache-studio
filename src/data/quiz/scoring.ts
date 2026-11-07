import type {
  CreationType,
  Direction,
  FrameColor,
  FrameMaterial,
  GeneratorConfig,
  PanelColor,
  PanelSize,
} from "./generator";
import { PROFILES, type ProfileId } from "./profiles";
import { QUESTIONS, type QuizOption, type QuizQuestion } from "./questions";
import { encodeAnswers, mixSeed, seedFromCode } from "./share";

export type Answers = Record<string, string>;

export function getVisibleQuestions(answers: Answers): QuizQuestion[] {
  return QUESTIONS.filter((q) => !q.visibleIf || q.visibleIf(answers));
}

// Drops answers to questions that are no longer visible (e.g. "marco" after
// switching "forma" away from mural), so equal journeys give equal codes.
export function pruneAnswers(answers: Answers): Answers {
  const pruned: Answers = {};
  for (const q of getVisibleQuestions(answers)) {
    if (answers[q.id] !== undefined) pruned[q.id] = answers[q.id];
  }
  return pruned;
}

function selectedOptions(answers: Answers): QuizOption[] {
  return getVisibleQuestions(answers).flatMap((q) => {
    const option = q.options.find((o) => o.id === answers[q.id]);
    return option ? [option] : [];
  });
}

export function computeProfile(answers: Answers): ProfileId {
  const totals = Object.fromEntries(
    PROFILES.map((p) => [p.id, 0])
  ) as Record<ProfileId, number>;

  for (const option of selectedOptions(answers)) {
    for (const [profile, pts] of Object.entries(option.scores)) {
      totals[profile as ProfileId] += pts ?? 0;
    }
  }

  const max = Math.max(...Object.values(totals));
  const tied = PROFILES.filter((p) => totals[p.id] === max);
  if (tied.length === 1) return tied[0].id;

  // Desempate: se elige entre los empatados con un hash de las respuestas.
  // Es estable para las mismas respuestas, pero no favorece a ningún perfil
  // (con el orden de PROFILES, el primero ganaba todos los empates). Otra sal
  // distinta de la de pickPromptKeys evita que ambas elecciones se correlacionen.
  const code = encodeAnswers(pruneAnswers(answers));
  return tied[mixSeed(seedFromCode(code) ^ 0x7f4a7c15) % tied.length].id;
}

export function computeGeneratorConfig(answers: Answers): GeneratorConfig {
  const votes: Partial<Record<Direction, number>> = {};
  const colors: PanelColor[] = [];
  let type: CreationType = "mural";
  let size: PanelSize = "50x70";
  let frame = false;

  for (const option of selectedOptions(answers)) {
    const g = option.generator;
    if (!g) continue;
    if (g.type) type = g.type;
    if (g.size) size = g.size;
    if (g.frame !== undefined) frame = g.frame;
    for (const c of g.colors ?? []) {
      if (!colors.includes(c)) colors.push(c);
    }
    for (const [d, pts] of Object.entries(g.direction ?? {})) {
      votes[d as Direction] = (votes[d as Direction] ?? 0) + (pts ?? 0);
    }
  }

  // Empate de dirección: gana la dirección de la pregunta "estilo"
  const styleDirection =
    QUESTIONS.find((q) => q.id === "estilo")?.options.find(
      (o) => o.id === answers.estilo
    )?.generator?.direction ?? {};

  let direction: Direction = "abstrait";
  let bestRank = -1;
  for (const d of Object.keys(votes) as Direction[]) {
    const rank = (votes[d] ?? 0) * 10 + (styleDirection[d] ?? 0);
    if (rank > bestRank) {
      bestRank = rank;
      direction = d;
    }
  }

  const hasMarco = type === "mural" && frame;
  const frameColor: FrameColor = colors.includes("dore")
    ? "dore"
    : colors.some((c) => ["noir", "bleu", "gris"].includes(c))
      ? "noir"
      : "blanc";
  const frameMaterial: FrameMaterial = colors.some((c) =>
    ["beige", "brun", "vert", "rose"].includes(c)
  )
    ? "bois"
    : "metal";

  return {
    type,
    direction,
    colors: colors.slice(0, 4),
    size,
    frame: hasMarco,
    ...(hasMarco ? { frameColor, frameMaterial } : {}),
  };
}
