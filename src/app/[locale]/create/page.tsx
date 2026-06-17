// src/app/[locale]/create/page.tsx

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import AIExperienceSection from "@/components/create/AIExperienceSection";
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

  return createMetadata({
    title: "Créer une sculpture avec l’IA",
    description:
      "Imaginez une sculpture en papier mâché avec l’aide de l’intelligence artificielle, puis transformez votre idée en création artisanale sur mesure.",
    path: `/${locale}/create`,
    locale,
    image: siteConfig.defaultOgImage,
  });
}

export default async function CreatePage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: "AIExperience",
  });

  const pageUrl = `${siteConfig.domain}/${locale}/create`;

  const createPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: t("title"),
    description: t("description"),
    url: pageUrl,
    image: getAbsoluteUrl(siteConfig.defaultOgImage),
    inLanguage: locale,
    isPartOf: {
      "@id": `${siteConfig.domain}/${locale}#website`,
    },
    about: {
      "@type": "CreativeWork",
      name: "Création de sculpture en papier mâché assistée par IA",
      creator: {
        "@type": "Person",
        name: siteConfig.creator,
        url: siteConfig.domain,
      },
    },
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "Création de sculpture personnalisée avec visualisation IA",
    description:
      "Service de création sur mesure permettant d’imaginer une sculpture en papier mâché grâce à une visualisation générée par intelligence artificielle.",
    provider: {
      "@type": "Person",
      name: siteConfig.creator,
      url: siteConfig.domain,
      sameAs: [siteConfig.instagram],
    },
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    serviceType: "Création artistique sur mesure",
    url: pageUrl,
  };

  return (
    <>
      <JsonLd data={createPageJsonLd} />
      <JsonLd data={serviceJsonLd} />

      <main className="py-24 md:py-32">
        <Container className="max-w-6xl">
          <AIExperienceSection />
        </Container>
      </main>
    </>
  );
}