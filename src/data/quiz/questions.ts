import type { GeneratorHints } from "./generator";
import type { ProfileId } from "./profiles";

export interface QuizOption {
  id: string; // clave: quiz.questions.<questionId>.options.<id>
  scores: Partial<Record<ProfileId, number>>;
  generator?: GeneratorHints;
}

export interface QuizQuestion {
  id: string; // clave: quiz.questions.<id>.title
  options: QuizOption[];
  // Si existe y devuelve false, la pregunta se salta
  visibleIf?: (answers: Record<string, string>) => boolean;
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "ambiente",
    options: [
      { id: "bosque", scores: { contemplativo: 1, animal: 2 }, generator: { direction: { botanique: 2 } } },
      { id: "oceano", scores: { contemplativo: 2, onirico: 1 }, generator: { direction: { oceanique: 2 } } },
      { id: "ciudad", scores: { onirico: 1, vibrante: 2 }, generator: { direction: { lumineux: 2 } } },
      { id: "desierto", scores: { minimalista: 2 }, generator: { direction: { minimal: 2 } } },
    ],
  },
  {
    id: "emocion",
    options: [
      { id: "calma", scores: { contemplativo: 2, minimalista: 1 }, generator: { direction: { organique: 1, minimal: 1, oceanique: 1 } } },
      { id: "misterio", scores: { onirico: 2 }, generator: { direction: { abstrait: 1, lumineux: 1 } } },
      { id: "energia", scores: { vibrante: 2 }, generator: { direction: { lumineux: 1, geometrique: 1, abstrait: 1 } } },
      { id: "ternura", scores: { animal: 2, contemplativo: 1 }, generator: { direction: { figuratif: 1, botanique: 1, organique: 1 } } },
    ],
  },
  {
    id: "forma",
    options: [
      { id: "mural", scores: { onirico: 1, minimalista: 1 }, generator: { type: "mural" } },
      { id: "objeto", scores: { animal: 1, minimalista: 1 }, generator: { type: "objeto" } },
      { id: "luminosa", scores: { onirico: 1, vibrante: 1 }, generator: { type: "luminosa" } },
    ],
  },
  {
    id: "ubicacion_luz",
    visibleIf: (answers) => answers.forma === "luminosa",
    options: [
      { id: "pie", scores: {}, generator: { lightType: "pied" } },
      { id: "mesa", scores: {}, generator: { lightType: "table" } },
      { id: "techo", scores: {}, generator: { lightType: "suspension" } },
      { id: "pared", scores: {}, generator: { lightType: "applique" } },
    ],
  },
  {
    id: "difusion_luz",
    visibleIf: (answers) => answers.forma === "luminosa",
    options: [
      { id: "interior", scores: {}, generator: { lightDiffusion: "interieure" } },
      { id: "indirecta", scores: {}, generator: { lightDiffusion: "indirecte" } },
      { id: "recortes", scores: {}, generator: { lightDiffusion: "ajouree" } },
    ],
  },
  {
    id: "estilo",
    options: [
      { id: "organico", scores: { contemplativo: 1, animal: 1 }, generator: { direction: { organique: 2 } } },
      { id: "geometrico", scores: { vibrante: 2, minimalista: 1 }, generator: { direction: { geometrique: 2 } } },
      { id: "minimal", scores: { minimalista: 2 }, generator: { direction: { minimal: 2 } } },
      { id: "surrealista", scores: { onirico: 2 }, generator: { direction: { abstrait: 2 } } },
      { id: "figurativo", scores: { animal: 2 }, generator: { direction: { figuratif: 2 } } },
      { id: "origami", scores: { minimalista: 1, vibrante: 1 }, generator: { direction: { origami: 2 } } },
    ],
  },
  {
    id: "paleta",
    options: [
      { id: "tierra", scores: { contemplativo: 1, animal: 2 }, generator: { colors: ["beige", "brun", "vert"], direction: { botanique: 1 } } },
      { id: "vivos", scores: { vibrante: 2 }, generator: { colors: ["rouge", "orange", "jaune", "degrade"] } },
      { id: "monocromo", scores: { minimalista: 2, onirico: 1 }, generator: { colors: ["noir", "blanc", "gris"] } },
      { id: "nocturna", scores: { onirico: 2, contemplativo: 1 }, generator: { colors: ["bleu", "dore"], direction: { lumineux: 1 } } },
      { id: "pasteles", scores: { animal: 1, vibrante: 1 }, generator: { colors: ["rose", "beige", "blanc"] } },
      { id: "mar", scores: { contemplativo: 2, onirico: 1 }, generator: { colors: ["turquoise", "bleu", "degrade"], direction: { oceanique: 1 } } },
      // Last on purpose: share codes store the option's index.
      { id: "crema", scores: { minimalista: 2, contemplativo: 1 }, generator: { colors: ["blanc", "beige"] } },
    ],
  },
  {
    id: "textura",
    options: [
      { id: "piedra", scores: {}, generator: { texture: "pierre" } },
      { id: "lisa", scores: {}, generator: { texture: "lisse" } },
      { id: "relieve", scores: {}, generator: { texture: "relief" } },
    ],
  },
  {
    id: "espacio",
    // Light sculptures have no size in the generator panel, so asking is moot.
    visibleIf: (answers) => answers.forma !== "luminosa",
    options: [
      { id: "rincon", scores: {}, generator: { size: "30x40" } },
      { id: "medio", scores: {}, generator: { size: "50x70" } },
      { id: "grande", scores: {}, generator: { size: "70x100" } },
    ],
  },
  {
    id: "marco",
    visibleIf: (answers) => answers.forma === "mural",
    options: [
      { id: "abierto", scores: {}, generator: { frame: true } },
      { id: "sin", scores: {}, generator: { frame: false } },
    ],
  },
];
