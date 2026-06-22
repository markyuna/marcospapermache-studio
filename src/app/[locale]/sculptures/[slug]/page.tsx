// src/app/[locale]/sculptures/[slug]/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import SculptureImageGallery from "@/components/sculptures/SculptureImageGallery";
import JsonLd from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/button";
import { localizeArtwork } from "@/lib/artwork-i18n";
import { getArtworkBySlug } from "@/lib/artworks";
import { createMetadata, getAbsoluteUrl, siteConfig } from "@/lib/seo";

type SculptureDetailPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

function isArtworkAvailableOnEtsy({
  etsyUrl,
  availability,
}: {
  etsyUrl?: string | null;
  availability?: string | null;
}) {
  const normalizedAvailability = availability?.toLowerCase().trim() ?? "";

  const isExplicitlyUnavailable =
    normalizedAvailability.includes("non disponible") ||
    normalizedAvailability.includes("indisponible") ||
    normalizedAvailability.includes("vendue") ||
    normalizedAvailability.includes("sold") ||
    normalizedAvailability.includes("unavailable");

  const isExplicitlyAvailable =
    normalizedAvailability.includes("disponible") ||
    normalizedAvailability.includes("available");

  return Boolean(etsyUrl) && isExplicitlyAvailable && !isExplicitlyUnavailable;
}

function stripHtml(value?: string | null) {
  if (!value) return "";

  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(value: string, maxLength = 155) {
  if (value.length <= maxLength) return value;

  return `${value.slice(0, maxLength).trim()}…`;
}

function getAvailabilityBadgeStyle(availability?: string | null): string {
  const n = availability?.toLowerCase().trim() ?? "";
  if (n.includes("vendue") || n.includes("sold") || n.includes("vendida")) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }
  if (n.includes("disponible") || n.includes("available")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  return "border-[#eadcc8] bg-[#f3ece2] text-[#5c4632]";
}

function getArtworkSeoDescription({
  description,
  subtitle,
  title,
  fallback,
}: {
  description?: string | null;
  subtitle?: string | null;
  title: string;
  fallback: string;
}) {
  const cleanDescription = stripHtml(description);
  const cleanSubtitle = stripHtml(subtitle);

  if (cleanDescription) {
    return truncateText(cleanDescription);
  }

  if (cleanSubtitle) {
    return truncateText(cleanSubtitle);
  }

  return truncateText(
    `${title}, œuvre unique en papier mâché créée à la main par Marcos Suarez. ${fallback}`
  );
}

function getArtworkImage(image?: string | null) {
  if (!image) return siteConfig.defaultOgImage;

  return image;
}

export async function generateMetadata({
  params,
}: SculptureDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  const t = await getTranslations({
    locale,
    namespace: "SculptureDetailPage",
  });

  if (!artwork) {
    return createMetadata({
      title: t("metadata.fallbackTitle"),
      description: t("metadata.fallbackDescription"),
      path: `/${locale}/sculptures/${slug}`,
      locale,
      noIndex: true,
    });
  }

  const localizedArtwork = localizeArtwork(artwork, locale);
  const coverImage = localizedArtwork.images[0]?.image_url;

  const title = `${localizedArtwork.title} — Sculpture en papier mâché`;

  const description = getArtworkSeoDescription({
    title: localizedArtwork.title,
    description: localizedArtwork.description,
    subtitle: localizedArtwork.subtitle,
    fallback: t("metadata.fallbackDescription"),
  });

  return createMetadata({
    title,
    description,
    path: `/${locale}/sculptures/${slug}`,
    locale,
    image: getArtworkImage(coverImage),
    type: "article",
  });
}

export default async function SculptureDetailPage({
  params,
}: SculptureDetailPageProps) {
  const { locale, slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  const t = await getTranslations({
    locale,
    namespace: "SculptureDetailPage",
  });

  if (!artwork) {
    notFound();
  }

  const localizedArtwork = localizeArtwork(artwork, locale);

  const pageUrl = `${siteConfig.domain}/${locale}/sculptures/${slug}`;
  const customCreationHref = `/${locale}/creations-sur-mesure`;

  const isAvailableOnEtsy = isArtworkAvailableOnEtsy({
    etsyUrl: localizedArtwork.etsy_url,
    availability: localizedArtwork.availability,
  });

  const etsyUrl =
    isAvailableOnEtsy && localizedArtwork.etsy_url
      ? localizedArtwork.etsy_url
      : null;

  const coverImage = localizedArtwork.images[0]?.image_url;
  const seoImage = getAbsoluteUrl(getArtworkImage(coverImage));

  const seoDescription = getArtworkSeoDescription({
    title: localizedArtwork.title,
    description: localizedArtwork.description,
    subtitle: localizedArtwork.subtitle,
    fallback: t("metadata.fallbackDescription"),
  });

  const artworkJsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "@id": `${pageUrl}#artwork`,
    name: localizedArtwork.title,
    headline: localizedArtwork.title,
    description: seoDescription,
    image: seoImage,
    url: pageUrl,
    creator: {
      "@type": "Person",
      name: siteConfig.creator,
      url: siteConfig.domain,
      sameAs: [siteConfig.instagram],
    },
    artform: "Sculpture en papier mâché",
    artMedium: localizedArtwork.materials || "Papier mâché",
    dateCreated: localizedArtwork.year || undefined,
    width: localizedArtwork.dimensions || undefined,
    category: localizedArtwork.category || undefined,
    inLanguage: locale,
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${pageUrl}#product`,
    name: localizedArtwork.title,
    description: seoDescription,
    image: seoImage,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    manufacturer: {
      "@type": "Person",
      name: siteConfig.creator,
    },
    material: localizedArtwork.materials || "Papier mâché",
    category: localizedArtwork.category || "Sculpture artisanale",
    url: pageUrl,
    offers: {
      "@type": "Offer",
      url: etsyUrl || pageUrl,
      availability: etsyUrl
        ? "https://schema.org/InStock"
        : "https://schema.org/LimitedAvailability",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
        name: t("breadcrumb.sculptures"),
        item: `${siteConfig.domain}/${locale}/sculptures`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: localizedArtwork.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={artworkJsonLd} />
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <main className="relative w-full overflow-x-clip bg-[linear-gradient(to_bottom,#fcfaf6,#f7f2ea,#fbf8f3)] py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,191,163,0.14),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(255,106,0,0.08),transparent_20%)]" />

        <Container className="relative z-10 w-full max-w-[1200px] px-4 md:px-6">
          <div className="grid w-full min-w-0 gap-10 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] xl:gap-20">
            <div className="w-full min-w-0 max-w-full">
              {localizedArtwork.images.length > 0 ? (
                <SculptureImageGallery
                  images={localizedArtwork.images}
                  title={localizedArtwork.title}
                />
              ) : (
                <div className="flex aspect-[4/5] w-full min-w-0 items-center justify-center rounded-[28px] border border-black/[0.04] bg-white/75 text-neutral-400 shadow-[0_18px_50px_rgba(0,0,0,0.04)] md:rounded-[32px]">
                  {t("noImage")}
                </div>
              )}
            </div>

            <aside className="w-full min-w-0 max-w-full break-words lg:sticky lg:top-28 lg:h-fit">

              {/* Category — link back to gallery */}
              <Link
                href={`/${locale}/sculptures`}
                className="inline-block text-[10px] uppercase tracking-[0.32em] text-neutral-400 transition-colors hover:text-[#d07a2d] md:text-[11px] md:tracking-[0.36em]"
              >
                {localizedArtwork.category || t("fallbackCategory")}
              </Link>

              {/* Title */}
              <h1 className="mt-3 max-w-full text-3xl font-medium tracking-[-0.045em] text-[#181512] sm:text-4xl md:text-5xl xl:text-[3.2rem]">
                {localizedArtwork.title}
              </h1>

              {/* Subtitle */}
              {localizedArtwork.subtitle ? (
                <p className="mt-3 text-base leading-7 text-neutral-500 md:text-lg md:leading-8">
                  {localizedArtwork.subtitle}
                </p>
              ) : null}

              {/* Divider */}
              <div className="mt-7 h-px w-full bg-black/[0.07]" />

              {/* Price + Availability */}
              {(localizedArtwork.price || localizedArtwork.availability) ? (
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {localizedArtwork.price ? (
                    <span className="text-3xl font-semibold tracking-[-0.03em] text-[#d07a2d] md:text-4xl">
                      €{localizedArtwork.price}
                    </span>
                  ) : null}
                  {localizedArtwork.availability ? (
                    <span className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium ${getAvailabilityBadgeStyle(localizedArtwork.availability)}`}>
                      {localizedArtwork.availability}
                    </span>
                  ) : null}
                </div>
              ) : null}

              {/* Primary CTA — right after price */}
              <div className="mt-5">
                {etsyUrl ? (
                  <Button asChild variant="default" size="lg" className="w-full sm:w-auto">
                    <Link href={etsyUrl} target="_blank" rel="noreferrer">
                      {t("cta.etsy")}
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="default" size="lg" className="w-full sm:w-auto">
                    <Link href={customCreationHref}>
                      {t("cta.requestThis")}
                    </Link>
                  </Button>
                )}
              </div>

              {/* Specs table — Année + Dimensions side-by-side, Matériaux full width */}
              {(localizedArtwork.year || localizedArtwork.dimensions || localizedArtwork.materials) ? (
                <div className="mt-7 overflow-hidden rounded-[20px] border border-black/[0.05] bg-white/80 shadow-[0_8px_28px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                  {(localizedArtwork.year && localizedArtwork.dimensions) ? (
                    <div className="grid grid-cols-2 divide-x divide-black/[0.05]">
                      <div className="px-4 py-3">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">{t("year")}</p>
                        <p className="mt-1 text-sm font-medium text-neutral-800">{localizedArtwork.year}</p>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">{t("dimensions")}</p>
                        <p className="mt-1 text-sm font-medium text-neutral-800">{localizedArtwork.dimensions}</p>
                      </div>
                    </div>
                  ) : localizedArtwork.year ? (
                    <div className="px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">{t("year")}</p>
                      <p className="mt-1 text-sm font-medium text-neutral-800">{localizedArtwork.year}</p>
                    </div>
                  ) : localizedArtwork.dimensions ? (
                    <div className="px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">{t("dimensions")}</p>
                      <p className="mt-1 text-sm font-medium text-neutral-800">{localizedArtwork.dimensions}</p>
                    </div>
                  ) : null}

                  {localizedArtwork.materials ? (
                    <div className={`px-4 py-3${(localizedArtwork.year || localizedArtwork.dimensions) ? " border-t border-black/[0.05]" : ""}`}>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">{t("materials")}</p>
                      <p className="mt-1 text-sm font-medium leading-6 text-neutral-800">{localizedArtwork.materials}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* Description */}
              {localizedArtwork.description ? (
                <div className="mt-8 min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-400">
                    {t("description")}
                  </p>
                  <p className="mt-3 text-base leading-8 text-neutral-600 md:text-[17px]">
                    {localizedArtwork.description}
                  </p>
                </div>
              ) : null}

              {/* Secondary CTA */}
              <div className="mt-10 border-t border-black/[0.06] pt-7">
                <Button asChild variant="outline" size="default" className="w-full sm:w-auto">
                  <Link href={customCreationHref}>
                    {t("cta.requestSimilar")}
                  </Link>
                </Button>
              </div>

            </aside>
          </div>
        </Container>
      </main>
    </>
  );
}