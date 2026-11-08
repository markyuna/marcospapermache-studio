import { QUESTIONS, type QuizQuestion } from "./questions";
import type { Answers } from "./scoring";

// Posición de cada pregunta en el código. Va aparte del orden en que se muestran
// (QUESTIONS) porque los códigos se guardan y se comparten: una pregunta nueva
// siempre se añade al FINAL. Las LEGACY_CODE_LENGTH primeras posiciones son el
// quiz anterior a las preguntas de luz y textura.
const CODE_ORDER = [
  "ambiente",
  "emocion",
  "forma",
  "estilo",
  "paleta",
  "espacio",
  "marco",
  "ubicacion_luz",
  "difusion_luz",
  "textura",
];
export const LEGACY_CODE_LENGTH = 7;

const CODE_QUESTIONS: QuizQuestion[] = CODE_ORDER.map((id) => {
  const question = QUESTIONS.find((q) => q.id === id);
  if (!question) throw new Error(`Quiz code order: unknown question "${id}"`);
  return question;
});
if (CODE_QUESTIONS.length !== QUESTIONS.length) {
  throw new Error("Quiz code order must list every question exactly once");
}

// Una posición por pregunta (orden de CODE_ORDER): índice de la opción o "-".
// Las posiciones vacías del final (más allá del quiz antiguo) se quitan, así un
// conjunto de respuestas sin las preguntas nuevas conserva su código de antes
// (y con él el desempate de perfil y los prompts).
export function encodeAnswers(answers: Answers): string {
  const chars = CODE_QUESTIONS.map((q) => {
    const idx = q.options.findIndex((o) => o.id === answers[q.id]);
    return idx >= 0 ? String(idx) : "-";
  });
  while (chars.length > LEGACY_CODE_LENGTH && chars[chars.length - 1] === "-") {
    chars.pop();
  }
  return chars.join("");
}

export function decodeAnswers(code: string | null): Answers | null {
  if (
    !code ||
    code.length < LEGACY_CODE_LENGTH ||
    code.length > CODE_QUESTIONS.length
  ) {
    return null;
  }
  const answers: Answers = {};
  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    if (ch === "-") continue;
    const option = CODE_QUESTIONS[i].options[Number(ch)];
    if (!/^\d$/.test(ch) || !option) return null;
    answers[CODE_QUESTIONS[i].id] = option.id;
  }
  return answers;
}

// Las preguntas que un código cubre: uno de antes de las preguntas nuevas está
// completo sin ellas.
export function codeQuestionIds(code: string): string[] {
  return CODE_ORDER.slice(0, code.length);
}

// Finalizador de murmur3: reparte bien los bits. Sin él, `hash % n` solo
// depende de la suma de las respuestas y reparte mal las claves y los pares.
export function mixSeed(value: number): number {
  let h = value >>> 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

export function seedFromCode(code: string): number {
  let h = 0;
  for (let i = 0; i < code.length; i++) {
    h = (h * 31 + code.charCodeAt(i)) >>> 0;
  }
  return mixSeed(h);
}

// Elige 2 claves distintas de forma estable para un mismo seed
export function pickPromptKeys(keys: string[], seed: number): string[] {
  if (keys.length < 2) return keys;
  const first = seed % keys.length;
  // Segundo mezclado: la primera y la segunda clave no deben correlacionarse.
  const offset = 1 + (mixSeed(seed ^ 0x9e3779b9) % (keys.length - 1));
  return [keys[first], keys[(first + offset) % keys.length]];
}
