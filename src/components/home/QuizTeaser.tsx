// src/components/home/QuizTeaser.tsx
import { ArrowRight, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { GradientTitle } from "@/components/ui/GradientTitle";
import { Link } from "@/i18n/navigation";

export async function QuizTeaser() {
  const t = await getTranslations("quiz.teaser");

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <Container className="relative z-10">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-[linear-gradient(135deg,var(--paper-base)_0%,var(--paper-surface)_45%,var(--paper-warm)_100%)] px-8 py-12 text-center shadow-[0_35px_120px_rgba(35,25,15,0.10)] md:px-16 md:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.65),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,140,60,0.08),transparent_30%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff8a2a]/35 to-transparent" />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#ead9cb] bg-white/80">
              <Sparkles className="h-5 w-5 text-[#c8873f]" />
            </div>

            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-[#1c1c1a] md:text-5xl">
              <GradientTitle text={t("title")} />
            </h2>

            <p className="mt-5 text-[15px] leading-8 text-[#5f5348] md:text-base">
              {t("text")}
            </p>

            <Link
              href="/quiz"
              className="btn-gold-shimmer mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"
            >
              {t("cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
