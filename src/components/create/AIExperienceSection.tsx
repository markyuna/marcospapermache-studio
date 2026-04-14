"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Loader2,
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

type SizeOption = {
  id: "30x40" | "50x70" | "70x100";
  label: string;
  prompt: string;
};

type FrameColor = "black" | "white" | "gold";
type FrameMaterial = "metal" | "wood";
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
  framedPrompt: string;
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
    },
    {
      id: "minimal",
      label: t("styles.minimal.label"),
      prompt: t("styles.minimal.prompt"),
      framedPrompt:
        "minimal sculptural composition adapted to framed wall art, restrained relief, refined clean volumes, disciplined composition that fully respects the frame and preserves the frame as a visible design element",
    },
    {
      id: "oceanic",
      label: t("styles.oceanic.label"),
      prompt: t("styles.oceanic.prompt"),
      framedPrompt:
        "ocean-inspired sculptural composition adapted to framed wall art, fluid layered relief, elegant wave-like movement with controlled depth, composition arranged to keep the frame fully visible",
    },
    {
      id: "luminous",
      label: t("styles.luminous.label"),
      prompt: t("styles.luminous.prompt"),
      framedPrompt:
        "luminous sculptural composition adapted to framed wall art, refined light-inspired relief, subtle radiant accents, composition built to preserve full frame visibility on all sides",
    },
    {
      id: "origami",
      label: t("styles.origami.label"),
      prompt: t("styles.origami.prompt"),
      framedPrompt:
        "origami-inspired sculptural composition adapted to framed wall art, folded geometric planes, crisp faceted relief, elegant angular paper-like construction, structured composition designed to remain centered and fully contained inside a clearly visible open frame",
    },
  ] as const;

  const sizeOptions: SizeOption[] = [
    {
      id: "30x40",
      label: t("sizes.small"),
      prompt:
        "vertical format artwork, portrait orientation, aspect ratio 3:4, proportions of a 30 x 40 cm wall piece, realistic scale as a small wall artwork",
    },
    {
      id: "50x70",
      label: t("sizes.medium"),
      prompt:
        "vertical format artwork, portrait orientation, aspect ratio 5:7, proportions of a 50 x 70 cm wall piece, realistic scale as a medium-sized wall artwork",
    },
    {
      id: "70x100",
      label: t("sizes.large"),
      prompt:
        "vertical format artwork, portrait orientation, aspect ratio 7:10, proportions of a 70 x 100 cm wall piece, realistic scale as a large wall artwork",
    },
  ];

  const frameColors: { id: FrameColor; label: string; prompt: string }[] = [
    { id: "black", label: t("frameColors.black"), prompt: "black" },
    { id: "white", label: t("frameColors.white"), prompt: "white" },
    { id: "gold", label: t("frameColors.gold"), prompt: "gold" },
  ];

  const frameMaterials: {
    id: FrameMaterial;
    label: string;
    prompt: string;
  }[] = [
    { id: "metal", label: t("frameMaterials.metal"), prompt: "metal" },
    { id: "wood", label: t("frameMaterials.wood"), prompt: "wood" },
  ];

  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StylePresetId | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption["id"]>("50x70");
  const [withFrame, setWithFrame] = useState(false);
  const [frameColor, setFrameColor] = useState<FrameColor>("black");
  const [frameMaterial, setFrameMaterial] = useState<FrameMaterial>("metal");
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
    switch (selectedSize) {
      case "30x40":
        return "aspect-[3/4]";
      case "50x70":
        return "aspect-[5/7]";
      case "70x100":
        return "aspect-[7/10]";
      default:
        return "aspect-[5/7]";
    }
  }, [selectedSize]);

  const fullPrompt = useMemo(() => {
    const preset = stylePresets.find((item) => item.id === selectedStyle);
    const sizePreset = sizeOptions.find((item) => item.id === selectedSize);
    const colorPreset = frameColors.find((item) => item.id === frameColor);
    const materialPreset = frameMaterials.find(
      (item) => item.id === frameMaterial,
    );

    let basePrompt = "";

    if (!prompt.trim() && preset) {
      basePrompt = preset.prompt;
    } else if (prompt.trim() && preset) {
      basePrompt = `${prompt.trim()}. ${t("promptEnrichedSuffix")} ${preset.prompt}`;
    } else {
      basePrompt = prompt.trim();
    }

    if (!basePrompt) return "";

    if (sizePreset) {
      basePrompt += `, ${sizePreset.prompt}`;
    }

    if (withFrame) {
      const frameDescription = `clearly visible thin flat open ${colorPreset?.prompt ?? "black"} ${materialPreset?.prompt ?? "metal"} frame`;

      basePrompt +=
        `, contemporary papier-mâché wall sculpture designed as framed wall art, ` +
        `${frameDescription}, ` +
        `front-facing centered composition, ` +
        `the entire outer frame must be fully visible on all four sides, ` +
        `comfortable and even margin around the full frame, ` +
        `no cropped frame, no cut frame, no partial frame, no cut-off corners, ` +
        `the frame is an essential and visible part of the artwork, ` +
        `the sculpture is physically attached to and integrated into the frame, ` +
        `the sculpture may interact with the inner edges of the frame, ` +
        `but the outer perimeter of the frame must remain entirely visible and readable, ` +
        `zoomed out slightly so the whole frame fits naturally inside the image, ` +
        `neutral studio-style presentation, no room staging, no furniture, no large decorative background, ` +
        `premium contemporary art photography, realistic handmade texture, subtle natural shadows, open frame only, flat frame only, visible frame structure, no invisible frame, no box frame, no shadow box, no display case, no glass enclosure`;

      if (preset?.framedPrompt) {
        basePrompt += `, ${preset.framedPrompt}`;
      }
    }

    return basePrompt;
  }, [
    prompt,
    selectedStyle,
    selectedSize,
    withFrame,
    frameColor,
    frameMaterial,
    t,
    stylePresets,
  ]);

  async function handleGenerate() {
    if (!fullPrompt) {
      setError(t("errors.emptyPrompt"));
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setGeneratedImage(null);

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          size: selectedSize,
          withFrame,
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
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("errors.unknown");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setPrompt("");
    setSelectedStyle(null);
    setSelectedSize("50x70");
    setWithFrame(false);
    setFrameColor("black");
    setFrameMaterial("metal");
    setGeneratedImage(null);
    setLastPrompt("");
    setError("");

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("generatedImage");
      sessionStorage.removeItem("generatedImageSize");
      sessionStorage.removeItem("generatedFrameColor");
      sessionStorage.removeItem("generatedFrameMaterial");
      sessionStorage.removeItem("generatedWithFrame");
    }
  }

  function handleOrderClick() {
    if (!generatedImage) return;

    if (typeof window !== "undefined") {
      sessionStorage.setItem("generatedImage", generatedImage);
      sessionStorage.setItem("generatedImageSize", selectedSize);
      sessionStorage.setItem("generatedFrameColor", frameColor);
      sessionStorage.setItem("generatedFrameMaterial", frameMaterial);
      sessionStorage.setItem("generatedWithFrame", String(withFrame));
    }

    router.push({
      pathname: "/commande",
      query: {
        prompt: lastPrompt,
        size: selectedSize,
        frame: withFrame ? "open" : "none",
        frameColor: withFrame ? frameColor : "none",
        frameMaterial: withFrame ? frameMaterial : "none",
      },
    });
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

            <div className="mt-7">
              <p className="text-sm font-medium text-neutral-200">
                {t("form.styleLabel")}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {stylePresets.map((preset) => {
                  const isActive = selectedStyle === preset.id;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      disabled={isLoading}
                      onClick={() =>
                        setSelectedStyle((current) =>
                          current === preset.id ? null : preset.id,
                        )
                      }
                      className={[
                        "rounded-full border px-4 py-2 text-sm transition duration-300 disabled:cursor-not-allowed disabled:opacity-60",
                        isActive
                          ? "border-[#d9b08c] bg-[#d9b08c]/14 text-white shadow-[0_0_0_1px_rgba(217,176,140,0.22)]"
                          : "border-white/10 bg-white/[0.05] text-neutral-300 hover:border-white/20 hover:bg-white/[0.09] hover:text-white",
                      ].join(" ")}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7">
              <p className="text-sm font-medium text-neutral-200">
                {t("form.sizeLabel")}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {sizeOptions.map((size) => {
                  const isActive = selectedSize === size.id;

                  return (
                    <button
                      key={size.id}
                      type="button"
                      disabled={isLoading}
                      onClick={() => setSelectedSize(size.id)}
                      className={[
                        "flex items-center justify-center gap-2 rounded-[1.2rem] border px-4 py-3 text-sm transition duration-300 disabled:cursor-not-allowed disabled:opacity-60",
                        isActive
                          ? "border-[#d9b08c] bg-[#d9b08c]/14 text-white shadow-[0_0_0_1px_rgba(217,176,140,0.22)]"
                          : "border-white/10 bg-white/[0.05] text-neutral-300 hover:border-white/20 hover:bg-white/[0.09] hover:text-white",
                      ].join(" ")}
                    >
                      <Ruler className="h-4 w-4" />
                      {size.label}
                    </button>
                  );
                })}
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
                    {frameColors.map((color) => {
                      const isActive = frameColor === color.id;

                      return (
                        <button
                          key={color.id}
                          type="button"
                          disabled={isLoading}
                          onClick={() => setFrameColor(color.id)}
                          className={[
                            "rounded-[1.2rem] border px-4 py-3 text-sm transition duration-300 disabled:cursor-not-allowed disabled:opacity-60",
                            isActive
                              ? "border-[#d9b08c] bg-[#d9b08c]/14 text-white shadow-[0_0_0_1px_rgba(217,176,140,0.22)]"
                              : "border-white/10 bg-white/[0.05] text-neutral-300 hover:border-white/20 hover:bg-white/[0.09] hover:text-white",
                          ].join(" ")}
                        >
                          {color.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.frameMaterial")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {frameMaterials.map((material) => {
                      const isActive = frameMaterial === material.id;

                      return (
                        <button
                          key={material.id}
                          type="button"
                          disabled={isLoading}
                          onClick={() => setFrameMaterial(material.id)}
                          className={[
                            "rounded-[1.2rem] border px-4 py-3 text-sm transition duration-300 disabled:cursor-not-allowed disabled:opacity-60",
                            isActive
                              ? "border-[#d9b08c] bg-[#d9b08c]/14 text-white shadow-[0_0_0_1px_rgba(217,176,140,0.22)]"
                              : "border-white/10 bg-white/[0.05] text-neutral-300 hover:border-white/20 hover:bg-white/[0.09] hover:text-white",
                          ].join(" ")}
                        >
                          {material.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : null}

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

            <p className="text-sm leading-7 text-neutral-500">
              {t("footer.line2")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}