export type CreationType = "mural" | "objeto" | "luminosa";

export type Direction =
  | "organique"
  | "minimal"
  | "oceanique"
  | "lumineux"
  | "origami"
  | "abstrait"
  | "geometrique"
  | "botanique"
  | "figuratif";

export type PanelColor =
  | "noir" | "blanc" | "beige" | "dore" | "bleu" | "vert" | "jaune"
  | "rouge" | "orange" | "brun" | "gris" | "turquoise" | "rose"
  | "multicolore" | "degrade";

export type PanelSize = "30x40" | "50x70" | "70x100";
export type FrameColor = "noir" | "blanc" | "dore";
export type FrameMaterial = "metal" | "bois";

export interface GeneratorHints {
  type?: CreationType;
  direction?: Partial<Record<Direction, number>>;
  colors?: PanelColor[];
  size?: PanelSize;
  frame?: boolean;
}

export interface GeneratorConfig {
  type: CreationType;
  direction: Direction;
  colors: PanelColor[];
  size: PanelSize;
  frame: boolean;
  frameColor?: FrameColor;
  frameMaterial?: FrameMaterial;
}

// Allowed values, used to validate anything that arrives through the URL.
export const CREATION_TYPES: readonly CreationType[] = ["mural", "objeto", "luminosa"];

export const DIRECTIONS: readonly Direction[] = [
  "organique",
  "minimal",
  "oceanique",
  "lumineux",
  "origami",
  "abstrait",
  "geometrique",
  "botanique",
  "figuratif",
];

export const PANEL_COLORS: readonly PanelColor[] = [
  "noir", "blanc", "beige", "dore", "bleu", "vert", "jaune",
  "rouge", "orange", "brun", "gris", "turquoise", "rose",
  "multicolore", "degrade",
];

export const PANEL_SIZES: readonly PanelSize[] = ["30x40", "50x70", "70x100"];
export const FRAME_COLORS: readonly FrameColor[] = ["noir", "blanc", "dore"];
export const FRAME_MATERIALS: readonly FrameMaterial[] = ["metal", "bois"];
