import {
  CREATION_TYPES,
  DIRECTIONS,
  FRAME_COLORS,
  FRAME_MATERIALS,
  PANEL_COLORS,
  PANEL_SIZES,
  type CreationType,
  type Direction,
  type FrameColor,
  type FrameMaterial,
  type GeneratorConfig,
  type PanelColor,
  type PanelSize,
} from "./generator";

// Quiz ids (French, as used in the URL) → the generator panel's own state ids
// in AIExperienceSection. Keep them in sync with that component.
export const PANEL_TYPE = {
  mural: "wall",
  objeto: "object",
  luminosa: "light",
} as const satisfies Record<CreationType, string>;

export const PANEL_DIRECTION = {
  organique: "organic",
  minimal: "minimal",
  oceanique: "oceanic",
  lumineux: "luminous",
  origami: "origami",
  abstrait: "abstract",
  geometrique: "geometric",
  botanique: "botanical",
  figuratif: "figurative",
} as const satisfies Record<Direction, string>;

export const PANEL_COLOR = {
  noir: "black",
  blanc: "white",
  beige: "beige",
  dore: "gold",
  bleu: "blue",
  vert: "green",
  jaune: "yellow",
  rouge: "red",
  orange: "orange",
  brun: "brown",
  gris: "gray",
  turquoise: "turquoise",
  rose: "pink",
  multicolore: "multicolor",
  degrade: "gradient",
} as const satisfies Record<PanelColor, string>;

export const PANEL_FRAME_COLOR = {
  noir: "black",
  blanc: "white",
  dore: "gold",
} as const satisfies Record<FrameColor, string>;

export const PANEL_FRAME_MATERIAL = {
  metal: "metal",
  bois: "wood",
} as const satisfies Record<FrameMaterial, string>;

// Wall sizes share ids with the panel; objects only have three formats.
export const PANEL_OBJECT_SIZE = {
  "30x40": "small",
  "50x70": "medium",
  "70x100": "large",
} as const satisfies Record<PanelSize, string>;

export const MAX_PREFILL_PROMPT_LENGTH = 500;
export const MAX_PREFILL_COLORS = 4;

export interface GeneratorPrefill {
  prompt?: string;
  type?: CreationType;
  direction?: Direction;
  colors?: PanelColor[];
  size?: PanelSize;
  frame?: boolean;
  frameColor?: FrameColor;
  frameMaterial?: FrameMaterial;
}

export function buildGeneratorQuery(
  prompt: string,
  config: GeneratorConfig | null
): string {
  const params = new URLSearchParams({ prompt });

  if (config) {
    params.set("type", config.type);
    params.set("direction", config.direction);
    if (config.colors.length > 0) params.set("colors", config.colors.join(","));
    // Light sculptures have no size in the panel.
    if (config.type !== "luminosa") params.set("size", config.size);
    if (config.type === "mural") {
      params.set("frame", config.frame ? "1" : "0");
      if (config.frame && config.frameColor) {
        params.set("frameColor", config.frameColor);
      }
      if (config.frame && config.frameMaterial) {
        params.set("frameMaterial", config.frameMaterial);
      }
    }
  }

  return params.toString();
}

function pick<T extends string>(
  value: string | null,
  allowed: readonly T[]
): T | undefined {
  return allowed.find((item) => item === value);
}

// Everything here comes from the URL, so each field is checked against the
// allowed values and anything unknown is dropped. Values are only ever used as
// state ids or as plain text for a textarea — never as HTML.
export function parseGeneratorParams(params: {
  get(name: string): string | null;
}): GeneratorPrefill {
  const prefill: GeneratorPrefill = {};

  const prompt = params
    .get("prompt")
    ?.trim()
    .slice(0, MAX_PREFILL_PROMPT_LENGTH)
    .trim();
  if (prompt) prefill.prompt = prompt;

  const type = pick(params.get("type"), CREATION_TYPES);
  if (type) prefill.type = type;

  const direction = pick(params.get("direction"), DIRECTIONS);
  if (direction) prefill.direction = direction;

  const colors = (params.get("colors") ?? "")
    .split(",")
    .map((item) => pick(item, PANEL_COLORS))
    .filter((item): item is PanelColor => item !== undefined);
  const uniqueColors = [...new Set(colors)].slice(0, MAX_PREFILL_COLORS);
  if (uniqueColors.length > 0) prefill.colors = uniqueColors;

  const size = pick(params.get("size"), PANEL_SIZES);
  if (size) prefill.size = size;

  const frame = params.get("frame");
  if (frame === "1") prefill.frame = true;
  if (frame === "0") prefill.frame = false;

  const frameColor = pick(params.get("frameColor"), FRAME_COLORS);
  if (frameColor) prefill.frameColor = frameColor;

  const frameMaterial = pick(params.get("frameMaterial"), FRAME_MATERIALS);
  if (frameMaterial) prefill.frameMaterial = frameMaterial;

  return prefill;
}
