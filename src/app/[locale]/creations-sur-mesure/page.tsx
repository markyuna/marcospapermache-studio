// src/app/[locale]/creations-sur-mesure/page.tsx
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CommandeForm from "@/components/forms/CommandeForm";
import { Container } from "@/components/layout/container";
import { routing } from "@/i18n/routing";

type Step = {
  title: string;
  description: string;
};

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CustomCreationPage({ params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fr" | "en" | "es")) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations("CustomCreationPage");
  const steps = t.raw("steps") as Step[];
  const values = t.raw("values") as string[];

  return (
    <main className="relative overflow-hidden">
      <section className="relative overflow-hidden pb-24 pt-28 md:pb-32 md:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.14),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(255,190,120,0.16),transparent_26%),linear-gradient(to_bottom,#fffaf5,#fff5ed,#fffaf5)]" />

        <Container className="relative">
          <div className="max-w-4xl">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#b07a52]">
              {t("hero.eyebrow")}
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#1b1713] md:text-6xl">
              {t("hero.title")}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6c5d50]">
              {t("hero.description")}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#ef8316] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:bg-[#af6020]"
              >
                {t("hero.primaryCta")}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/sculptures"
                className="inline-flex items-center gap-2 rounded-full border border-[#dcc7b2] bg-white/80 px-6 py-3 text-sm font-medium text-[#4f4338] backdrop-blur-md transition duration-300 hover:border-[#ff6a00]/30 hover:text-[#c65400]"
              >
                {t("hero.secondaryCta")}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-24">
        <Container>
          <div className="mb-12 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#b07a52]">
              {t("process.eyebrow")}
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#1b1713] md:text-5xl">
              {t("process.title")}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={`${step.title}-${index}`}
                className="rounded-[2rem] border border-black/5 bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ead7c2] bg-[#fff7f0] text-sm font-medium text-[#9c6e47]">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="mt-6 text-2xl font-medium text-[#181512]">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#5f5348]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#b07a52]">
                {t("approach.eyebrow")}
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#1b1713] md:text-5xl">
                {t("approach.title")}
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-[#6c5d50] md:text-lg">
                {t("approach.description")}
              </p>
            </div>

            <div className="rounded-[2rem] border border-black/5 bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-sm">
              <ul className="space-y-4">
                {values.map((value, index) => (
                  <li key={`${value}-${index}`} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#c65400]" />
                    <span className="text-sm leading-7 text-[#5f5348] md:text-base">
                      {value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-24 pt-10 md:pb-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#9c6e47]">
                {t("contact.eyebrow")}
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#181512] md:text-5xl">
                {t("contact.title")}
              </h2>

              <p className="mt-5 text-base leading-8 text-[#5f5348] md:text-lg">
                {t("contact.description")}
              </p>
            </div>

            <CommandeForm />
          </div>
        </Container>
      </section>
    </main>
  );
}