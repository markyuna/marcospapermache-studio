// src/app/[locale]/creations-sur-mesure/page.tsx
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Gem,
  HandHeart,
  Palette,
  Sparkles,
} from "lucide-react";
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

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  icon?: boolean;
  variant?: "primary" | "secondary";
};

function CtaLink({
  href,
  children,
  icon = false,
  variant = "primary",
}: CtaLinkProps) {
  const baseClassName =
    "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300";

  const variantClassName =
    variant === "primary"
      ? "border border-[#f3a34d]/40 bg-[linear-gradient(135deg,#ff9f43,#e76f16,#c85100)] text-white shadow-[0_18px_55px_rgba(231,111,22,0.28)] hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(231,111,22,0.36)]"
      : "border border-[#ead7c2] bg-white/70 text-[#4f4338] shadow-[0_14px_40px_rgba(70,45,20,0.06)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-[#e76f16]/35 hover:bg-white hover:text-[#c85100]";

  return (
    <Link href={href} className={`${baseClassName} ${variantClassName}`}>
      <span>{children}</span>
      {icon ? (
        <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
      ) : null}
    </Link>
  );
}

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

  const icons = [Sparkles, Palette, HandHeart];

  return (
    <main className="relative overflow-hidden bg-[#fffaf4] text-[#1b1713]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[-10%] h-[34rem] w-[34rem] rounded-full bg-[#ff9f43]/20 blur-[110px]" />
        <div className="absolute right-[-10%] top-[12%] h-[30rem] w-[30rem] rounded-full bg-[#ffc58f]/24 blur-[120px]" />
        <div className="absolute bottom-[12%] left-[18%] h-[24rem] w-[24rem] rounded-full bg-[#f4b26a]/16 blur-[120px]" />
      </div>

      <section className="relative overflow-hidden pb-20 pt-28 md:pb-28 md:pt-36">
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#efcaa8] bg-white/65 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a86d3c] shadow-[0_14px_45px_rgba(90,55,25,0.06)] backdrop-blur-xl">
                <Gem className="h-3.5 w-3.5" />
                {t("hero.eyebrow")}
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-[#17120f] md:text-7xl">
                {t("hero.title")}
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#6b5b4f] md:text-xl">
                {t("hero.description")}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <CtaLink href="/contact" icon>
                  {t("hero.primaryCta")}
                </CtaLink>

                <CtaLink href="/sculptures" variant="secondary">
                  {t("hero.secondaryCta")}
                </CtaLink>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_top,#ff9f43_0%,transparent_48%)] opacity-25 blur-2xl" />

              <div className="relative rounded-[2.5rem] border border-white/70 bg-white/55 p-5 shadow-[0_30px_100px_rgba(65,38,15,0.12)] backdrop-blur-2xl">
                <div className="rounded-[2rem] border border-[#f0ddca] bg-[linear-gradient(145deg,#fffaf4,#fff0e2)] p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a86d3c]">
                      Atelier
                    </span>
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-[#7a5c42]">
                      Sur mesure
                    </span>
                  </div>

                  <div className="mt-16 space-y-4">
                    <div className="h-32 rounded-[2rem] bg-[linear-gradient(135deg,#211713,#9c4f15,#f0a45b)] shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]" />
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-24 rounded-[1.5rem] bg-[#f6d8bd]" />
                      <div className="h-24 rounded-[1.5rem] bg-[#e6a260]" />
                      <div className="h-24 rounded-[1.5rem] bg-[#2b1c16]" />
                    </div>
                  </div>

                  <div className="mt-8 flex items-center gap-3 rounded-3xl border border-white/70 bg-white/65 p-4">
                    <Sparkles className="h-5 w-5 text-[#d86208]" />
                    <p className="text-sm leading-6 text-[#6b5b4f]">
                      Une création pensée autour de votre histoire, de votre
                      espace et de votre matière.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative py-20 md:py-24">
        <Container>
          <div className="mb-12 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#b07a52]">
              {t("process.eyebrow")}
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#17120f] md:text-6xl">
              {t("process.title")}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = icons[index] ?? Sparkles;

              return (
                <article
                  key={`${step.title}-${index}`}
                  className="group relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/65 p-8 shadow-[0_24px_75px_rgba(65,38,15,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_95px_rgba(65,38,15,0.13)]"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,#f0a45b,transparent)] opacity-70" />

                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#efd8c1] bg-[#fff4e9] text-[#c85100] shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-xs font-semibold tracking-[0.24em] text-[#c7a27f]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-7 text-2xl font-semibold tracking-[-0.03em] text-[#181512]">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#65574c]">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="relative py-20 md:py-24">
        <Container>
          <div className="overflow-hidden rounded-[2.75rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(255,239,222,0.74))] p-6 shadow-[0_30px_100px_rgba(65,38,15,0.1)] backdrop-blur-2xl md:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#b07a52]">
                  {t("approach.eyebrow")}
                </p>

                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#17120f] md:text-6xl">
                  {t("approach.title")}
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-8 text-[#6c5d50] md:text-lg">
                  {t("approach.description")}
                </p>
              </div>

              <div className="rounded-[2rem] border border-[#ecd8c5] bg-white/72 p-6 shadow-[0_20px_60px_rgba(65,38,15,0.08)] backdrop-blur-xl md:p-8">
                <ul className="space-y-4">
                  {values.map((value, index) => (
                    <li
                      key={`${value}-${index}`}
                      className="flex items-start gap-3 rounded-2xl border border-transparent p-3 transition duration-300 hover:border-[#f1dfcf] hover:bg-[#fff7ef]"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#c85100]" />
                      <span className="text-sm leading-7 text-[#5f5348] md:text-base">
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative pb-24 pt-10 md:pb-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#9c6e47]">
                {t("contact.eyebrow")}
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#181512] md:text-6xl">
                {t("contact.title")}
              </h2>

              <p className="mt-6 text-base leading-8 text-[#5f5348] md:text-lg">
                {t("contact.description")}
              </p>

              <div className="mt-8 rounded-[2rem] border border-[#efd8c1] bg-white/60 p-5 shadow-[0_18px_55px_rgba(65,38,15,0.07)] backdrop-blur-xl">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 text-[#c85100]" />
                  <p className="text-sm leading-7 text-[#6b5b4f]">
                    Chaque demande est étudiée comme une pièce unique : matière,
                    dimensions, usage, ambiance et émotion recherchée.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/70 bg-white/60 p-3 shadow-[0_30px_100px_rgba(65,38,15,0.11)] backdrop-blur-2xl md:p-4">
              <CommandeForm />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}