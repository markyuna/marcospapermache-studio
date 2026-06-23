// src/components/home/HeroSection.tsx

"use client";

import Image from "next/image";
import { useRef, useState } from "react";
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

type SignaturePieceResponse = {
  title: string | null;
  imageUrl: string;
  imageAlt: string | null;
};

const SIGNATURE_PIECE: SignaturePieceResponse = {
  title: null,
  imageUrl: "/piece-signature2.webp",
  imageAlt:
    "Support à vins sculptural en papier mâché avec éclairage intégré",
};

const BACKGROUND_IMAGE = "/background-beige.webp";

export function HeroSection() {
  const t = useTranslations("Hero");
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [signaturePiece] = useState<SignaturePieceResponse>(SIGNATURE_PIECE);
  const [isHovering, setIsHovering] = useState(false);

  const depthX = useMotionValue(0);
  const depthY = useMotionValue(0);
  const imageScale = useMotionValue(1);

  const smoothDepthX = useSpring(depthX, {
    stiffness: 120,
    damping: 22,
    mass: 0.8,
  });

  const smoothDepthY = useSpring(depthY, {
    stiffness: 120,
    damping: 22,
    mass: 0.8,
  });

  const smoothScale = useSpring(imageScale, {
    stiffness: 150,
    damping: 22,
    mass: 0.78,
  });

  const sculptureX = useTransform(smoothDepthX, [-1, 1], [-18, 18]);
  const sculptureY = useTransform(smoothDepthY, [-1, 1], [-14, 14]);
  const sculptureRotate = useTransform(smoothDepthX, [-1, 1], [-2, 2]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = cardRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const percentX = (x / rect.width - 0.5) * 2;
    const percentY = (y / rect.height - 0.5) * 2;

    depthX.set(percentX);
    depthY.set(percentY);
    imageScale.set(1.035);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    depthX.set(0);
    depthY.set(0);
    imageScale.set(1);
  };

  return (
    <section className="relative overflow-hidden pb-20 pt-10 md:pb-28 md:pt-14 xl:pb-36 xl:pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,150,110,0.10),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(218,198,172,0.18),transparent_24%),linear-gradient(to_bottom,#fffaf6,#f8f1e7,#fffaf6)]" />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-18">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center rounded-full border border-[#e7dac9] bg-white/60 px-4 py-2 backdrop-blur-sm">
              <span className="text-[10px] uppercase tracking-[0.34em] text-[#9d7b5e] md:text-[11px]">
                {t("badge")}
              </span>
            </div>

            <h1 className="mt-7 max-w-4xl text-[3.05rem] font-medium leading-[0.9] tracking-[-0.075em] sm:text-6xl md:text-7xl xl:text-[6.6rem]">
              <span className="block bg-linear-to-r from-[#17130f] via-[#8a633d] to-[#c6a06f] bg-clip-text text-transparent">
                {t("title.line1")}
              </span>
              <span className="block bg-linear-to-r from-[#c6a06f] via-[#6f4b2d] to-[#17130f] bg-clip-text text-transparent">
                {t("title.line2")}
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#5f5348] md:text-lg">
              {t("description")}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#ff7a1a] via-[#ff9a3d] to-[#ffb15f] px-6 py-3.5 text-sm font-medium text-white no-underline shadow-[0_18px_40px_rgba(255,122,26,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_rgba(255,122,26,0.38)]"
              >
                <span>{t("ctaPrimary")}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>

              <Link
                href="/sculptures"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white/70 px-6 py-3.5 text-sm font-medium text-[#181512] no-underline backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-black/30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-2"
              >
                {t("ctaSecondary")}
              </Link>
            </div>

            <p className="mt-5 text-sm text-[#7a6a5c]">{t("trustLine")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            className="relative"
          >
            <div className="pointer-events-none absolute -left-8 top-10 hidden h-40 w-40 rounded-full bg-[#d8c4aa]/25 blur-3xl lg:block" />
            <div className="pointer-events-none absolute -bottom-10 right-0 hidden h-52 w-52 rounded-full bg-[#ece1d3]/60 blur-3xl lg:block" />

            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="group relative overflow-hidden rounded-[2.2rem] border border-[#eadcc9] bg-[#e8d2b4] p-4 shadow-[0_24px_70px_rgba(70,48,24,0.10)] transition-shadow duration-500 hover:shadow-[0_34px_95px_rgba(70,48,24,0.16)] md:p-5"
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-[1.8rem] border border-white/45 bg-[#ead8bf]">
                <Image
                  src={BACKGROUND_IMAGE}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center"
                />

                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#7d5830]/16 via-transparent to-white/8" />

                <div
                  className={[
                    "pointer-events-none absolute left-1/2 top-[58%]",
                    "h-[58%] w-[68%] -translate-x-1/2 -translate-y-1/2",
                    "rounded-full bg-[#f2c27c]/24 blur-3xl transition-opacity duration-500",
                    isHovering ? "opacity-80" : "opacity-45",
                  ].join(" ")}
                />

                <div className="pointer-events-none absolute inset-x-8 bottom-8 h-20 rounded-full bg-black/10 blur-2xl" />

                <motion.div
                  style={{
                    x: sculptureX,
                    y: sculptureY,
                    rotate: sculptureRotate,
                    scale: smoothScale,
                  }}
                  className="absolute inset-x-[4%] bottom-[2%] top-[3%] z-10 will-change-transform"
                >
                  <Image
                    src={signaturePiece.imageUrl}
                    alt={
                      signaturePiece.imageAlt ??
                      signaturePiece.title ??
                      t("signature.alt")
                    }
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-contain object-center drop-shadow-[0_28px_42px_rgba(82,54,24,0.24)]"
                  />
                </motion.div>

                <div className="relative z-20 flex h-full items-end p-4 sm:p-5 md:p-6">
                  <div className="w-full max-w-[13.25rem] rounded-[1.1rem] border border-white/35 bg-white/22 p-3.5 shadow-[0_12px_30px_rgba(50,30,12,0.12)] backdrop-blur-md sm:max-w-[14.5rem] sm:p-4 md:max-w-[15.5rem] md:p-5">
                    <p className="text-[8px] uppercase tracking-[0.28em] text-black/55 sm:text-[9px]">
                      {t("signature.label")}
                    </p>

                    <h2 className="mt-1.5 text-base font-medium tracking-[-0.03em] text-black/90 sm:text-lg md:text-xl">
                      {t("signature.title")}
                    </h2>

                    <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-black/70 sm:text-xs sm:leading-6 md:text-[13px]">
                      {t("signature.description")}
                    </p>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] ring-1 ring-white/28" />
              </div>

              <div className="mt-4 rounded-2xl border border-black/5 bg-white/60 px-4 py-4 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#a48a73]">
                  {t("universe.label")}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#181512]">
                  {t("universe.value")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}