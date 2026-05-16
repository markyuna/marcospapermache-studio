// src/components/sections/ProcessSection.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Feather,
  Hand,
  Leaf,
  Recycle,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

const processSteps = [
  {
    number: "01",
    key: "inspiration",
    image: "/process/inspiration.png",
    icon: Sparkles,
  },
  {
    number: "02",
    key: "materials",
    image: "/process/materials.png",
    icon: Recycle,
  },
  {
    number: "03",
    key: "sculpting",
    image: "/process/sculpting.png",
    icon: Hand,
  },
  {
    number: "04",
    key: "textures",
    image: "/process/textures.png",
    icon: Feather,
  },
  {
    number: "05",
    key: "finishing",
    image: "/process/finishing.png",
    icon: BadgeCheck,
  },
] as const;

const ecoItems = [
  {
    key: "recycled",
    icon: Recycle,
  },
  {
    key: "handmade",
    icon: Hand,
  },
  {
    key: "lowImpact",
    icon: Leaf,
  },
] as const;

export function ProcessSection() {
  const t = useTranslations("ProcessSection");

  return (
    <section className="relative overflow-hidden bg-[#fbf6ef] py-24 md:py-32">
      <div className="pointer-events-none absolute left-[-12%] top-20 h-[26rem] w-[26rem] rounded-full bg-[#ff6a00]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-10%] h-[30rem] w-[30rem] rounded-full bg-[#9a6b47]/10 blur-3xl" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[#9a6b47]">
            {t("badge")}
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#181512] md:text-6xl">
            {t("title")}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#66584d] md:text-lg">
            {t("description")}
          </p>
        </motion.div>

        <div className="space-y-10 md:space-y-16">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            const isReverse = index % 2 !== 0;

            return (
              <motion.article
                key={step.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-140px" }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className={`grid items-center gap-8 rounded-[2.2rem] border border-black/5 bg-white/65 p-4 shadow-[0_30px_90px_rgba(24,21,18,0.07)] backdrop-blur-xl md:grid-cols-2 md:p-6 ${
                  isReverse ? "md:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="group relative overflow-hidden rounded-[1.75rem] bg-[#efe4d8]">
                  <div className="absolute left-4 top-4 z-10 rounded-full border border-white/50 bg-white/70 px-4 py-2 text-xs font-medium text-[#181512] shadow-sm backdrop-blur-md">
                    {step.number}
                  </div>

                  <Image
                    src={step.image}
                    alt={t(`steps.${step.key}.title`)}
                    width={900}
                    height={650}
                    className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70" />
                </div>

                <div className="px-2 py-4 md:px-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ff6a00]/15 bg-gradient-to-br from-[#fff4ea] to-[#f2dfcc] shadow-[0_12px_35px_rgba(255,106,0,0.12)]">
                    <Icon className="h-5 w-5 text-[#ff6a00]" />
                  </div>

                  <p className="mt-8 text-sm font-medium uppercase tracking-[0.28em] text-[#9a6b47]">
                    {step.number}
                  </p>

                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#181512] md:text-4xl">
                    {t(`steps.${step.key}.title`)}
                  </h3>

                  <p className="mt-5 text-sm leading-8 text-[#5f5348] md:text-base">
                    {t(`steps.${step.key}.description`)}
                  </p>

                  <p className="mt-6 inline-flex rounded-full border border-black/5 bg-[#fffaf5] px-4 py-2 text-xs font-medium text-[#7a5a42]">
                    {t(`steps.${step.key}.detail`)}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 rounded-[2.2rem] border border-black/5 bg-[#181512] p-8 text-white shadow-[0_35px_100px_rgba(24,21,18,0.18)] md:p-12"
        >
          <div className="grid gap-10 md:grid-cols-[1.1fr_1.4fr] md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#d5a06f]">
                {t("eco.badge")}
              </p>

              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
                {t("eco.title")}
              </h3>

              <p className="mt-5 max-w-xl text-sm leading-8 text-white/65 md:text-base">
                {t("eco.description")}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {ecoItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.key}
                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                      <Icon className="h-4 w-4 text-[#d5a06f]" />
                    </div>

                    <h4 className="mt-5 text-base font-medium">
                      {t(`eco.items.${item.key}.title`)}
                    </h4>

                    <p className="mt-3 text-sm leading-7 text-white/58">
                      {t(`eco.items.${item.key}.description`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-16 max-w-3xl text-center"
        >
          <p className="text-2xl font-medium leading-snug tracking-[-0.035em] text-[#181512] md:text-4xl">
            {t("quote")}
          </p>

          <Button asChild>
            <Link href="/creations-sur-mesure">
              {t("cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}