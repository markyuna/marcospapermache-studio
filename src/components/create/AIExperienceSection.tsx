"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Loader2,
  RefreshCcw,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";

type GenerateImageResponse = {
  image?: string;
  error?: string;
};

export default function AIExperienceSection() {
  const t = useTranslations("AIExperience");
  const router = useRouter();

  const stylePresets = [
    {
      id: "organic",
      label: t("styles.organic.label"),
      prompt: t("styles.organic.prompt"),
    },
    {
      id: "minimal",
      label: t("styles.minimal.label"),
      prompt: t("styles.minimal.prompt"),
    },
    {
      id: "oceanic",
      label: t("styles.oceanic.label"),
      prompt: t("styles.oceanic.prompt"),
    },
    {
      id: "luminous",
      label: t("styles.luminous.label"),
      prompt: t("styles.luminous.prompt"),
    },
  ] as const;

  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const resultRef = useRef<HTMLDivElement | null>(null);

  const fullPrompt = useMemo(() => {
    const preset = stylePresets.find((item) => item.id === selectedStyle);

    if (!prompt.trim() && preset) return preset.prompt;
    if (prompt.trim() && preset) {
      return `${prompt.trim()}. ${t("promptEnrichedSuffix")} ${preset.prompt}`;
    }

    return prompt.trim();
  }, [prompt, selectedStyle, t, stylePresets]);

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
    setGeneratedImage(null);
    setLastPrompt("");
    setError("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("generatedImage");
    }
  }

  function handleOrderClick() {
    if (!generatedImage) return;

    if (typeof window !== "undefined") {
      sessionStorage.setItem("generatedImage", generatedImage);
    }

    router.push({
      pathname: "/commande",
      query: {
        prompt: lastPrompt,
      },
    });
  }

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0b0b0d] p-6 text-white shadow-[0_30px_120px_rgba(0,0,0,0.38)] md:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(205,164,124,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_24%)]" />

      <div className="relative grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:gap-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.28em] text-neutral-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <Sparkles className="h-4 w-4" />
            {t("badge")}
          </p>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
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
              className="mt-4 min-h-[170px] w-full resize-y rounded-[1.5rem] border border-white/10 bg-black/20 px-5 py-4 text-sm leading-7 text-white outline-none transition duration-300 placeholder:text-neutral-500 focus:border-[#caa27c] focus:bg-black/25 focus:ring-2 focus:ring-[#caa27c]/20"
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
                      onClick={() =>
                        setSelectedStyle((current) =>
                          current === preset.id ? null : preset.id,
                        )
                      }
                      className={[
                        "rounded-full border px-4 py-2 text-sm transition duration-300",
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
              <div className="mt-6 rounded-[1.25rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
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
          <div className="relative flex min-h-[520px] flex-1 items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
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
              <div className="w-full animate-pulse">
                <div className="aspect-[4/5] w-full rounded-[1.5rem] bg-white/10" />
                <div className="mt-4 h-4 w-2/3 rounded bg-white/10" />
                <div className="mt-2 h-4 w-1/2 rounded bg-white/10" />
              </div>
            ) : null}

            {generatedImage ? (
              <div className="w-full">
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
                  <Image
                    src={generatedImage}
                    alt={t("result.imageAlt")}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-all duration-700 ease-out animate-[fadeIn_0.7s_ease-out]"
                    unoptimized
                  />
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/20 p-4 md:p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">
                    {t("result.generatedTitle")}
                  </p>
                  <p className="mt-3 text-sm leading-8 text-neutral-200">
                    {lastPrompt}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

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
              disabled={!generatedImage}
              className={[
                "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition duration-300",
                generatedImage
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

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(1.03);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}