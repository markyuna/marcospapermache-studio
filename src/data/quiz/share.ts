import { QUESTIONS } from "./questions";
import type { Answers } from "./scoring";

// Una posición por pregunta (orden de QUESTIONS): índice de la opción o "-"
export function encodeAnswers(answers: Answers): string {
  return QUESTIONS.map((q) => {
    const idx = q.options.findIndex((o) => o.id === answers[q.id]);
    return idx >= 0 ? String(idx) : "-";
  }).join("");
}

export function decodeAnswers(code: string | null): Answers | null {
  if (!code || code.length !== QUESTIONS.length) return null;
  const answers: Answers = {};
  for (let i = 0; i < QUESTIONS.length; i++) {
    const ch = code[i];
    if (ch === "-") continue;
    const option = QUESTIONS[i].options[Number(ch)];
    if (!/^\d$/.test(ch) || !option) return null;
    answers[QUESTIONS[i].id] = option.id;
  }
  return answers;
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
