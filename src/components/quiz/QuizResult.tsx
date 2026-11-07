// src/components/quiz/QuizResult.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy, RotateCcw, Share2, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import QuizSavePanel from "@/components/quiz/QuizSavePanel";
import { PROFILE_GRADIENTS } from "@/components/quiz/profile-gradients";
import { GradientTitle } from "@/components/ui/GradientTitle";
import type { GeneratorConfig } from "@/data/quiz/generator";
import {
  buildGeneratorQuery,
  PANEL_COLOR,
  PANEL_DIRECTION,
  PANEL_FRAME_COLOR,
  PANEL_FRAME_MATERIAL,
  PANEL_OBJECT_SIZE,
  PANEL_TYPE,
} from "@/data/quiz/generator-params";
import { PROFILES, type ProfileId } from "@/data/quiz/profiles";
import { pickPromptKeys, seedFromCode } from "@/data/quiz/share";
import { Link } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase/client";

export type QuizArtwork = {
  slug: string;
  title: string;
  imageUrl: string;
};

type QuizResultProps = {
  profileId: ProfileId;
  // null for legacy ?p= links, which carry no generator configuration.
  config: GeneratorConfig | null;
  // Answers code (also the prompt-pick seed); null for legacy ?p= links.
  code: string | null;
  artworks: QuizArtwork[];
  onRetake: () => void;
};

const COPIED_RESET_MS = 2000;

// Clipboard API needs a secure context and a user gesture; fall back to the
// legacy selection-based copy before giving up.
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}

function isRealSlug(slug: string) {
  return !slug.startsWith("REEMPLAZAR-");
}

export default function QuizResult({
  profileId,
  config,
  code,
  artworks,
  onRetake,
}: QuizResultProps) {
  const t = useTranslations("quiz");
  const tPanel = useTranslations("AIExperience");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();

  // null until the browser session is known, so signed-in visitors never see
  // the sign-up wording flash before it is replaced.
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [shared, setShared] = useState(false);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  // Only a hint for the wording: the server still decides who may generate.
  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) setHasSession(Boolean(data.session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(Boolean(session));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const profile = PROFILES.find((p) => p.id === profileId);
  if (!profile) return null;

  const promptKeys = pickPromptKeys(
    profile.promptKeys,
    code ? seedFromCode(code) : 0
  );

  // Chips reuse the generator panel's own labels, so both screens say the same.
  const configChips: string[] = [];
  if (config) {
    configChips.push(tPanel(`creationTypes.${PANEL_TYPE[config.type]}`));
    configChips.push(tPanel(`styles.${PANEL_DIRECTION[config.direction]}.label`));
    config.colors.forEach((color) =>
      configChips.push(tPanel(`colors.${PANEL_COLOR[color]}`))
    );
    // The panel labels wall sizes small/medium/large (30x40 … 70x100) and
    // object sizes the same three buckets; light sculptures have no size.
    if (config.type !== "luminosa") {
      const sizeGroup = config.type === "mural" ? "wall" : "object";
      configChips.push(tPanel(`sizes.${sizeGroup}.${PANEL_OBJECT_SIZE[config.size]}`));
    }
    if (config.frame && config.frameColor && config.frameMaterial) {
      configChips.push(
        `${tPanel("form.withFrame")} · ${tPanel(`frameColors.${PANEL_FRAME_COLOR[config.frameColor]}`)} · ${tPanel(`frameMaterials.${PANEL_FRAME_MATERIAL[config.frameMaterial]}`)}`
      );
    }
  }

  const recommended = profile.sculptureSlugs
    .filter(isRealSlug)
    .flatMap((slug) => artworks.filter((artwork) => artwork.slug === slug));

  function flash(setter: (value: boolean) => void) {
    setter(true);
    timersRef.current.push(setTimeout(() => setter(false), COPIED_RESET_MS));
  }

  async function handleCopy(key: string, text: string) {
    if (!(await copyText(text))) return;

    setCopiedKey(key);
    timersRef.current.push(
      setTimeout(
        () => setCopiedKey((current) => (current === key ? null : current)),
        COPIED_RESET_MS
      )
    );
  }

  async function handleShare() {
    const query = code ? `r=${code}` : `p=${profileId}`;
    const url = `${window.location.origin}/${locale}/quiz?${query}`;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: t("title"),
          text: t(`profiles.${profileId}.name`),
          url,
        });
        return;
      } catch (error) {
        // The user dismissing the share sheet is not a failure.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    if (await copyText(url)) flash(setShared);
  }

  const fadeUp = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <motion.div {...fadeUp} className="space-y-16 md:space-y-20">
      {/* Profile */}
      <section className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div
          aria-hidden="true"
          className={`aspect-[4/3] w-full rounded-[2rem] bg-gradient-to-br shadow-[0_30px_80px_rgba(35,25,15,0.14)] md:aspect-square ${PROFILE_GRADIENTS[profileId]}`}
        />

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b07a52]">
            {t("result.yourProfile")}
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#1c1c1a] md:text-5xl">
            <GradientTitle text={t(`profiles.${profileId}.name`)} />
          </h1>

          <p className="mt-5 text-base leading-8 text-[#6c5d50] md:text-lg">
            {t(`profiles.${profileId}.tagline`)}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full bg-[#171311] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c65400]/50 focus-visible:ring-offset-2"
            >
              {shared ? (
                <Check className="h-4 w-4" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {shared ? t("result.copied") : t("result.share")}
            </button>

            <button
              type="button"
              onClick={onRetake}
              className="inline-flex items-center gap-2 rounded-full border border-[#e7d5c5] bg-white/80 px-5 py-3 text-sm font-medium text-[#4f4338] transition duration-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c65400]/50 focus-visible:ring-offset-2"
            >
              <RotateCcw className="h-4 w-4" />
              {t("result.retake")}
            </button>
          </div>
        </div>
      </section>

      {/* Recommended sculptures — hidden until the profile has real catalog slugs */}
      {recommended.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#1c1c1a] md:text-3xl">
            {t("result.recommended")}
          </h2>

          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {recommended.map((artwork) => (
              <li key={artwork.slug}>
                <Link
                  href={`/sculptures/${artwork.slug}`}
                  className="group block overflow-hidden rounded-[1.75rem] border border-[#e7d5c5] bg-white/80 shadow-[0_14px_40px_rgba(65,38,14,0.06)] transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c65400]/50 focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="flex items-center justify-between gap-3 px-5 py-4 text-base font-medium text-[#1c1c1a]">
                    {artwork.title}
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[#c65400]" />
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Suggested generator setup */}
      {config && (
        <section className="rounded-[2rem] border border-[#e7d5c5] bg-white/70 p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#1c1c1a] md:text-3xl">
            {t("result.configTitle")}
          </h2>
          <p className="mt-3 text-base leading-7 text-[#6c5d50]">
            {t("result.configHint")}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {configChips.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-[#ead9cb] bg-white px-3.5 py-1.5 text-sm text-[#4f4338]"
              >
                {chip}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Save to the account / generate the image (needs the answers code) */}
      {config && code && <QuizSavePanel code={code} hasSession={hasSession} />}

      {/* Prompts */}
      <section>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#c8873f]" />
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#1c1c1a] md:text-3xl">
            {t("result.promptsTitle")}
          </h2>
        </div>
        <p className="mt-3 text-base leading-7 text-[#6c5d50]">
          {t("result.promptsHint")}
        </p>

        {hasSession === false && (
          <p
            role="note"
            className="mt-4 rounded-[1.25rem] border border-[#ead9cb] bg-white/70 px-4 py-3 text-sm leading-6 text-[#4f4338]"
          >
            {t("result.signupNotice")}
          </p>
        )}

        <ul className="mt-6 space-y-4">
          {promptKeys.map((key) => {
            const prompt = t(`profiles.${profileId}.prompts.${key}`);
            const isCopied = copiedKey === key;

            return (
              <li
                key={key}
                className="rounded-[1.5rem] border border-[#e7d5c5] bg-white/80 p-5 shadow-[0_10px_30px_rgba(70,48,24,0.05)] md:p-6"
              >
                <p className="text-sm leading-7 text-[#2c241e] md:text-[15px] md:leading-8">
                  {prompt}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleCopy(key, prompt)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#171311] px-4 py-2.5 text-sm font-medium text-white transition duration-300 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c65400]/50 focus-visible:ring-offset-2"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span aria-live="polite">
                      {isCopied ? t("result.copied") : t("result.copy")}
                    </span>
                  </button>

                  {/* The generator reads these params and preselects its panel;
                      it never starts a generation on its own. */}
                  <Link
                    href={`/create?${buildGeneratorQuery(prompt, config)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#ff6a00] px-4 py-2.5 text-sm font-medium text-white shadow-[0_14px_34px_rgba(255,106,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#eb6100] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c65400]/50 focus-visible:ring-offset-2"
                  >
                    {hasSession === false
                      ? t("result.tryNowSignup")
                      : t("result.tryNow")}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Custom commission */}
      <div className="text-center">
        <Link
          href="/creations-sur-mesure"
          className="btn-gold-shimmer inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c65400]/50 focus-visible:ring-offset-2"
        >
          {t("result.custom")}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
