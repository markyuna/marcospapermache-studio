// src/app/[locale]/sculptures/page.tsx

import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import Gallery from "@/components/sculptures/Gallery";
import JsonLd from "@/components/seo/JsonLd";
import { Link } from "@/i18n/navigation";
import { localizeArtwork } from "@/lib/artwork-i18n";
import { getArtworks } from "@/lib/artworks";
import { createMetadata, getAbsoluteUrl, siteConfig } from "@/lib/seo";
import type { Artwork } from "@/types/artwork";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

async function getSafeArtworks(): Promise<Artwork[]> {
  try {
    return await getArtworks();
  } catch (error) {
    console.log("Erreur lors du chargement des œuvres:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "SculpturesPage",
  });

  return createMetadata({
    title: t("metadata.title"),
    description: t("metadata.description"),
    path: `/${locale}/sculptures`,
    locale,
    image: siteConfig.defaultOgImage,
  });
}

export default async function SculpturesPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: "SculpturesPage",
  });

  const artworks = await getSafeArtworks();

  const pageUrl = `${siteConfig.domain}/${locale}/sculptures`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    name: t("metadata.title"),
    description: t("metadata.description"),
    url: pageUrl,
    image: getAbsoluteUrl(siteConfig.defaultOgImage),
    inLanguage: locale,
    creator: {
      "@type": "Person",
      name: siteConfig.creator,
      url: siteConfig.domain,
      sameAs: [siteConfig.instagram],
    },
    isPartOf: {
      "@id": `${siteConfig.domain}/${locale}#website`,
    },
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#item-list`,
    name: t("collectionTitle"),
    itemListElement: artworks.map((artwork, index) => {
      const localizedArtwork = localizeArtwork(artwork, locale);
      const artworkUrl = `${siteConfig.domain}/${locale}/sculptures/${artwork.slug}`;
      const imageUrl = localizedArtwork.images[0]?.image_url;

      return {
        "@type": "ListItem",
        position: index + 1,
        url: artworkUrl,
        item: {
          "@type": "VisualArtwork",
          name: localizedArtwork.title,
          url: artworkUrl,
          image: imageUrl ? getAbsoluteUrl(imageUrl) : undefined,
          artform: "Sculpture en papier mâché",
          artMedium: localizedArtwork.materials || "Papier mâché",
          creator: {
            "@type": "Person",
            name: siteConfig.creator,
          },
        },
      };
    }),
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={itemListJsonLd} />

      <main className="bg-[#f8f5ef] text-neutral-900">
        {/* Hero Banner */}
        <section className="relative isolate overflow-hidden">
          <div className="relative h-[360px] w-full sm:h-[420px] md:h-[480px] lg:h-[540px] xl:h-[580px]">
            <Image
              src="/banniere.png"
              alt={t("bannerAlt")}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_30%] md:object-[center_34%]"
            />

            {/* Cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/68 via-black/28 to-transparent" />

            {/* Atmospheric depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-transparent to-transparent" />

            {/* Bottom blend into page */}
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-[#f8f5ef] md:h-48" />

            {/* Content */}
            <div className="absolute inset-0 flex items-end">
              <Container className="pb-14 md:pb-20 lg:pb-24">
                <div className="max-w-2xl">
                  <p className="text-[11px] uppercase tracking-[0.38em] text-white/55 md:text-xs">
                    {t("eyebrow")}
                  </p>

                  <div className="mt-4 h-px w-14 bg-white/30 md:mt-5" />

                  <h1 className="mt-5 mb-3 bg-gradient-to-br from-white via-[#ffe7d1] to-[#d07a2d] bg-clip-text text-4xl font-semibold tracking-[-0.05em] text-transparent drop-shadow-[0_0_18px_rgba(208,122,45,0.16)] md:text-5xl lg:text-6xl">
                    {t("title")}
                  </h1>

                  <p className="mt-3 max-w-md text-sm leading-7 text-white/58 drop-shadow-sm md:text-[15px] md:leading-8">
                    {t("subtitle")}
                  </p>

                  {artworks.length > 0 && (
                    <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3.5 py-1.5 text-[11px] font-medium text-white/50 backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c8873f]" />
                      {artworks.length} œuvres
                    </div>
                  )}
                </div>
              </Container>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="relative -mt-4 py-12 md:py-16 lg:py-20">
          <Container>
            {/* Section header */}
            <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between md:mb-16">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-400">
                  {t("collectionLabel")}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-neutral-900 md:text-3xl lg:text-4xl">
                  {t("collectionTitle")}
                </h2>
              </div>

              {artworks.length > 0 && (
                <p className="shrink-0 text-sm text-neutral-400">
                  {artworks.length} pièces
                </p>
              )}
            </div>

            {artworks.length > 0 ? (
              <Gallery artworks={artworks} />
            ) : (
              <div className="mx-auto max-w-3xl rounded-3xl border border-black/10 bg-white/70 p-8 text-center shadow-sm backdrop-blur">
                <p className="text-sm font-medium text-neutral-700">
                  Les œuvres ne sont pas disponibles pour le moment.
                </p>
              </div>
            )}
          </Container>
        </section>

        {/* Dark CTA section */}
        <section className="relative overflow-hidden bg-[#0d0b09] py-20 md:py-28">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c85100]/6 blur-[130px]" />
          <div className="pointer-events-none absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-[#ff9f43]/4 blur-[100px]" />

          {/* Top shimmer line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c85100]/22 to-transparent" />

          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-white/30">
                {t("collectionLabel")}
              </p>

              <h2 className="bg-gradient-to-br from-white via-[#ffe7d1] to-[#d9956a] bg-clip-text text-3xl font-semibold tracking-[-0.045em] text-transparent md:text-4xl">
                {t("ctaTitle")}
              </h2>

              <p className="mt-4 text-base leading-8 text-white/42">
                {t("ctaSubtitle")}
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[linear-gradient(135deg,#ff9f43,#e76f16,#c85100)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_45px_rgba(231,111,22,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(231,111,22,0.40)]"
              >
                {t("ctaButton")}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
