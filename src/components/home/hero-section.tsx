"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
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
  imageUrl: "/piece-signature.png",
  imageAlt: "Pièce emblématique Marcos Papermache",
};

export function HeroSection() {
  const t = useTranslations("Hero");
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [signaturePiece] = useState<SignaturePieceResponse>(SIGNATURE_PIECE);
  const [isHovering, setIsHovering] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const imageScale = useMotionValue(1);
  const depthX = useMotionValue(0);
  const depthY = useMotionValue(0);
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(38);

  const smoothRotateX = useSpring(rotateX, {
    stiffness: 120,
    damping: 18,
    mass: 0.8,
  });

  const smoothRotateY = useSpring(rotateY, {
    stiffness: 120,
    damping: 18,
    mass: 0.8,
  });

  const smoothScale = useSpring(imageScale, {
    stiffness: 150,
    damping: 20,
    mass: 0.78,
  });

  const smoothDepthX = useSpring(depthX, {
    stiffness: 120,
    damping: 20,
    mass: 0.8,
  });

  const smoothDepthY = useSpring(depthY, {
    stiffness: 120,
    damping: 20,
    mass: 0.8,
  });

  const smoothPointerX = useSpring(pointerX, {
    stiffness: 100,
    damping: 18,
    mass: 0.9,
  });

  const smoothPointerY = useSpring(pointerY, {
    stiffness: 100,
    damping: 18,
    mass: 0.9,
  });

  const overlayX = useTransform(smoothRotateY, [-10, 10], [-18, 18]);
  const overlayY = useTransform(smoothRotateX, [-10, 10], [18, -18]);

  const imageX = useTransform(smoothDepthX, [-1, 1], [-20, 20]);
  const imageY = useTransform(smoothDepthY, [-1, 1], [-20, 20]);

  const frontLayerX = useTransform(smoothDepthX, [-1, 1], [-30, 30]);
  const frontLayerY = useTransform(smoothDepthY, [-1, 1], [-30, 30]);

  const infoCardX = useTransform(smoothRotateY, [-10, 10], [-10, 10]);
  const infoCardY = useTransform(smoothRotateX, [-10, 10], [10, -10]);

  const shadowX = useTransform(smoothRotateY, [-10, 10], [-26, 26]);
  const shadowY = useTransform(smoothRotateX, [-10, 10], [-18, 18]);

  const shimmerOpacity = useTransform(
    [smoothRotateX, smoothRotateY],
    (values) => {
      const [x, y] = values as number[];
      const intensity = (Math.abs(x) + Math.abs(y)) / 14;
      return Math.min(0.34, 0.14 + intensity * 0.22);
    }
  );

  const glowBackground = useMotionTemplate`
    radial-gradient(
      circle at ${smoothPointerX}% ${smoothPointerY}%,
      rgba(255,255,255,0.42) 0%,
      rgba(255,255,255,0.18) 14%,
      rgba(255,255,255,0.06) 24%,
      transparent 42%
    )
  `;

  const specularBackground = useMotionTemplate`
    radial-gradient(
      circle at ${smoothPointerX}% ${smoothPointerY}%,
      rgba(255,248,238,0.36) 0%,
      rgba(255,248,238,0.12) 12%,
      transparent 28%
    )
  `;

  const highlights = useMemo(
    () => [
      t("highlights.unique"),
      t("highlights.custom"),
      t("highlights.artistic"),
    ],
    [t]
  );

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

    rotateY.set(percentX * 7.2);
    rotateX.set(percentY * -7.2);

    depthX.set(percentX);
    depthY.set(percentY);

    imageScale.set(1.045);

    pointerX.set((x / width) * 100);
    pointerY.set((y / height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    rotateX.set(0);
    rotateY.set(0);
    depthX.set(0);
    depthY.set(0);
    imageScale.set(1);
    pointerX.set(50);
    pointerY.set(38);
  };

  return (
    <section className="relative overflow-hidden pb-24 pt-24 md:pb-32 md:pt-32 xl:pb-40 xl:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,150,110,0.10),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(218,198,172,0.18),transparent_24%),linear-gradient(to_bottom,#fffaf6,#f8f1e7,#fffaf6)]" />

      <Container className="relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
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

            <h1 className="mt-7 text-[2.9rem] font-medium leading-[0.92] tracking-[-0.065em] text-[#181512] sm:text-6xl md:text-7xl xl:text-[6.2rem]">
              {t("title.line1")}
              <br className="hidden sm:block" />
              <span className="block">{t("title.line2")}</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#5f5348] md:text-lg">
              {t("description")}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#181512] px-6 py-3.5 text-sm font-medium text-white no-underline shadow-[0_18px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2a241f] hover:shadow-[0_24px_55px_rgba(0,0,0,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 [&_svg]:text-white"
              >
                <span className="text-white">{t("ctaPrimary")}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-white" />
              </Link>

              <Link
                href="/sculptures"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white/70 px-6 py-3.5 text-sm font-medium text-[#181512] no-underline backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-black/30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-2"
              >
                {t("ctaSecondary")}
              </Link>
            </div>

            <p className="mt-5 text-sm text-[#7a6a5c]">{t("trustLine")}</p>

            <div className="mt-10 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-black/5 bg-white/65 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#8a7a6a] backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            className="relative"
          >
            <div className="pointer-events-none absolute -left-8 top-10 hidden h-40 w-40 rounded-full bg-[#d8c4aa]/25 blur-3xl lg:block" />
            <div className="pointer-events-none absolute -bottom-10 right-0 hidden h-52 w-52 rounded-full bg-[#ece1d3]/60 blur-3xl lg:block" />

            <div className="perspective-[2200px]">
              <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  rotateX: smoothRotateX,
                  rotateY: smoothRotateY,
                  transformStyle: "preserve-3d",
                }}
                className="group relative overflow-visible rounded-[2.2rem] border border-black/[0.04] bg-gradient-to-br from-[#fffaf5] via-[#f8efe5] to-[#f1e5d8] p-5 shadow-[0_24px_70px_rgba(70,48,24,0.10)] transition-shadow duration-500 hover:shadow-[0_38px_120px_rgba(70,48,24,0.18)] md:p-6"
              >
                <motion.div
                  style={{ x: shadowX, y: shadowY }}
                  className="pointer-events-none absolute inset-[8%] -z-10 rounded-[2.2rem] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.24),rgba(0,0,0,0.10),transparent_70%)] blur-3xl"
                />

                <div
                  className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] border border-white/40 bg-[linear-gradient(180deg,#faf3eb_0%,#f0e1d1_100%)]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    style={{
                      background: glowBackground,
                      opacity: isHovering ? 1 : 0.82,
                      transform: "translateZ(18px)",
                    }}
                    className="pointer-events-none absolute inset-[-8%]"
                  />

                  <motion.div
                    style={{
                      x: imageX,
                      y: imageY,
                      scale: smoothScale,
                      transformStyle: "preserve-3d",
                    }}
                    className="absolute inset-0 will-change-transform"
                  >
                    <div
                      className="absolute inset-[16%] rounded-[2rem] bg-black/18 blur-3xl"
                      style={{ transform: "translateZ(8px)" }}
                    />

                    <div
                      className="absolute inset-[6%] opacity-30 blur-[22px]"
                      style={{ transform: "translateZ(16px)" }}
                    >
                      <Image
                        src={signaturePiece.imageUrl}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        className="object-contain object-center"
                      />
                    </div>

                    <div
                      className="absolute inset-[2%]"
                      style={{ transform: "translateZ(38px)" }}
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
                        className="object-contain object-center drop-shadow-[0_30px_45px_rgba(74,48,18,0.22)]"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    style={{
                      x: overlayX,
                      y: overlayY,
                      opacity: shimmerOpacity,
                      background: specularBackground,
                      transform: "translateZ(56px)",
                    }}
                    className="pointer-events-none absolute inset-[-4%] mix-blend-screen"
                  />

                  <motion.div
                    style={{
                      x: frontLayerX,
                      y: frontLayerY,
                      transformStyle: "preserve-3d",
                    }}
                    className="pointer-events-none absolute inset-0"
                  >
                    <div
                      className="absolute left-[9%] top-[10%] h-24 w-24 rounded-full bg-white/14 blur-2xl"
                      style={{ transform: "translateZ(76px)" }}
                    />
                    <div
                      className="absolute right-[8%] top-[14%] h-28 w-28 rounded-full bg-[#f2dcc2]/18 blur-3xl"
                      style={{ transform: "translateZ(86px)" }}
                    />
                    <div
                      className="absolute bottom-[10%] left-[10%] h-24 w-48 rounded-full bg-[#f4d9b8]/18 blur-3xl"
                      style={{ transform: "translateZ(92px)" }}
                    />
                  </motion.div>

                  <motion.div
                    style={{
                      x: infoCardX,
                      y: infoCardY,
                      transformStyle: "preserve-3d",
                    }}
                    className="relative z-10 flex h-full items-end p-6 md:p-7"
                  >
                    <div
                      className="max-w-xs rounded-[1.55rem] border border-white/25 bg-gradient-to-b from-white/24 via-white/11 to-white/6 p-6 shadow-[0_16px_45px_rgba(50,30,12,0.18)] backdrop-blur-md"
                      style={{ transform: "translateZ(118px)" }}
                    >
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

                  <div
                    className="pointer-events-none absolute inset-0 rounded-[1.8rem] ring-1 ring-white/24"
                    style={{ transform: "translateZ(122px)" }}
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <div className="rounded-2xl border border-black/5 bg-white/60 px-4 py-4 backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#a48a73]">
                      {t("universe.label")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#181512]">
                      {t("universe.value")}
                    </p>
                  </div>

                  <div className="flex items-center justify-center rounded-2xl border border-black/5 bg-white/55 px-5 py-4 backdrop-blur-sm">
                    <div className="relative h-11 w-11 rounded-full border border-black/5 bg-gradient-to-br from-[#f7efe4] to-[#eee1d0]">
                      <div className="absolute inset-2 rounded-full bg-white/55 blur-[2px]" />
                    </div>
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