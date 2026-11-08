// src/lib/generator-prompt.ts
// The "enriched prompt" of the image generator, as a pure function so the panel
// (AIExperienceSection) and any server code build exactly the same text.
// Keep this file free of React and server-only imports.

export type CreationType = "wall" | "object" | "light";

export type StyleId =
  | "organic"
  | "minimal"
  | "oceanic"
  | "luminous"
  | "origami"
  | "abstract"
  | "geometric"
  | "botanical"
  | "figurative";

export type ColorId =
  | "black"
  | "white"
  | "beige"
  | "gold"
  | "blue"
  | "green"
  | "yellow"
  | "red"
  | "orange"
  | "brown"
  | "gray"
  | "turquoise"
  | "pink"
  | "multicolor"
  | "gradient";

export type WallSizeId = "30x40" | "50x70" | "70x100";
export type ObjectSizeId = "small" | "medium" | "large";
export type FrameColorId = "black" | "white" | "gold";
export type FrameMaterialId = "metal" | "wood";
export type ObjectUsageId = "table" | "shelf" | "floor";
export type ObjectFinishId = "matte" | "glossy" | "metallic";
export type LightTypeId =
  | "tableLamp"
  | "floorLamp"
  | "wallLight"
  | "ceilingLight"
  | "lightSculpture";
export type LightTemperatureId = "warm" | "neutral" | "cool";
export type LightIntensityId = "subtle" | "medium" | "strong";
export type LightDiffusionId = "inner" | "indirect" | "cutouts";
export type TextureId = "stone" | "smooth" | "relief";

// Display order of the palette. The prompt lists colours in THIS order, not in
// the order the visitor picked them.
export const COLOR_IDS: readonly ColorId[] = [
  "black",
  "white",
  "beige",
  "gold",
  "blue",
  "green",
  "yellow",
  "red",
  "orange",
  "brown",
  "gray",
  "turquoise",
  "pink",
  "multicolor",
  "gradient",
];

export const STYLE_IDS: readonly StyleId[] = [
  "organic",
  "minimal",
  "oceanic",
  "luminous",
  "origami",
  "abstract",
  "geometric",
  "botanical",
  "figurative",
];

type StyleFragments = { framed: string; object: string; light: string };

const STYLE_FRAGMENTS: Record<StyleId, StyleFragments> = {
  organic: {
    framed:
      "organic sculptural composition adapted to framed wall art, balanced relief structure, elegant flowing forms, controlled expansion, composition designed to preserve the full frame visibility",
    object:
      "organic sculptural object with flowing handmade forms, soft volume transitions, elegant three-dimensional presence, refined artisan finish",
    light:
      "organic luminous sculpture with fluid sculptural lines, warm atmospheric presence, refined handcrafted structure designed to interact beautifully with light",
  },
  minimal: {
    framed:
      "minimal sculptural composition adapted to framed wall art, restrained relief, refined clean volumes, disciplined composition that fully respects the frame and preserves the frame as a visible design element",
    object:
      "minimal sculptural object with clean lines, restrained geometry, elegant contemporary presence, refined and balanced proportions",
    light:
      "minimal luminous sculpture with clean geometry, elegant light diffusion, refined contemporary silhouette, sophisticated restraint",
  },
  oceanic: {
    framed:
      "ocean-inspired sculptural composition adapted to framed wall art, fluid layered relief, elegant wave-like movement with controlled depth, composition arranged to keep the frame fully visible",
    object:
      "ocean-inspired sculptural object with fluid layered forms, wave-like movement, soft organic rhythm, elegant handcrafted texture",
    light:
      "ocean-inspired luminous sculpture with flowing shapes, soft ambient glow, fluid movement, poetic light diffusion",
  },
  luminous: {
    framed:
      "luminous sculptural composition adapted to framed wall art, refined light-inspired relief, subtle radiant accents, composition built to preserve full frame visibility on all sides",
    object:
      "luminous-inspired sculptural object with radiant accents, elegant handcrafted texture, artistic presence, sophisticated contemporary feel",
    light:
      "luminous sculptural light piece with visible glow, elegant ambient illumination, refined handcrafted paper texture, atmospheric presence",
  },
  origami: {
    framed:
      "origami-inspired sculptural composition adapted to framed wall art, folded geometric planes, crisp faceted relief, elegant angular paper-like construction, structured composition designed to remain centered and fully contained inside a clearly visible open frame",
    object:
      "origami-inspired sculptural object with folded geometric planes, crisp edges, elegant angular volumes, handcrafted paper-based construction",
    light:
      "origami-inspired luminous sculpture with faceted folded surfaces, geometric light play, elegant angular construction, refined artistic glow",
  },
  abstract: {
    framed:
      "abstract sculptural composition adapted to framed wall art, non-figurative relief, expressive balanced forms, bold artistic gesture, composition designed to preserve the full frame visibility",
    object:
      "abstract sculptural object with expressive non-figurative forms, bold artistic volumes, elegant handcrafted texture, contemporary gallery presence",
    light:
      "abstract luminous sculpture with expressive non-figurative forms, bold artistic silhouette, refined handcrafted texture, atmospheric glow",
  },
  geometric: {
    framed:
      "geometric sculptural composition adapted to framed wall art, precise angular relief, structured repeating volumes, disciplined graphic composition designed to preserve the full frame visibility",
    object:
      "geometric sculptural object with precise angular volumes, structured repeating forms, elegant handcrafted texture, refined contemporary presence",
    light:
      "geometric luminous sculpture with precise angular facets, structured light play, elegant handcrafted texture, refined contemporary glow",
  },
  botanical: {
    framed:
      "botanical sculptural composition adapted to framed wall art, leaf and branch inspired relief, delicate organic rhythm, composition designed to preserve the full frame visibility",
    object:
      "botanical sculptural object with leaf and branch inspired forms, delicate organic texture, elegant handcrafted presence, refined artisan finish",
    light:
      "botanical luminous sculpture with leaf and branch inspired silhouette, delicate organic texture, soft atmospheric glow, refined handcrafted presence",
  },
  figurative: {
    framed:
      "figurative sculptural composition adapted to framed wall art, stylized human or animal silhouette, refined relief, composition designed to preserve the full frame visibility",
    object:
      "figurative sculptural object with stylized human or animal form, refined handcrafted texture, elegant artistic presence, sophisticated silhouette",
    light:
      "figurative luminous sculpture with stylized human or animal silhouette, soft ambient glow, refined handcrafted texture, atmospheric presence",
  },
};

const COLOR_PROMPTS: Record<ColorId, string> = {
  black: "black color accents",
  white: "white tones",
  beige: "beige tones, soft neutral warmth",
  gold: "gold accents, refined metallic highlights",
  blue: "blue tones, deep or soft variations",
  green: "green tones, natural organic feel",
  yellow: "yellow accents, warm luminous tones",
  red: "red accents, expressive artistic tone",
  orange: "orange tones, warm vibrant energy",
  brown: "brown tones, earthy material feel",
  gray: "gray tones, refined neutral finish",
  turquoise: "turquoise tones, vivid refreshing accent",
  pink: "soft pink tones, delicate refined accent",
  multicolor: "rich multicolor composition, expressive handcrafted palette",
  gradient:
    "smooth gradient transitions between the selected colors, elegant blended tones across the sculpture",
};

const WALL_SIZE_PROMPTS: Record<WallSizeId, string> = {
  "30x40":
    "vertical format artwork, portrait orientation, aspect ratio 3:4, proportions of a 30 x 40 cm wall piece, realistic scale as a small wall artwork",
  "50x70":
    "vertical format artwork, portrait orientation, aspect ratio 5:7, proportions of a 50 x 70 cm wall piece, realistic scale as a medium-sized wall artwork",
  "70x100":
    "vertical format artwork, portrait orientation, aspect ratio 7:10, proportions of a 70 x 100 cm wall piece, realistic scale as a large wall artwork",
};

const OBJECT_SIZE_PROMPTS: Record<ObjectSizeId, string> = {
  small:
    "small decorative sculpture, approximately 20 to 30 cm, compact format, elegant tabletop scale",
  medium:
    "medium decorative sculpture, approximately 40 to 60 cm, balanced sculptural presence, suitable for a console or side table",
  large:
    "large decorative sculpture, approximately 70 cm or more, strong sculptural presence, gallery-style object scale",
};

const FRAME_COLOR_PROMPTS: Record<FrameColorId, string> = {
  black: "black",
  white: "white",
  gold: "gold",
};

const FRAME_MATERIAL_PROMPTS: Record<FrameMaterialId, string> = {
  metal: "metal",
  wood: "wood",
};

const OBJECT_USAGE_PROMPTS: Record<ObjectUsageId, string> = {
  table:
    "designed for a table or console display, front-facing studio object presentation",
  shelf:
    "designed for a shelf display, compact elegant composition, decorative interior object",
  floor:
    "designed as a floor-standing sculptural object, strong vertical presence, gallery-inspired display",
};

const OBJECT_FINISH_PROMPTS: Record<ObjectFinishId, string> = {
  matte: "matte finish, soft artisanal surface, refined understated texture",
  glossy:
    "slightly glossy finish, subtle reflective accents, elegant polished handmade surface",
  metallic:
    "metallic finish accents, refined industrial sheen, sophisticated contemporary character",
};

const LIGHT_TYPE_PROMPTS: Record<LightTypeId, string> = {
  tableLamp:
    "papier-mâché sculptural table lamp, decorative lighting object, designed for a table or console",
  floorLamp:
    "papier-mâché sculptural floor lamp, tall freestanding lighting sculpture standing directly on the floor, strong vertical presence",
  wallLight:
    "papier-mâché sculptural wall light, artistic applique murale, elegant wall-mounted lighting piece",
  ceilingLight:
    "papier-mâché sculptural ceiling light, artistic suspension or plafonnier, elegant overhead lighting object",
  lightSculpture:
    "papier-mâché luminous sculpture, artistic object combining sculptural form and integrated light",
};

const LIGHT_TEMPERATURE_PROMPTS: Record<LightTemperatureId, string> = {
  warm: "warm light, cozy ambient glow, golden illumination",
  neutral:
    "neutral light, balanced illumination, elegant and natural atmosphere",
  cool: "cool light, contemporary crisp illumination, modern atmosphere",
};

const LIGHT_INTENSITY_PROMPTS: Record<LightIntensityId, string> = {
  subtle: "subtle light intensity, soft atmospheric glow, discreet illumination",
  medium:
    "medium light intensity, balanced luminous presence, refined decorative illumination",
  strong:
    "strong light intensity, pronounced luminous presence, bold artistic lighting effect",
};

const LIGHT_DIFFUSION_PROMPTS: Record<LightDiffusionId, string> = {
  inner:
    "soft diffused light glowing from within the sculpture, light emanating from inside the hollow form, warm translucent inner glow",
  indirect:
    "indirect lighting, hidden light source, light bouncing off the wall and floor, soft halo around the sculpture",
  cutouts:
    "light passing through openings and cut-outs in the sculpture, projected patterns of light and shadow on the surrounding surfaces",
};

const TEXTURE_PROMPTS: Record<TextureId, string> = {
  stone:
    "matte mineral texture like stone or sand, fine granular handmade surface, tactile natural finish",
  smooth:
    "smooth refined surface, soft seamless finish, delicately sanded papier-mâché",
  relief:
    "pronounced surface relief, visible folds, layers and handmade marks, rich tactile texture",
};

export type GenerationSelection = {
  // Free text typed by the visitor (or a ready-made quiz prompt).
  prompt: string;
  styleId: StyleId | null;
  colors: readonly ColorId[];
  creationType: CreationType;
  wallSize: WallSizeId;
  withFrame: boolean;
  frameColor: FrameColorId;
  frameMaterial: FrameMaterialId;
  objectSize: ObjectSizeId;
  objectUsage: ObjectUsageId;
  objectFinish: ObjectFinishId;
  lightType: LightTypeId;
  lightTemperature: LightTemperatureId;
  lightIntensity: LightIntensityId;
  // Optional: null adds nothing to the prompt.
  lightDiffusion: LightDiffusionId | null;
  texture: TextureId | null;
};

// The translated pieces. They depend on the locale, so the caller supplies them
// (the panel from useTranslations, a route from getTranslations).
export type GenerationText = {
  enrichedSuffix: string;
  stylePrompt: (styleId: StyleId) => string;
};

// The panel's initial state: what is left untouched when only some options are
// chosen (e.g. the quiz does not ask for object usage or light temperature).
export const DEFAULT_GENERATION_SELECTION: Omit<GenerationSelection, "prompt"> = {
  styleId: null,
  colors: [],
  creationType: "wall",
  wallSize: "50x70",
  withFrame: false,
  frameColor: "black",
  frameMaterial: "metal",
  objectSize: "medium",
  objectUsage: "table",
  objectFinish: "matte",
  lightType: "tableLamp",
  lightTemperature: "warm",
  lightIntensity: "medium",
  lightDiffusion: null,
  texture: null,
};

export function buildGenerationPrompt(
  selection: GenerationSelection,
  text: GenerationText,
): string {
  const { prompt, styleId, creationType } = selection;

  const stylePrompt = styleId ? text.stylePrompt(styleId) : null;
  const style = styleId ? STYLE_FRAGMENTS[styleId] : undefined;

  const hasGradient = selection.colors.includes("gradient");
  const baseColors = COLOR_IDS.filter(
    (id) => id !== "gradient" && selection.colors.includes(id),
  );

  let basePrompt = "";

  if (!prompt.trim() && stylePrompt !== null) {
    basePrompt = stylePrompt;
  } else if (prompt.trim() && stylePrompt !== null) {
    basePrompt = `${prompt.trim()}. ${text.enrichedSuffix} ${stylePrompt}`;
  } else {
    basePrompt = prompt.trim();
  }

  if (!basePrompt) return "";

  if (baseColors.length > 0) {
    const colorPrompts = baseColors.map((id) => COLOR_PROMPTS[id]).join(", ");
    basePrompt += `, ${colorPrompts}`;

    if (baseColors.length > 1) {
      basePrompt +=
        ", harmonious combination of the selected colors, balanced artistic composition";
    }
  }

  if (hasGradient && baseColors.length >= 2) {
    basePrompt += `, ${COLOR_PROMPTS.gradient}`;
  }

  if (selection.texture) {
    basePrompt += `, ${TEXTURE_PROMPTS[selection.texture]}`;
  }

  if (creationType === "wall") {
    const sizePrompt = WALL_SIZE_PROMPTS[selection.wallSize];

    basePrompt +=
      ", contemporary papier-mâché wall sculpture, artistic bas-relief, elegant handcrafted wall composition";

    if (sizePrompt) {
      basePrompt += `, ${sizePrompt}`;
    }

    if (selection.withFrame) {
      const colorPrompt = FRAME_COLOR_PROMPTS[selection.frameColor];
      const materialPrompt = FRAME_MATERIAL_PROMPTS[selection.frameMaterial];

      const frameDescription = `clearly visible thin flat open ${colorPrompt ?? "black"} ${materialPrompt ?? "metal"} frame`;

      basePrompt +=
        `, designed as framed wall art, ${frameDescription}, ` +
        "front-facing centered composition, " +
        "the entire outer frame must be fully visible on all four sides, " +
        "comfortable and even margin around the full frame, " +
        "no cropped frame, no cut frame, no partial frame, no cut-off corners, " +
        "the frame is an essential and visible part of the artwork, " +
        "the sculpture is physically attached to and integrated into the frame, " +
        "the sculpture may interact with the inner edges of the frame, " +
        "but the outer perimeter of the frame must remain entirely visible and readable, " +
        "zoomed out slightly so the whole frame fits naturally inside the image, " +
        "neutral studio-style presentation, no room staging, no furniture, no large decorative background, " +
        "premium contemporary art photography, realistic handmade texture, subtle natural shadows, open frame only, flat frame only, visible frame structure, no invisible frame, no box frame, no shadow box, no display case, no glass enclosure";

      if (style?.framed) {
        basePrompt += `, ${style.framed}`;
      }
    } else {
      basePrompt +=
        ", presented as a standalone wall sculpture without frame, no frame, no border, no encadrement, neutral studio presentation, premium contemporary art photography, realistic handmade texture";
    }
  }

  if (creationType === "object") {
    const sizePrompt = OBJECT_SIZE_PROMPTS[selection.objectSize];
    const usagePrompt = OBJECT_USAGE_PROMPTS[selection.objectUsage];
    const finishPrompt = OBJECT_FINISH_PROMPTS[selection.objectFinish];

    basePrompt +=
      ", contemporary papier-mâché sculptural object, fully three-dimensional decorative sculpture, not wall-mounted, not framed, freestanding object";

    if (sizePrompt) {
      basePrompt += `, ${sizePrompt}`;
    }

    if (usagePrompt) {
      basePrompt += `, ${usagePrompt}`;
    }

    if (finishPrompt) {
      basePrompt += `, ${finishPrompt}`;
    }

    basePrompt +=
      ", studio product photography, isolated elegant presentation, refined handmade texture, subtle natural shadow, premium decorative object";

    if (style?.object) {
      basePrompt += `, ${style.object}`;
    }
  }

  if (creationType === "light") {
    const typePrompt = LIGHT_TYPE_PROMPTS[selection.lightType];
    const temperaturePrompt = LIGHT_TEMPERATURE_PROMPTS[selection.lightTemperature];
    const intensityPrompt = LIGHT_INTENSITY_PROMPTS[selection.lightIntensity];

    basePrompt +=
      ", contemporary papier-mâché luminous sculpture, integrated lighting design, handcrafted artistic light object";

    if (typePrompt) {
      basePrompt += `, ${typePrompt}`;
    }

    if (temperaturePrompt) {
      basePrompt += `, ${temperaturePrompt}`;
    }

    if (intensityPrompt) {
      basePrompt += `, ${intensityPrompt}`;
    }

    if (selection.lightDiffusion) {
      basePrompt += `, ${LIGHT_DIFFUSION_PROMPTS[selection.lightDiffusion]}`;
    }

    basePrompt +=
      ", visible light emission, elegant glow, premium decorative lighting photography, dark refined background, atmospheric but clean presentation";

    if (style?.light) {
      basePrompt += `, ${style.light}`;
    }
  }

  return basePrompt;
}
