// src/components/home/hero-section.tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";
import { sculptures } from "@/data/sculptures";

export function HeroSection() {
  const t = useTranslations("Hero");

  const signaturePiece =
    sculptures.find((item) => item.slug === "support-a-vin") ?? null;

  const signatureImage = signaturePiece?.images?.[0] ?? "/support-a-vins.jpg";

  const cardRef = useRef<HTMLDivElement | null>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const imageScale = useMotionValue(1);

  const smoothRotateX = useSpring(rotateX, {
    stiffness: 140,
    damping: 18,
    mass: 0.6,
  });

  const smoothRotateY = useSpring(rotateY, {
    stiffness: 140,
    damping: 18,
    mass: 0.6,
  });

  const smoothScale = useSpring(imageScale, {
    stiffness: 180,
    damping: 20,
    mass: 0.7,
  });

  const overlayY = useTransform(smoothRotateX, [-8, 8], [10, -10]);
  const overlayX = useTransform(smoothRotateY, [-8, 8], [-10, 10]);

  const floatingCardX = useTransform(smoothRotateY, [-8, 8], [-8, 8]);
  const floatingCardY = useTransform(smoothRotateX, [-8, 8], [8, -8]);

  const highlights = [
    t("highlights.unique"),
    t("highlights.custom"),
    t("highlights.artistic"),
  ];

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = cardRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const percentX = (x / width - 0.5) * 2;
    const percentY = (y / height - 0.5) * 2;

    rotateY.set(percentX * 7);
    rotateX.set(percentY * -7);
    imageScale.set(1.045);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    imageScale.set(1);
  };

  return (
    <section className="relative overflow-hidden pb-24 pt-24 md:pb-32 md:pt-32 xl:pb-40 xl:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.12),transparent_26%),radial-gradient(circle_at_85%_10%,rgba(255,190,120,0.14),transparent_24%),linear-gradient(to_bottom,#fffaf5,#fff7f1,#fffaf5)]" />

      <Container className="relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center rounded-full border border-[#e9d7c7] bg-white/70 px-4 py-2 backdrop-blur-sm">
              <span className="text-[10px] uppercase tracking-[0.34em] text-[#a77446] md:text-[11px]">
                {t("badge")}
              </span>
            </div>

            <h1 className="mt-7 text-[2.9rem] font-semibold leading-[0.92] tracking-[-0.06em] text-[#181512] sm:text-6xl md:text-7xl xl:text-[6.3rem]">
              {t("title.line1")}
              <br className="hidden sm:block" />
              <span className="block">{t("title.line2")}</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[#5f5348] md:text-lg">
              {t("description")}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff6a00] to-[#ff8c42] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(255,106,0,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(255,106,0,0.3)]"
              >
                {t("ctaPrimary")}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/sculptures"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/80 px-6 py-3.5 text-sm font-semibold text-[#181512] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                {t("ctaSecondary")}
              </Link>
            </div>

            <p className="mt-5 text-sm text-[#7a6654]">{t("trustLine")}</p>

            <div className="mt-10 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-black/5 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#7a6654] backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            className="relative"
          >
            <div className="pointer-events-none absolute -left-8 top-10 hidden h-40 w-40 rounded-full bg-[#ff6a00]/10 blur-3xl lg:block" />
            <div className="pointer-events-none absolute -bottom-10 right-0 hidden h-52 w-52 rounded-full bg-[#ffd7b0]/30 blur-3xl lg:block" />

            <div className="perspective-[1400px]">
              <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  rotateX: smoothRotateX,
                  rotateY: smoothRotateY,
                  transformStyle: "preserve-3d",
                }}
                className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-gradient-to-br from-[#fffaf5] via-[#f9efe4] to-[#f1e1cf] p-5 shadow-[0_30px_80px_rgba(180,120,60,0.12)] transition-shadow duration-500 hover:shadow-[0_36px_95px_rgba(180,120,60,0.18)] md:p-6"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-white/40 bg-[linear-gradient(180deg,#fbf3ea_0%,#f1e2d2_100%)]">
                  <motion.div
                    style={{ scale: smoothScale }}
                    className="absolute inset-0 will-change-transform"
                  >
                    <Image
                      src={signatureImage}
                      alt={signaturePiece?.title ?? t("signature.alt")}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                    />
                  </motion.div>

                  <motion.div
                    style={{ x: overlayX, y: overlayY }}
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#181512]/34 via-[#181512]/8 to-transparent"
                  />

                  <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/12 to-transparent" />

                  <motion.div
                    style={{
                      x: floatingCardX,
                      y: floatingCardY,
                      transformStyle: "preserve-3d",
                    }}
                    className="relative z-10 flex h-full items-end p-6 md:p-7"
                  >
                    <div className="max-w-xs rounded-[1.5rem] border border-white/30 bg-gradient-to-b from-white/20 via-white/10 to-white/5 p-6 shadow-[0_12px_40px_rgba(80,50,20,0.18)] backdrop-blur-md">
                      <p className="text-[10px] uppercase tracking-[0.34em] text-black/55">
                        {t("signature.label")}
                      </p>

                      <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em] text-black/90">
                        {t("signature.title")}
                      </h2>

                      <p className="mt-3 text-sm leading-7 text-black/70">
                        {t("signature.description")}
                      </p>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <div className="rounded-2xl border border-black/5 bg-white/65 px-4 py-4 backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#a48a73]">
                      {t("universe.label")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#181512]">
                      {t("universe.value")}
                    </p>
                  </div>

                  <div className="flex items-center justify-center rounded-2xl border border-black/5 bg-white/60 px-5 py-4 backdrop-blur-sm">
                    <div className="h-11 w-11 rounded-full border border-[#ff6a00]/15 bg-gradient-to-br from-[#fff4ea] to-[#f3e8dc]" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}