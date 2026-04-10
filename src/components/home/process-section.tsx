import { Bot, PencilRuler, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";

const steps = [
  { key: "imagine", icon: Sparkles },
  { key: "generate", icon: Bot },
  { key: "transform", icon: PencilRuler },
] as const;

export function ProcessSection() {
  const t = useTranslations("ProcessSection");

  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="mb-14 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.32em] text-[#9a6b47]">
            {t("badge")}
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#181512] md:text-5xl">
            {t("title")}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.key}
                className="rounded-[1.9rem] border border-black/5 bg-white/65 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ff6a00]/15 bg-gradient-to-br from-[#fff4ea] to-[#f3e8dc]">
                  <Icon className="h-5 w-5 text-[#ff6a00]" />
                </div>

                <h3 className="mt-6 text-xl font-medium text-[#181512]">
                  {t(`steps.${step.key}.title`)}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#5f5348]">
                  {t(`steps.${step.key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}