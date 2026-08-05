// src/components/home/hero-section.tsx

"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, MoveHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { GradientTitle } from "@/components/ui/GradientTitle";
import { Link } from "@/i18n/navigation";

// Left side of the reveal = AI concept, right side = the real sculpture.
// Crisp full-bleed 1200x1200 squares. The AI render was reframed
// (scripts/reframe-ai-image.mjs) to match the real photo's composition — the
// sculpture sits in the same spot/scale in both — so the reveal lines up as the
// divider moves. Same 1:1 ratio as the container, so object-cover crops nothing.
const AI_IMAGE = "/images/Élégance moderne et sculptures lumineuses.png";
const REAL_IMAGE = "/images/wine-holder-real.webp";

export function HeroSection() {
  const t = useTranslations("Hero");

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Divider position as a percentage (0 = full real, 100 = full AI).
  const position = useMotionValue(50);
  const smoothPosition = useSpring(position, {
    stiffness: 260,
    damping: 32,
    mass: 0.5,
  });

  // AI image sits on top and is clipped to only reveal its left portion.
  const revealFromRight = useTransform(smoothPosition, (p) => `${100 - p}%`);
  const clipPath = useMotionTemplate`inset(0 ${revealFromRight} 0 0)`;
  const handleLeft = useMotionTemplate`${smoothPosition}%`;

  const setFromClientX = (clientX: number) => {
    const element = sliderRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    position.set(Math.max(0, Math.min(100, percent)));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    // Desktop: track the cursor freely. Touch: only while dragging.
    if (event.pointerType === "mouse" || isDragging) {
      setFromClientX(event.clientX);
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setFromClientX(event.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    // On desktop the line drifts back to the centre once the cursor leaves.
    if (event.pointerType === "mouse") {
      position.set(50);
    }
  };

  return (
    <section className="relative overflow-hidden pb-16 pt-8 md:pb-20 md:pt-10 xl:pb-24 xl:pt-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_25%,var(--paper-glow)_0%,var(--paper-surface)_70%,var(--paper-warm)_100%)]" />

      <Container className="relative z-10">
        <div className="grid items-stretch gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column — tagline, description, CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center max-w-2xl h-full"
          >
            <div className="inline-flex items-center rounded-full border border-[#e7dac9] bg-white/60 px-4 py-2 backdrop-blur-sm">
              <span className="text-[10px] uppercase tracking-[0.34em] text-[#9d7b5e] md:text-[11px]">
                {t("badge")}
              </span>
            </div>

            <h1 className="mt-7 text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.06em] text-[#1c1c1a] sm:text-5xl lg:text-[52px]">
              <span className="block">{t("title.line1")}</span>
              <span className="block">
                <GradientTitle text={t("title.line2")} />
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#5f5348]">
              {t("compareDescription")}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/create"
                className="btn-gold-shimmer inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium no-underline transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>{t("ctaPrimary")}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>

              <Link
                href="/sculptures"
                className="group inline-flex items-center justify-center gap-2 rounded-[24px] border border-[#D4AF37] px-7 py-3 text-sm font-medium text-[#D4AF37] no-underline transition-all duration-300 hover:border-[#e8c860] hover:bg-[#D4AF37]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/40 focus-visible:ring-offset-2"
              >
                <span>{t("ctaExplore")}</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <p className="mt-5 text-sm text-[#4a3f38]">{t("trustLine")}</p>
          </motion.div>

          {/* Right column — interactive AI / real comparison slider */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            className="relative"
          >
            <div className="pointer-events-none absolute -left-8 top-10 hidden h-40 w-40 rounded-full bg-[#d8c4aa]/25 blur-3xl lg:block" />
            <div className="pointer-events-none absolute -bottom-10 right-0 hidden h-52 w-52 rounded-full bg-[#ece1d3]/60 blur-3xl lg:block" />

            {/* Animated gold gradient border wraps the slider; the inner card
                keeps overflow-hidden so the image stays clipped and to-the-edge */}
            <div className="gold-border-anim relative mx-auto w-full max-w-[520px] h-full rounded-[1.8rem] p-[2px] shadow-[0_24px_70px_rgba(70,48,24,0.10)]">
            <div
              ref={sliderRef}
              onPointerMove={handlePointerMove}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              role="slider"
              aria-label={t("compareHintMobile")}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={50}
              tabIndex={0}
              style={{ touchAction: "pan-y" }}
              className="relative aspect-square w-full cursor-ew-resize select-none overflow-hidden rounded-[1.65rem]"
            >
              {/* Real sculpture — bottom layer, shown on the right side */}
              <Image
                src={REAL_IMAGE}
                alt={t("realLabel")}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 520px"
                className="pointer-events-none object-cover object-center"
              />

              {/* AI generated — top layer, clipped to reveal the left side */}
              <motion.div
                style={{ clipPath }}
                className="pointer-events-none absolute inset-0"
              >
                <Image
                  src={AI_IMAGE}
                  alt={t("aiLabel")}
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 520px"
                  className="object-cover"
                />
              </motion.div>

              {/* Corner labels — anchored to opposite corners so they never
                  meet in the middle; shortened + smaller below the sm breakpoint */}
              <div className="pointer-events-none absolute left-3 top-3 max-w-[45%] rounded-full bg-black/45 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.1em] text-white/90 backdrop-blur-sm sm:left-4 sm:top-4 sm:px-3 sm:text-[10px] sm:tracking-[0.18em]">
                <span className="sm:hidden">{t("aiLabelShort")}</span>
                <span className="hidden sm:inline">{t("aiLabel")}</span>
              </div>
              <div className="pointer-events-none absolute right-3 top-3 max-w-[45%] rounded-full bg-black/45 px-2.5 py-1 text-right text-[9px] font-medium uppercase tracking-[0.1em] text-white/90 backdrop-blur-sm sm:right-4 sm:top-4 sm:px-3 sm:text-[10px] sm:tracking-[0.18em]">
                <span className="sm:hidden">{t("realLabelShort")}</span>
                <span className="hidden sm:inline">{t("realLabel")}</span>
              </div>

              {/* Divider line + handle */}
              <motion.div
                style={{ left: handleLeft }}
                className="pointer-events-none absolute inset-y-0 z-10 w-px -translate-x-1/2 bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.6)]"
              >
                <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#D4AF37] bg-black/35 text-[#D4AF37] backdrop-blur-sm">
                  <MoveHorizontal className="h-5 w-5" />
                </div>
              </motion.div>

              {/* Hint text */}
              <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center md:bottom-4">
                <span className="rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium tracking-[0.04em] text-white/90 backdrop-blur-sm">
                  <span className="hidden md:inline">
                    {t("compareHintDesktop")}
                  </span>
                  <span className="md:hidden">{t("compareHintMobile")}</span>
                </span>
              </div>
            </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
