// src/app/[locale]/quiz/page.tsx

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { Container } from "@/components/layout/container";
import QuizFlow from "@/components/quiz/QuizFlow";
import type { QuizArtwork } from "@/components/quiz/QuizResult";
import JsonLd from "@/components/seo/JsonLd";
import { PROFILES } from "@/data/quiz/profiles";
import { localizeArtwork } from "@/lib/artwork-i18n";
import { getArtworksBySlugs } from "@/lib/artworks";
import { createMetadata, getAbsoluteUrl, siteConfig } from "@/lib/seo";

export const revalidate = 300; // 5 minutos

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

// Los "REEMPLAZAR-..." son placeholders: no se consultan en la base de datos.
function isRealSlug(slug: string) {
  return !slug.startsWith("REEMPLAZAR-");
}

async function getQuizArtworks(locale: string): Promise<QuizArtwork[]> {
  const slugs = [
    ...new Set(PROFILES.flatMap((profile) => profile.sculptureSlugs)),
  ].filter(isRealSlug);

  if (slugs.length === 0) return [];

  try {
    const artworks = await getArtworksBySlugs(slugs);

    return artworks.flatMap((artwork) => {
      const localized = localizeArtwork(artwork, locale);
      const imageUrl =
        artwork.images.find((image) => image.is_cover)?.image_url ??
        artwork.images[0]?.image_url;

      if (!imageUrl) return [];

      return [{ slug: artwork.slug, title: localized.title, imageUrl }];
    });
  } catch (error) {
    console.error("Erreur lors du chargement des œuvres du quiz:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "quiz" });

  return createMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: `/${locale}/quiz`,
    locale,
    image: siteConfig.defaultOgImage,
  });
}

export default async function QuizPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "quiz" });
  const artworks = await getQuizArtworks(locale);

  const pageUrl = `${siteConfig.domain}/${locale}/quiz`;

  const quizJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: t("title"),
    description: t("subtitle"),
    url: pageUrl,
    image: getAbsoluteUrl(siteConfig.defaultOgImage),
    inLanguage: locale,
    isPartOf: {
      "@id": `${siteConfig.domain}/${locale}#website`,
    },
  };

  return (
    <>
      <JsonLd data={quizJsonLd} />

      <main className="bg-paper-base py-16 md:py-24">
        <Container className="max-w-4xl">
          <Suspense fallback={null}>
            <QuizFlow artworks={artworks} />
          </Suspense>
        </Container>
      </main>
    </>
  );
}
