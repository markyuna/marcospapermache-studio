// src/components/sections/ProcessSection.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Hand,
  Leaf,
  Recycle,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { SectionDivider } from "@/components/layout/SectionDivider";
import { Link } from "@/i18n/navigation";

const processSteps = [
  {
    key: "inspiration",
    image: "/process/inspiration.png",
    icon: Sparkles,
    number: "01",
  },
  {
    key: "sculpting",
    image: "/process/sculpting.png",
    icon: Hand,
    number: "02",
  },
  {
    key: "finishing",
    image: "/process/finishing.png",
    icon: BadgeCheck,
    number: "03",
  },
] as const;

const ecoItems = [
  { key: "recycled", icon: Recycle },
  { key: "handmade", icon: Hand },
  { key: "lowImpact", icon: Leaf },
] as const;

export function ProcessSection() {
  const t = useTranslations("ProcessSection");

  return (
    <section className="relative overflow-hidden bg-espresso-deep py-24 text-white md:py-32">

      <SectionDivider position="top" />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6%] top-[10%] h-[420px] w-[420px] rounded-full bg-[#c85100]/8 blur-[130px]" />
        <div className="absolute right-[-6%] bottom-[15%] h-[340px] w-[340px] rounded-full bg-[#e88040]/6 blur-[120px]" />
      </div>

      <SectionDivider position="bottom" />

      <Container className="relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#b07050]">
            {t("badge")}
          </p>
          <h2 className="mt-4 bg-gradient-to-br from-white via-[#ffe7d1] to-[#d9956a] bg-clip-text text-4xl font-semibold tracking-[-0.045em] text-transparent md:text-6xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/45 md:text-lg">
            {t("description")}
          </p>
        </motion.div>

        {/* 3 process cards with image backgrounds */}
        <div className="grid gap-5 md:grid-cols-3">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.13,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative h-[440px] overflow-hidden rounded-[2.25rem] md:h-[500px]"
              >
                <Image
                  src={step.image}
                  alt={t(`steps.${step.key}.title`)}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.05]"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/35 to-black/12" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

                {/* Top bar */}
                <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-xl">
                    <Icon className="h-4 w-4 text-[#e8a865]" />
                  </div>
                  <span className="rounded-full border border-white/12 bg-white/[0.07] px-3 py-1.5 text-[10px] font-semibold tracking-[0.24em] text-white/55 backdrop-blur-xl">
                    {step.number}
                  </span>
                </div>

                {/* Content bottom */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                    {t(`steps.${step.key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/55">
                    {t(`steps.${step.key}.description`)}
                  </p>
                  <span className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 backdrop-blur-sm">
                    {t(`steps.${step.key}.detail`)}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Eco block */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 overflow-hidden rounded-[2.25rem] border border-[#c07040]/18 bg-[linear-gradient(135deg,rgba(192,112,64,0.10),rgba(192,112,64,0.04))] p-8 backdrop-blur-sm md:p-12"
        >
          <div className="grid gap-10 md:grid-cols-[1.1fr_1.4fr] md:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#c07050]">
                {t("eco.badge")}
              </p>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
                {t("eco.title")}
              </h3>
              <p className="mt-5 max-w-xl text-sm leading-8 text-white/50 md:text-base">
                {t("eco.description")}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {ecoItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className="rounded-[1.5rem] border border-white/[0.07] bg-white/[0.04] p-5 transition duration-300 hover:border-[#c07040]/25 hover:bg-white/[0.07]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c07040]/20 bg-[#c07040]/10">
                      <Icon className="h-4 w-4 text-[#d98850]" />
                    </div>
                    <h4 className="mt-5 text-base font-medium text-white">
                      {t(`eco.items.${item.key}.title`)}
                    </h4>
                    <p className="mt-3 text-sm leading-7 text-white/45">
                      {t(`eco.items.${item.key}.description`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Quote + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-16 max-w-3xl text-center"
        >
          <p className="text-2xl font-medium leading-snug tracking-[-0.035em] text-white/65 md:text-4xl">
            &ldquo;{t("quote")}&rdquo;
          </p>

          <Link
            href="/creations-sur-mesure"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff9f43,#e76f16,#c85100)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_45px_rgba(231,111,22,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(231,111,22,0.38)]"
          >
            {t("cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
