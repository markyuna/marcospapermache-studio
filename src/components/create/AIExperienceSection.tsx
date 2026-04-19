"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Lamp,
  Loader2,
  Palette,
  RefreshCcw,
  Ruler,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";

type GenerateImageResponse = {
  image?: string;
  error?: string;
};

type CreationType = "wall" | "object" | "light";

type WallSizeOption = {
  id: "30x40" | "50x70" | "70x100";
  label: string;
  prompt: string;
};

type ObjectSizeOption = {
  id: "small" | "medium" | "large";
  label: string;
  prompt: string;
};

type LightingIntensity = "subtle" | "medium" | "strong";
type LightingTemperature = "warm" | "neutral" | "cool";

type FrameColor = "black" | "white" | "gold";
type FrameMaterial = "metal" | "wood";

type ObjectUsage = "table" | "shelf" | "floor";
type ObjectFinish = "matte" | "glossy" | "metallic";

type LightType = "tableLamp" | "wallLight" | "ceilingLight" | "lightSculpture";

type ColorOption =
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
  | "multicolor"
  | "gradient";

type StylePresetId =
  | "organic"
  | "minimal"
  | "oceanic"
  | "luminous"
  | "origami";

type StylePreset = {
  id: StylePresetId;
  label: string;
  prompt: string;
  framedPrompt?: string;
  objectPrompt?: string;
  lightPrompt?: string;
};

type SelectOption<T extends string> = {
  id: T;
  label: string;
  prompt: string;
};

export default function AIExperienceSection() {
  const t = useTranslations("AIExperience");
  const router = useRouter();

  const stylePresets: readonly StylePreset[] = [
    {
      id: "organic",
      label: t("styles.organic.label"),
      prompt: t("styles.organic.prompt"),
      framedPrompt:
        "organic sculptural composition adapted to framed wall art, balanced relief structure, elegant flowing forms, controlled expansion, composition designed to preserve the full frame visibility",
      objectPrompt:
        "organic sculptural object with flowing handmade forms, soft volume transitions, elegant three-dimensional presence, refined artisan finish",
      lightPrompt:
        "organic luminous sculpture with fluid sculptural lines, warm atmospheric presence, refined handcrafted structure designed to interact beautifully with light",
    },
    {
      id: "minimal",
      label: t("styles.minimal.label"),
      prompt: t("styles.minimal.prompt"),
      framedPrompt:
        "minimal sculptural composition adapted to framed wall art, restrained relief, refined clean volumes, disciplined composition that fully respects the frame and preserves the frame as a visible design element",
      objectPrompt:
        "minimal sculptural object with clean lines, restrained geometry, elegant contemporary presence, refined and balanced proportions",
      lightPrompt:
        "minimal luminous sculpture with clean geometry, elegant light diffusion, refined contemporary silhouette, sophisticated restraint",
    },
    {
      id: "oceanic",
      label: t("styles.oceanic.label"),
      prompt: t("styles.oceanic.prompt"),
      framedPrompt:
        "ocean-inspired sculptural composition adapted to framed wall art, fluid layered relief, elegant wave-like movement with controlled depth, composition arranged to keep the frame fully visible",
      objectPrompt:
        "ocean-inspired sculptural object with fluid layered forms, wave-like movement, soft organic rhythm, elegant handcrafted texture",
      lightPrompt:
        "ocean-inspired luminous sculpture with flowing shapes, soft ambient glow, fluid movement, poetic light diffusion",
    },
    {
      id: "luminous",
      label: t("styles.luminous.label"),
      prompt: t("styles.luminous.prompt"),
      framedPrompt:
        "luminous sculptural composition adapted to framed wall art, refined light-inspired relief, subtle radiant accents, composition built to preserve full frame visibility on all sides",
      objectPrompt:
        "luminous-inspired sculptural object with radiant accents, elegant handcrafted texture, artistic presence, sophisticated contemporary feel",
      lightPrompt:
        "luminous sculptural light piece with visible glow, elegant ambient illumination, refined handcrafted paper texture, atmospheric presence",
    },
    {
      id: "origami",
      label: t("styles.origami.label"),
      prompt: t("styles.origami.prompt"),
      framedPrompt:
        "origami-inspired sculptural composition adapted to framed wall art, folded geometric planes, crisp faceted relief, elegant angular paper-like construction, structured composition designed to remain centered and fully contained inside a clearly visible open frame",
      objectPrompt:
        "origami-inspired sculptural object with folded geometric planes, crisp edges, elegant angular volumes, handcrafted paper-based construction",
      lightPrompt:
        "origami-inspired luminous sculpture with faceted folded surfaces, geometric light play, elegant angular construction, refined artistic glow",
    },
  ] as const;

  const wallSizeOptions: readonly WallSizeOption[] = [
    {
      id: "30x40",
      label: t("sizes.wall.small"),
      prompt:
        "vertical format artwork, portrait orientation, aspect ratio 3:4, proportions of a 30 x 40 cm wall piece, realistic scale as a small wall artwork",
    },
    {
      id: "50x70",
      label: t("sizes.wall.medium"),
      prompt:
        "vertical format artwork, portrait orientation, aspect ratio 5:7, proportions of a 50 x 70 cm wall piece, realistic scale as a medium-sized wall artwork",
    },
    {
      id: "70x100",
      label: t("sizes.wall.large"),
      prompt:
        "vertical format artwork, portrait orientation, aspect ratio 7:10, proportions of a 70 x 100 cm wall piece, realistic scale as a large wall artwork",
    },
  ] as const;

  const objectSizeOptions: readonly SelectOption<ObjectSizeOption["id"]>[] = [
    {
      id: "small",
      label: t("sizes.object.small"),
      prompt:
        "small decorative sculpture, approximately 20 to 30 cm, compact format, elegant tabletop scale",
    },
    {
      id: "medium",
      label: t("sizes.object.medium"),
      prompt:
        "medium decorative sculpture, approximately 40 to 60 cm, balanced sculptural presence, suitable for a console or side table",
    },
    {
      id: "large",
      label: t("sizes.object.large"),
      prompt:
        "large decorative sculpture, approximately 70 cm or more, strong sculptural presence, gallery-style object scale",
    },
  ] as const;

  const frameColors: readonly SelectOption<FrameColor>[] = [
    { id: "black", label: t("frameColors.black"), prompt: "black" },
    { id: "white", label: t("frameColors.white"), prompt: "white" },
    { id: "gold", label: t("frameColors.gold"), prompt: "gold" },
  ] as const;

  const frameMaterials: readonly SelectOption<FrameMaterial>[] = [
    { id: "metal", label: t("frameMaterials.metal"), prompt: "metal" },
    { id: "wood", label: t("frameMaterials.wood"), prompt: "wood" },
  ] as const;

  const objectUsages: readonly SelectOption<ObjectUsage>[] = [
    {
      id: "table",
      label: t("objectUsage.table"),
      prompt:
        "designed for a table or console display, front-facing studio object presentation",
    },
    {
      id: "shelf",
      label: t("objectUsage.shelf"),
      prompt:
        "designed for a shelf display, compact elegant composition, decorative interior object",
    },
    {
      id: "floor",
      label: t("objectUsage.floor"),
      prompt:
        "designed as a floor-standing sculptural object, strong vertical presence, gallery-inspired display",
    },
  ] as const;

  const objectFinishes: readonly SelectOption<ObjectFinish>[] = [
    {
      id: "matte",
      label: t("objectFinish.matte"),
      prompt: "matte finish, soft artisanal surface, refined understated texture",
    },
    {
      id: "glossy",
      label: t("objectFinish.glossy"),
      prompt:
        "slightly glossy finish, subtle reflective accents, elegant polished handmade surface",
    },
    {
      id: "metallic",
      label: t("objectFinish.metallic"),
      prompt:
        "metallic finish accents, refined industrial sheen, sophisticated contemporary character",
    },
  ] as const;

  const lightTypes: readonly SelectOption<LightType>[] = [
    {
      id: "tableLamp",
      label: t("lightTypes.tableLamp"),
      prompt:
        "papier-mâché sculptural table lamp, decorative lighting object, designed for a table or console",
    },
    {
      id: "wallLight",
      label: t("lightTypes.wallLight"),
      prompt:
        "papier-mâché sculptural wall light, artistic applique murale, elegant wall-mounted lighting piece",
    },
    {
      id: "ceilingLight",
      label: t("lightTypes.ceilingLight"),
      prompt:
        "papier-mâché sculptural ceiling light, artistic suspension or plafonnier, elegant overhead lighting object",
    },
    {
      id: "lightSculpture",
      label: t("lightTypes.lightSculpture"),
      prompt:
        "papier-mâché luminous sculpture, artistic object combining sculptural form and integrated light",
    },
  ] as const;

  const lightTemperatures: readonly SelectOption<LightingTemperature>[] = [
    {
      id: "warm",
      label: t("lightTemperature.warm"),
      prompt: "warm light, cozy ambient glow, golden illumination",
    },
    {
      id: "neutral",
      label: t("lightTemperature.neutral"),
      prompt:
        "neutral light, balanced illumination, elegant and natural atmosphere",
    },
    {
      id: "cool",
      label: t("lightTemperature.cool"),
      prompt: "cool light, contemporary crisp illumination, modern atmosphere",
    },
  ] as const;

  const lightIntensities: readonly SelectOption<LightingIntensity>[] = [
    {
      id: "subtle",
      label: t("lightIntensity.subtle"),
      prompt:
        "subtle light intensity, soft atmospheric glow, discreet illumination",
    },
    {
      id: "medium",
      label: t("lightIntensity.medium"),
      prompt:
        "medium light intensity, balanced luminous presence, refined decorative illumination",
    },
    {
      id: "strong",
      label: t("lightIntensity.strong"),
      prompt:
        "strong light intensity, pronounced luminous presence, bold artistic lighting effect",
    },
  ] as const;

  const colorOptions: readonly SelectOption<ColorOption>[] = [
    { id: "black", label: t("colors.black"), prompt: "black color accents" },
    { id: "white", label: t("colors.white"), prompt: "white tones" },
    {
      id: "beige",
      label: t("colors.beige"),
      prompt: "beige tones, soft neutral warmth",
    },
    {
      id: "gold",
      label: t("colors.gold"),
      prompt: "gold accents, refined metallic highlights",
    },
    {
      id: "blue",
      label: t("colors.blue"),
      prompt: "blue tones, deep or soft variations",
    },
    {
      id: "green",
      label: t("colors.green"),
      prompt: "green tones, natural organic feel",
    },
    {
      id: "yellow",
      label: t("colors.yellow"),
      prompt: "yellow accents, warm luminous tones",
    },
    {
      id: "red",
      label: t("colors.red"),
      prompt: "red accents, expressive artistic tone",
    },
    {
      id: "orange",
      label: t("colors.orange"),
      prompt: "orange tones, warm vibrant energy",
    },
    {
      id: "brown",
      label: t("colors.brown"),
      prompt: "brown tones, earthy material feel",
    },
    {
      id: "multicolor",
      label: t("colors.multicolor"),
      prompt: "rich multicolor composition, expressive handcrafted palette",
    },
    {
      id: "gradient",
      label: t("colors.gradient"),
      prompt:
        "smooth gradient transitions between the selected colors, elegant blended tones across the sculpture",
    },
  ] as const;

  const [prompt, setPrompt] = useState("");
  const [creationType, setCreationType] = useState<CreationType>("wall");
  const [selectedStyle, setSelectedStyle] = useState<StylePresetId | null>(null);

  const [selectedWallSize, setSelectedWallSize] =
    useState<WallSizeOption["id"]>("50x70");
  const [selectedObjectSize, setSelectedObjectSize] =
    useState<ObjectSizeOption["id"]>("medium");

  const [withFrame, setWithFrame] = useState(false);
  const [frameColor, setFrameColor] = useState<FrameColor>("black");
  const [frameMaterial, setFrameMaterial] = useState<FrameMaterial>("metal");

  const [selectedObjectUsage, setSelectedObjectUsage] =
    useState<ObjectUsage>("table");
  const [selectedObjectFinish, setSelectedObjectFinish] =
    useState<ObjectFinish>("matte");

  const [selectedLightType, setSelectedLightType] =
    useState<LightType>("tableLamp");
  const [selectedLightTemperature, setSelectedLightTemperature] =
    useState<LightingTemperature>("warm");
  const [selectedLightIntensity, setSelectedLightIntensity] =
    useState<LightingIntensity>("medium");

  const [selectedColors, setSelectedColors] = useState<ColorOption[]>([]);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isLoading) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLoading]);

  const previewAspectClass = useMemo(() => {
    if (creationType === "wall") {
      switch (selectedWallSize) {
        case "30x40":
          return "aspect-[3/4]";
        case "50x70":
          return "aspect-[5/7]";
        case "70x100":
          return "aspect-[7/10]";
        default:
          return "aspect-[5/7]";
      }
    }

    if (creationType === "light" && selectedLightType === "ceilingLight") {
      return "aspect-[4/5]";
    }

    return "aspect-square";
  }, [creationType, selectedWallSize, selectedLightType]);

  const nonGradientSelectedColors = useMemo(
    () => selectedColors.filter((color) => color !== "gradient"),
    [selectedColors],
  );

  const canShowGradientOption = nonGradientSelectedColors.length >= 2;

  const visibleColorOptions = useMemo(() => {
    return colorOptions.filter(
      (option) => option.id !== "gradient" || canShowGradientOption,
    );
  }, [colorOptions, canShowGradientOption]);

  useEffect(() => {
    if (!canShowGradientOption && selectedColors.includes("gradient")) {
      setSelectedColors((current) => current.filter((item) => item !== "gradient"));
    }
  }, [canShowGradientOption, selectedColors]);

  const selectedColorLabels = useMemo(() => {
    return colorOptions
      .filter((color) => selectedColors.includes(color.id))
      .map((color) => color.label);
  }, [colorOptions, selectedColors]);

  const fullPrompt = useMemo(() => {
    const preset = stylePresets.find((item) => item.id === selectedStyle);
    const colors = colorOptions.filter((item) => selectedColors.includes(item.id));
    const hasGradient = selectedColors.includes("gradient");
    const baseSelectedColors = colors.filter((color) => color.id !== "gradient");

    let basePrompt = "";

    if (!prompt.trim() && preset) {
      basePrompt = preset.prompt;
    } else if (prompt.trim() && preset) {
      basePrompt = `${prompt.trim()}. ${t("promptEnrichedSuffix")} ${preset.prompt}`;
    } else {
      basePrompt = prompt.trim();
    }

    if (!basePrompt) return "";

    if (baseSelectedColors.length > 0) {
      const colorPrompts = baseSelectedColors.map((color) => color.prompt).join(", ");
      basePrompt += `, ${colorPrompts}`;

      if (baseSelectedColors.length > 1) {
        basePrompt +=
          ", harmonious combination of the selected colors, balanced artistic composition";
      }
    }

    if (hasGradient && baseSelectedColors.length >= 2) {
      const gradientOption = colorOptions.find((item) => item.id === "gradient");

      if (gradientOption) {
        basePrompt += `, ${gradientOption.prompt}`;
      }
    }

    if (creationType === "wall") {
      const sizePreset = wallSizeOptions.find(
        (item) => item.id === selectedWallSize,
      );

      basePrompt +=
        ", contemporary papier-mâché wall sculpture, artistic bas-relief, elegant handcrafted wall composition";

      if (sizePreset) {
        basePrompt += `, ${sizePreset.prompt}`;
      }

      if (withFrame) {
        const colorPreset = frameColors.find((item) => item.id === frameColor);
        const materialPreset = frameMaterials.find(
          (item) => item.id === frameMaterial,
        );

        const frameDescription = `clearly visible thin flat open ${colorPreset?.prompt ?? "black"} ${materialPreset?.prompt ?? "metal"} frame`;

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

        if (preset?.framedPrompt) {
          basePrompt += `, ${preset.framedPrompt}`;
        }
      } else {
        basePrompt +=
          ", presented as a standalone wall sculpture without frame, no frame, no border, no encadrement, neutral studio presentation, premium contemporary art photography, realistic handmade texture";
      }
    }

    if (creationType === "object") {
      const objectSize = objectSizeOptions.find(
        (item) => item.id === selectedObjectSize,
      );
      const usage = objectUsages.find((item) => item.id === selectedObjectUsage);
      const finish = objectFinishes.find(
        (item) => item.id === selectedObjectFinish,
      );

      basePrompt +=
        ", contemporary papier-mâché sculptural object, fully three-dimensional decorative sculpture, not wall-mounted, not framed, freestanding object";

      if (objectSize) {
        basePrompt += `, ${objectSize.prompt}`;
      }

      if (usage) {
        basePrompt += `, ${usage.prompt}`;
      }

      if (finish) {
        basePrompt += `, ${finish.prompt}`;
      }

      basePrompt +=
        ", studio product photography, isolated elegant presentation, refined handmade texture, subtle natural shadow, premium decorative object";

      if (preset?.objectPrompt) {
        basePrompt += `, ${preset.objectPrompt}`;
      }
    }

    if (creationType === "light") {
      const lightType = lightTypes.find((item) => item.id === selectedLightType);
      const lightTemp = lightTemperatures.find(
        (item) => item.id === selectedLightTemperature,
      );
      const intensity = lightIntensities.find(
        (item) => item.id === selectedLightIntensity,
      );

      basePrompt +=
        ", contemporary papier-mâché luminous sculpture, integrated lighting design, handcrafted artistic light object";

      if (lightType) {
        basePrompt += `, ${lightType.prompt}`;
      }

      if (lightTemp) {
        basePrompt += `, ${lightTemp.prompt}`;
      }

      if (intensity) {
        basePrompt += `, ${intensity.prompt}`;
      }

      basePrompt +=
        ", visible light emission, elegant glow, premium decorative lighting photography, dark refined background, atmospheric but clean presentation";

      if (preset?.lightPrompt) {
        basePrompt += `, ${preset.lightPrompt}`;
      }
    }

    return basePrompt;
  }, [
    colorOptions,
    creationType,
    frameColor,
    frameMaterial,
    objectFinishes,
    objectSizeOptions,
    objectUsages,
    prompt,
    selectedColors,
    selectedLightIntensity,
    selectedLightTemperature,
    selectedLightType,
    selectedObjectFinish,
    selectedObjectSize,
    selectedObjectUsage,
    selectedStyle,
    selectedWallSize,
    stylePresets,
    t,
    wallSizeOptions,
    withFrame,
    lightIntensities,
    lightTemperatures,
    lightTypes,
    frameColors,
    frameMaterials,
  ]);

  function toggleColor(colorId: ColorOption) {
    setSelectedColors((current) => {
      if (current.includes(colorId)) {
        return current.filter((item) => item !== colorId);
      }

      return [...current, colorId];
    });
  }

  function scrollToResult(offset = 100) {
    if (!resultRef.current || typeof window === "undefined") return;

    const top =
      resultRef.current.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }

  async function handleGenerate() {
    if (!fullPrompt) {
      setError(t("errors.emptyPrompt"));
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setGeneratedImage(null);

      requestAnimationFrame(() => {
        scrollToResult(90);
      });

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          size:
            creationType === "wall"
              ? selectedWallSize
              : creationType === "object"
                ? selectedObjectSize
                : selectedLightType,
          creationType,
          withFrame: creationType === "wall" ? withFrame : false,
        }),
      });

      const data: GenerateImageResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errors.generationFailed"));
      }

      if (!data.image) {
        throw new Error(t("errors.noImageReturned"));
      }

      setGeneratedImage(data.image);
      setLastPrompt(fullPrompt);

      requestAnimationFrame(() => {
        scrollToResult(90);
      });

      setTimeout(() => {
        scrollToResult(90);
      }, 250);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("errors.unknown");
      setError(message);

      requestAnimationFrame(() => {
        scrollToResult(90);
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setPrompt("");
    setCreationType("wall");
    setSelectedStyle(null);
    setSelectedWallSize("50x70");
    setSelectedObjectSize("medium");
    setWithFrame(false);
    setFrameColor("black");
    setFrameMaterial("metal");
    setSelectedObjectUsage("table");
    setSelectedObjectFinish("matte");
    setSelectedLightType("tableLamp");
    setSelectedLightTemperature("warm");
    setSelectedLightIntensity("medium");
    setSelectedColors([]);
    setGeneratedImage(null);
    setLastPrompt("");
    setError("");

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("generatedImage");
      sessionStorage.removeItem("generatedCreationType");
      sessionStorage.removeItem("generatedWallSize");
      sessionStorage.removeItem("generatedObjectSize");
      sessionStorage.removeItem("generatedPalette");
      sessionStorage.removeItem("generatedPalettes");
      sessionStorage.removeItem("generatedColors");
      sessionStorage.removeItem("generatedFrameColor");
      sessionStorage.removeItem("generatedFrameMaterial");
      sessionStorage.removeItem("generatedWithFrame");
      sessionStorage.removeItem("generatedLightType");
      sessionStorage.removeItem("generatedLightTemperature");
      sessionStorage.removeItem("generatedLightIntensity");
      sessionStorage.removeItem("generatedObjectUsage");
      sessionStorage.removeItem("generatedObjectFinish");
    }
  }

  function handleOrderClick() {
    if (!generatedImage) return;

    if (typeof window !== "undefined") {
      sessionStorage.setItem("generatedImage", generatedImage);
      sessionStorage.setItem("generatedCreationType", creationType);
      sessionStorage.setItem("generatedWallSize", selectedWallSize);
      sessionStorage.setItem("generatedObjectSize", selectedObjectSize);
      sessionStorage.setItem("generatedPalette", selectedColors.join(","));
      sessionStorage.setItem("generatedPalettes", JSON.stringify(selectedColors));
      sessionStorage.setItem("generatedColors", JSON.stringify(selectedColors));
      sessionStorage.setItem("generatedFrameColor", frameColor);
      sessionStorage.setItem("generatedFrameMaterial", frameMaterial);
      sessionStorage.setItem("generatedWithFrame", String(withFrame));
      sessionStorage.setItem("generatedLightType", selectedLightType);
      sessionStorage.setItem(
        "generatedLightTemperature",
        selectedLightTemperature,
      );
      sessionStorage.setItem("generatedLightIntensity", selectedLightIntensity);
      sessionStorage.setItem("generatedObjectUsage", selectedObjectUsage);
      sessionStorage.setItem("generatedObjectFinish", selectedObjectFinish);
    }

    router.push({
      pathname: "/commande",
      query: {
        prompt: lastPrompt,
        creationType,
        wallSize: creationType === "wall" ? selectedWallSize : "none",
        objectSize: creationType === "object" ? selectedObjectSize : "none",
        palette: selectedColors.length > 0 ? selectedColors.join(",") : "none",
        frame: creationType === "wall" && withFrame ? "open" : "none",
        frameColor:
          creationType === "wall" && withFrame ? frameColor : "none",
        frameMaterial:
          creationType === "wall" && withFrame ? frameMaterial : "none",
        lightType: creationType === "light" ? selectedLightType : "none",
        lightTemperature:
          creationType === "light" ? selectedLightTemperature : "none",
        lightIntensity:
          creationType === "light" ? selectedLightIntensity : "none",
        objectUsage:
          creationType === "object" ? selectedObjectUsage : "none",
        objectFinish:
          creationType === "object" ? selectedObjectFinish : "none",
      },
    });
  }

  function renderPillButton(
    label: string,
    isActive: boolean,
    onClick: () => void,
    disabled = false,
    icon?: ReactNode,
  ) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm transition duration-300 disabled:cursor-not-allowed disabled:opacity-60",
          isActive
            ? "border-[#d9b08c] bg-[#d9b08c]/14 text-white shadow-[0_0_0_1px_rgba(217,176,140,0.22)]"
            : "border-white/10 bg-white/[0.05] text-neutral-300 hover:border-white/20 hover:bg-white/[0.09] hover:text-white",
        ].join(" ")}
      >
        {icon}
        {label}
      </button>
    );
  }

  function renderCardButton(
    label: string,
    isActive: boolean,
    onClick: () => void,
    disabled = false,
    icon?: ReactNode,
  ) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={[
          "flex items-center justify-center gap-2 rounded-[1.2rem] border px-4 py-3 text-sm transition duration-300 disabled:cursor-not-allowed disabled:opacity-60",
          isActive
            ? "border-[#d9b08c] bg-[#d9b08c]/14 text-white shadow-[0_0_0_1px_rgba(217,176,140,0.22)]"
            : "border-white/10 bg-white/[0.05] text-neutral-300 hover:border-white/20 hover:bg-white/[0.09] hover:text-white",
        ].join(" ")}
      >
        {icon}
        {label}
      </button>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0b0b0d] p-6 text-white shadow-[0_30px_120px_rgba(0,0,0,0.38)] md:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(205,164,124,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_24%)]" />

      <div className="relative grid gap-10 xl:grid-cols-[0.96fr_1.04fr] xl:gap-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.28em] text-neutral-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <Sparkles className="h-4 w-4" />
            {t("badge")}
          </p>

          <h1 className="mt-6 max-w-3xl bg-gradient-to-br from-white via-[#ffe7d1] to-[#d07a2d] bg-clip-text text-4xl font-semibold tracking-[-0.05em] text-transparent drop-shadow-[0_0_18px_rgba(208,122,45,0.16)] md:text-6xl">
            {t("title")}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
            {t("description")}
          </p>

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-6">
            <div>
              <p className="text-sm font-medium text-neutral-200">
                {t("form.creationTypeLabel")}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {renderPillButton(
                  t("creationTypes.wall"),
                  creationType === "wall",
                  () => setCreationType("wall"),
                  isLoading,
                  <Sparkles className="h-4 w-4" />,
                )}
                {renderPillButton(
                  t("creationTypes.object"),
                  creationType === "object",
                  () => setCreationType("object"),
                  isLoading,
                  <Palette className="h-4 w-4" />,
                )}
                {renderPillButton(
                  t("creationTypes.light"),
                  creationType === "light",
                  () => setCreationType("light"),
                  isLoading,
                  <Lamp className="h-4 w-4" />,
                )}
              </div>
            </div>

            <div className="mt-7">
              <p className="text-sm font-medium text-neutral-200">
                {t("form.styleLabel")}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {stylePresets.map((preset) => {
                  const isActive = selectedStyle === preset.id;

                  return (
                    <div key={preset.id}>
                      {renderPillButton(
                        preset.label,
                        isActive,
                        () =>
                          setSelectedStyle((current) =>
                            current === preset.id ? null : preset.id,
                          ),
                        isLoading,
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-7">
              <p className="text-sm font-medium text-neutral-200">
                {t("form.paletteLabel")}
              </p>

              <p className="mt-2 text-xs leading-6 text-neutral-400">
                {canShowGradientOption
                  ? t("form.paletteHelpGradientAvailable")
                  : t("form.paletteHelpGradientLocked")}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {visibleColorOptions.map((color) => (
                  <div key={color.id}>
                    {renderPillButton(
                      color.label,
                      selectedColors.includes(color.id),
                      () => toggleColor(color.id),
                      isLoading,
                    )}
                  </div>
                ))}
              </div>

              {selectedColorLabels.length > 0 ? (
                <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-neutral-300">
                  <span className="font-medium text-white">
                    {t("form.selectedColors")}
                  </span>{" "}
                  {selectedColorLabels.join(", ")}
                </div>
              ) : null}
            </div>

            {creationType === "wall" ? (
              <>
                <div className="mt-7">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.sizeLabel")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {wallSizeOptions.map((size) => (
                      <div key={size.id}>
                        {renderCardButton(
                          size.label,
                          selectedWallSize === size.id,
                          () => setSelectedWallSize(size.id),
                          isLoading,
                          <Ruler className="h-4 w-4" />,
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.optionsLabel")}
                  </p>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setWithFrame((prev) => !prev)}
                    className={[
                      "mt-4 flex w-full items-start gap-3 rounded-[1.35rem] border px-4 py-4 text-left transition duration-300 disabled:cursor-not-allowed disabled:opacity-60",
                      withFrame
                        ? "border-[#d9b08c] bg-[#d9b08c]/14 text-white shadow-[0_0_0_1px_rgba(217,176,140,0.22)]"
                        : "border-white/10 bg-white/[0.05] text-neutral-300 hover:border-white/20 hover:bg-white/[0.09] hover:text-white",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition duration-300",
                        withFrame
                          ? "border-[#e3bf9d] bg-[#e3bf9d] text-black"
                          : "border-white/20 bg-transparent text-transparent",
                      ].join(" ")}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>

                    <span className="flex-1">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <Sparkles className="h-4 w-4 text-[#e3bf9d]" />
                        {t("form.withFrame")}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-neutral-400">
                        {t("form.withFrameDescription")}
                      </span>
                    </span>
                  </button>
                </div>

                {withFrame ? (
                  <>
                    <div className="mt-7">
                      <p className="text-sm font-medium text-neutral-200">
                        {t("form.frameColor")}
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {frameColors.map((color) => (
                          <div key={color.id}>
                            {renderCardButton(
                              color.label,
                              frameColor === color.id,
                              () => setFrameColor(color.id),
                              isLoading,
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-7">
                      <p className="text-sm font-medium text-neutral-200">
                        {t("form.frameMaterial")}
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {frameMaterials.map((material) => (
                          <div key={material.id}>
                            {renderCardButton(
                              material.label,
                              frameMaterial === material.id,
                              () => setFrameMaterial(material.id),
                              isLoading,
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
              </>
            ) : null}

            {creationType === "object" ? (
              <>
                <div className="mt-7">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.objectSizeLabel")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {objectSizeOptions.map((size) => (
                      <div key={size.id}>
                        {renderCardButton(
                          size.label,
                          selectedObjectSize === size.id,
                          () => setSelectedObjectSize(size.id),
                          isLoading,
                          <Ruler className="h-4 w-4" />,
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.objectUsageLabel")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {objectUsages.map((usage) => (
                      <div key={usage.id}>
                        {renderCardButton(
                          usage.label,
                          selectedObjectUsage === usage.id,
                          () => setSelectedObjectUsage(usage.id),
                          isLoading,
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.objectFinishLabel")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {objectFinishes.map((finish) => (
                      <div key={finish.id}>
                        {renderCardButton(
                          finish.label,
                          selectedObjectFinish === finish.id,
                          () => setSelectedObjectFinish(finish.id),
                          isLoading,
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {creationType === "light" ? (
              <>
                <div className="mt-7">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.lightTypeLabel")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {lightTypes.map((lightType) => (
                      <div key={lightType.id}>
                        {renderCardButton(
                          lightType.label,
                          selectedLightType === lightType.id,
                          () => setSelectedLightType(lightType.id),
                          isLoading,
                          <Lamp className="h-4 w-4" />,
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.lightTemperatureLabel")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {lightTemperatures.map((temp) => (
                      <div key={temp.id}>
                        {renderCardButton(
                          temp.label,
                          selectedLightTemperature === temp.id,
                          () => setSelectedLightTemperature(temp.id),
                          isLoading,
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.lightIntensityLabel")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {lightIntensities.map((intensity) => (
                      <div key={intensity.id}>
                        {renderCardButton(
                          intensity.label,
                          selectedLightIntensity === intensity.id,
                          () => setSelectedLightIntensity(intensity.id),
                          isLoading,
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            <div className="mt-7">
              <label
                htmlFor="ai-prompt"
                className="text-sm font-medium text-neutral-200"
              >
                {t("form.label")}
              </label>

              <textarea
                id="ai-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t("form.placeholder")}
                disabled={isLoading}
                className="mt-4 min-h-[170px] w-full resize-y rounded-[1.5rem] border border-white/10 bg-black/20 px-5 py-4 text-sm leading-7 text-white outline-none transition duration-300 placeholder:text-neutral-500 focus:border-[#caa27c] focus:bg-black/25 focus:ring-2 focus:ring-[#caa27c]/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            {fullPrompt ? (
              <div className="mt-6 rounded-[1.5rem] border border-[#d9b08c]/18 bg-gradient-to-br from-[#d9b08c]/10 to-transparent p-4 md:p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#e3bf9d]">
                  {t("promptEnrichedTitle")}
                </p>
                <p className="mt-3 text-sm leading-8 text-neutral-200">
                  {fullPrompt}
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="mt-6 flex items-start gap-3 rounded-[1.25rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition duration-300 hover:scale-[1.015] hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("buttons.generating")}
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    {t("buttons.generate")}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCcw className="h-4 w-4" />
                {t("buttons.reset")}
              </button>
            </div>
          </div>
        </div>

        <div ref={resultRef} className="flex flex-col">
          <div className="relative flex min-h-[640px] flex-1 items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:min-h-[760px] md:p-6 xl:min-h-[860px] xl:p-7">
            {!generatedImage && !isLoading ? (
              <div className="mx-auto max-w-md text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                  <Sparkles className="h-7 w-7 text-[#e3bf9d]" />
                </div>

                <h2 className="mt-6 text-2xl font-semibold text-white">
                  {t("result.emptyTitle")}
                </h2>

                <p className="mt-4 text-sm leading-7 text-neutral-400">
                  {t("result.emptyDescription")}
                </p>
              </div>
            ) : null}

            {isLoading ? (
              <>
                <div className="flex h-full w-full items-center justify-center">
                  <div
                    className={`w-full max-w-[760px] ${previewAspectClass} rounded-[1.75rem] bg-white/10`}
                  />
                </div>

                <div
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-md"
                  aria-live="assertive"
                  aria-busy="true"
                >
                  <div className="mx-auto flex max-w-md flex-col items-center px-6 text-center">
                    <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#d9b08c]/25 bg-[#d9b08c]/10">
                      <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full border border-[#d9b08c]/20" />
                      <Loader2 className="relative z-10 h-9 w-9 animate-spin text-[#e3bf9d]" />
                    </div>

                    <h3 className="text-xl font-semibold text-white">
                      {t("loading.title")}
                    </h3>

                    <p className="mt-3 max-w-sm text-sm leading-7 text-neutral-300">
                      {t("loading.description")}
                    </p>

                    <div className="mt-5 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.22em] text-neutral-300">
                      {t("loading.notice")}
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {generatedImage ? (
              <div className="flex h-full w-full items-center justify-center">
                <div className="relative flex w-full max-w-[780px] items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111214] p-3 md:p-4 xl:p-5">
                  <Image
                    src={generatedImage}
                    alt={t("result.imageAlt")}
                    width={1024}
                    height={1024}
                    sizes="(max-width: 1280px) 100vw, 50vw"
                    className="h-auto max-h-[760px] w-auto max-w-full object-contain"
                    priority
                  />
                </div>
              </div>
            ) : null}
          </div>

          {generatedImage ? (
            <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/20 p-4 md:p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">
                {t("result.generatedTitle")}
              </p>
              <p className="mt-3 text-sm leading-8 text-neutral-200">
                {lastPrompt}
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || !lastPrompt}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCcw className="h-4 w-4" />
              {t("buttons.regenerate")}
            </button>

            <button
              type="button"
              onClick={handleOrderClick}
              disabled={!generatedImage || isLoading}
              className={[
                "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition duration-300",
                generatedImage && !isLoading
                  ? "bg-[#d9b08c] text-black hover:scale-[1.015] hover:bg-[#e5c4a6]"
                  : "cursor-not-allowed bg-neutral-700 text-neutral-400",
              ].join(" ")}
            >
              {t("buttons.order")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-sm leading-7 text-neutral-300">
              {t("footer.line1")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}