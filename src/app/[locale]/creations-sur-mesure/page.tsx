// src/app/[locale]/creations-sur-mesure/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Gem,
  Play,
  Sparkles,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import AnimatedSteps from "@/components/sur-mesure/AnimatedSteps";
import CommandeForm from "@/components/forms/CommandeForm";
import { Container } from "@/components/layout/container";
import JsonLd from "@/components/seo/JsonLd";
import { routing } from "@/i18n/routing";
import { createMetadata, getAbsoluteUrl, siteConfig } from "@/lib/seo";

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
    "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2";

  const variantClassName =
    variant === "primary"
      ? "border border-[#f3a34d]/40 bg-[linear-gradient(135deg,#ff9f43,#e76f16,#c85100)] text-white shadow-[0_18px_55px_rgba(231,111,22,0.35)] hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(231,111,22,0.45)]"
      : "border border-[#f3a34d]/40 bg-white/10 text-white backdrop-blur-xl hover:-translate-y-0.5 hover:border-[#f3a34d]/70 hover:bg-[#f3a34d]/10";

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "CustomCreationPage",
  });

  return createMetadata({
    title: t("hero.title"),
    description: t("hero.description"),
    path: `/${locale}/creations-sur-mesure`,
    locale,
    image: siteConfig.defaultOgImage,
  });
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

  const pageUrl = `${siteConfig.domain}/${locale}/creations-sur-mesure`;

  const customCreationPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: t("hero.title"),
    description: t("hero.description"),
    url: pageUrl,
    image: getAbsoluteUrl(siteConfig.defaultOgImage),
    inLanguage: locale,
    isPartOf: {
      "@id": `${siteConfig.domain}/${locale}#website`,
    },
    about: {
      "@id": `${pageUrl}#custom-sculpture-service`,
    },
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#custom-sculpture-service`,
    name: "Création de sculpture sur mesure en papier mâché",
    description:
      "Service de création artistique sur mesure pour imaginer et commander une sculpture en papier mâché, une œuvre murale, un luminaire sculptural ou un objet unique façonné à la main.",
    serviceType: "Création artistique sur mesure",
    provider: {
      "@type": "Person",
      "@id": `${siteConfig.domain}/${locale}#artist`,
      name: siteConfig.creator,
      url: siteConfig.domain,
      sameAs: [siteConfig.instagram],
    },
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: pageUrl,
      availableLanguage: ["fr", "en", "es"],
    },
    url: pageUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: siteConfig.name,
        item: `${siteConfig.domain}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("hero.eyebrow"),
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={customCreationPageJsonLd} />
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <main className="relative overflow-hidden bg-[#fffaf4] text-[#1b1713]">

        {/* ── HERO — video background ─────────────────────────────── */}
        <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-[#0d0b09]">

          {/* YouTube video background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/VWDOuIVu2zk?autoplay=1&mute=1&playsinline=1&rel=0&controls=0&loop=1&playlist=VWDOuIVu2zk&disablekb=1"
              allow="autoplay"
              title="Création sur mesure en papier mâché"
              className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-full min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 scale-105"
            />
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#0d0b09]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

          {/* Bottom fade to cream */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffaf4] to-transparent" />

          <Container className="relative z-10 py-32 md:py-40">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e8c8a0] backdrop-blur-xl">
                <Gem className="h-3.5 w-3.5" />
                {t("hero.eyebrow")}
              </div>

              <h1 className="mt-6 max-w-4xl bg-gradient-to-br from-white via-[#ffe7d1] to-[#d9956a] bg-clip-text text-5xl font-semibold tracking-[-0.055em] text-transparent md:text-7xl">
                {t("hero.title")}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/60 md:text-xl">
                {t("hero.description")}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <CtaLink href="/commande" icon>
                  {t("hero.primaryCta")}
                </CtaLink>

                <CtaLink href="/sculptures" variant="secondary">
                  {t("hero.secondaryCta")}
                </CtaLink>
              </div>
            </div>

            {/* Video label */}
            <div className="mt-14 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 backdrop-blur-xl">
              <Play className="h-3 w-3 fill-[#e8c8a0] text-[#e8c8a0]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
                {t("video.tag")}
              </span>
            </div>
          </Container>
        </section>

        {/* ── PROCESS — animated steps ────────────────────────────── */}
        <section className="relative py-24 md:py-32">
          <Container>
            <div className="mb-14 max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#b07a52]">
                {t("process.eyebrow")}
              </p>

              <h2 className="mt-4 bg-gradient-to-r from-[#17120f] to-[#7a4e2a] bg-clip-text text-4xl font-semibold tracking-[-0.045em] text-transparent md:text-6xl">
                {t("process.title")}
              </h2>
            </div>

            <AnimatedSteps steps={steps} />
          </Container>
        </section>

        {/* ── APPROACH + VALUES ────────────────────────────────────── */}
        <section className="relative py-20 md:py-24">
          <Container>
            <div className="overflow-hidden rounded-[2.75rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,239,222,0.78))] p-6 shadow-[0_30px_100px_rgba(65,38,15,0.1)] backdrop-blur-2xl md:p-10">
              <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#b07a52]">
                    {t("approach.eyebrow")}
                  </p>

                  <h2 className="mt-4 bg-gradient-to-r from-[#17120f] to-[#7a4e2a] bg-clip-text text-3xl font-semibold tracking-[-0.045em] text-transparent md:text-5xl">
                    {t("approach.title")}
                  </h2>

                  <p className="mt-6 max-w-2xl text-base leading-8 text-[#6c5d50] md:text-lg">
                    {t("approach.description")}
                  </p>
                </div>

                <div className="rounded-[2rem] border border-[#ecd8c5] bg-white/80 p-6 shadow-[0_20px_60px_rgba(65,38,15,0.07)] backdrop-blur-xl md:p-8">
                  <ul className="space-y-3">
                    {values.map((value, index) => (
                      <li
                        key={`${value}-${index}`}
                        className="flex items-start gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition duration-300 hover:border-[#f1dfcf] hover:bg-[#fff7ef]"
                      >
                        <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#c85100]" />
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

        {/* ── CONTACT + FORM — dark section ───────────────────────── */}
        <section className="relative bg-[#0d0b09] pb-24 pt-20 md:pb-32 md:pt-24">
          {/* Top fade from cream */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fffaf4] to-transparent" />

          {/* Warm glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-10%] top-[20%] h-[28rem] w-[28rem] rounded-full bg-[#c85100]/10 blur-[100px]" />
            <div className="absolute right-[-8%] bottom-[10%] h-[22rem] w-[22rem] rounded-full bg-[#e88040]/8 blur-[120px]" />
          </div>

          <Container className="relative z-10">
            <div className="grid gap-14 lg:grid-cols-[0.78fr_1fr] lg:items-start">

              {/* Sidebar */}
              <div className="lg:sticky lg:top-28">
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#b07050]">
                  {t("contact.eyebrow")}
                </p>

                <h2 className="mt-4 bg-gradient-to-br from-white via-[#ffe7d1] to-[#d9956a] bg-clip-text text-4xl font-semibold tracking-[-0.045em] text-transparent md:text-5xl">
                  {t("contact.title")}
                </h2>

                <p className="mt-6 text-base leading-8 text-white/50 md:text-lg">
                  {t("contact.description")}
                </p>

                <div className="mt-8 rounded-[1.75rem] border border-white/[0.08] bg-white/[0.05] p-5 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[#c07040]" />
                    <p className="text-sm leading-7 text-white/45">
                      Chaque demande est étudiée comme une pièce unique :
                      matière, dimensions, usage, ambiance et émotion
                      recherchée.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <CommandeForm dark />
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
