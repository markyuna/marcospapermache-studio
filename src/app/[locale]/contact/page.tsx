// src/app/[locale]/contact/page.tsx

import type { Metadata } from "next";
import {
  ArrowRight,
  Camera,
  Gem,
  Mail,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import AnimatedProcessSteps from "@/components/contact/AnimatedProcessSteps";
import CommandeForm from "@/components/forms/CommandeForm";
import { Container } from "@/components/layout/container";
import JsonLd from "@/components/seo/JsonLd";
import { createMetadata, getAbsoluteUrl, siteConfig } from "@/lib/seo";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "ContactPage.metadata",
  });

  return createMetadata({
    title: t("title"),
    description: t("description"),
    path: `/${locale}/contact`,
    locale,
    image: siteConfig.defaultOgImage,
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "ContactPage" });

  const pageUrl = `${siteConfig.domain}/${locale}/contact`;

  const requestTypes = [
    t("requestTypes.customOrder"),
    t("requestTypes.collaboration"),
    t("requestTypes.artworkQuestion"),
    t("requestTypes.decorativeProject"),
    t("requestTypes.professionalRequest"),
  ];

  const steps = [
    { title: t("steps.step1.title"), text: t("steps.step1.text") },
    { title: t("steps.step2.title"), text: t("steps.step2.text") },
    { title: t("steps.step3.title"), text: t("steps.step3.text") },
    { title: t("steps.step4.title"), text: t("steps.step4.text") },
  ];

  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${pageUrl}#contact`,
    name: t("metadata.title"),
    description: t("metadata.description"),
    url: pageUrl,
    image: getAbsoluteUrl(siteConfig.defaultOgImage),
    inLanguage: locale,
    isPartOf: {
      "@id": `${siteConfig.domain}/${locale}#website`,
    },
    mainEntity: {
      "@id": `${pageUrl}#contact-point`,
    },
  };

  const contactPointJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    "@id": `${pageUrl}#contact-point`,
    contactType: "customer service",
    email: "contact@marcospapermache.com",
    url: pageUrl,
    availableLanguage: ["fr", "en", "es"],
    areaServed: { "@type": "Country", name: "France" },
  };

  const artistContactJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.domain}/${locale}#artist`,
    name: siteConfig.creator,
    alternateName: siteConfig.name,
    jobTitle: "Artiste sculpteur en papier mâché",
    url: siteConfig.domain,
    image: getAbsoluteUrl(siteConfig.defaultOgImage),
    email: "contact@marcospapermache.com",
    sameAs: [siteConfig.instagram],
    contactPoint: { "@id": `${pageUrl}#contact-point` },
  };

  return (
    <>
      <JsonLd data={contactPageJsonLd} />
      <JsonLd data={contactPointJsonLd} />
      <JsonLd data={artistContactJsonLd} />

      <main className="relative overflow-hidden bg-espresso-deep text-white">

        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8%] top-[8%] h-[480px] w-[480px] rounded-full bg-[#c85100]/8 blur-[130px]" />
          <div className="absolute right-[-6%] top-[15%] h-[360px] w-[360px] rounded-full bg-[#e88040]/6 blur-[120px]" />
          <div className="absolute bottom-[5%] left-[30%] h-[300px] w-[300px] rounded-full bg-[#c85100]/5 blur-[110px]" />
        </div>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-20">
          <Container>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e8c8a0] backdrop-blur-xl">
                <Gem className="h-3.5 w-3.5" />
                {t("badge")}
              </div>

              <h1 className="mt-6 text-5xl font-semibold tracking-[-0.055em] md:text-7xl">
                <span className="text-white">{t("title.line1")} </span>
                <span className="bg-gradient-to-r from-white via-[#ffe7d1] to-[#d9956a] bg-clip-text text-transparent">
                  {t("title.line2")}
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/50 md:text-xl">
                {t("description")}
              </p>
            </div>
          </Container>
        </section>

        {/* ── MAIN GRID — contact info | form ──────────────────────── */}
        <section className="relative pb-24 md:pb-32">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">

              {/* Left sidebar */}
              <div className="space-y-5 lg:sticky lg:top-28">

                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#b07050]">
                  {t("contactCard.eyebrow")}
                </p>

                {/* Email */}
                <a
                  href="mailto:contact@marcospapermache.com"
                  className="group flex items-start gap-4 rounded-[1.5rem] border border-white/[0.08] bg-white/[0.04] p-4 transition duration-300 hover:border-[#c85100]/35 hover:bg-white/[0.07]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#c85100]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">
                      {t("contactCard.email.title")}
                    </p>
                    <p className="mt-0.5 break-all text-sm text-white/40">
                      contact@marcospapermache.com
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/25 transition duration-300 group-hover:translate-x-0.5 group-hover:text-[#c85100]" />
                </a>

                {/* Instagram */}
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-4 rounded-[1.5rem] border border-white/[0.08] bg-white/[0.04] p-4 transition duration-300 hover:border-[#c85100]/35 hover:bg-white/[0.07]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#c85100]">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">
                      {t("contactCard.instagram.title")}
                    </p>
                    <p className="mt-0.5 text-sm text-white/40">
                      @marcospapermache
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/25 transition duration-300 group-hover:translate-x-0.5 group-hover:text-[#c85100]" />
                </a>

                {/* Request type tags */}
                <div className="rounded-[1.75rem] border border-white/[0.07] bg-white/[0.03] p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/35">
                    {t("contactCard.requestTypesTitle")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {requestTypes.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/50"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: form */}
              <CommandeForm dark />
            </div>
          </Container>
        </section>

        {/* ── PROCESS STEPS ────────────────────────────────────────── */}
        <section className="relative border-t border-white/[0.07] py-20 md:py-28">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">

              <div className="lg:sticky lg:top-28">
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#b07050]">
                  {t("process.eyebrow")}
                </p>
                <h2 className="mt-4 bg-gradient-to-br from-white via-[#ffe7d1] to-[#d9956a] bg-clip-text text-3xl font-semibold tracking-[-0.045em] text-transparent md:text-5xl">
                  {t("process.title")}
                </h2>
              </div>

              <AnimatedProcessSteps steps={steps} />
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
