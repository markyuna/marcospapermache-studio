// src/app/[locale]/expositions/page.tsx

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import JsonLd from "@/components/seo/JsonLd";
import ExhibitionCarousel from "@/components/ExhibitionCarousel";
import { exhibitions, type Exhibition } from "@/data/exhibitions";
import { createMetadata, siteConfig } from "@/lib/seo";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "Exhibitions.metadata" });

  return createMetadata({
    title: t("title"),
    description: t("description"),
    path: `/${locale}/expositions`,
    locale,
  });
}

function formatDateRange(startISO: string, endISO: string, locale: string) {
  const start = new Date(`${startISO}T00:00:00`);
  const end = new Date(`${endISO}T00:00:00`);
  const sameMonthYear =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

  const fullFmt = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (sameMonthYear) {
    const dayFmt = new Intl.DateTimeFormat(locale, { day: "numeric" });
    return `${dayFmt.format(start)} – ${fullFmt.format(end)}`;
  }

  const startFmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" });
  return `${startFmt.format(start)} – ${fullFmt.format(end)}`;
}

const sortedExhibitions = [...exhibitions].sort((a, b) => b.year - a.year);

export default async function ExhibitionsPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Exhibitions" });
  const tEvents = await getTranslations({ locale, namespace: "Exhibitions.events" });
  const tCountries = await getTranslations({ locale, namespace: "Exhibitions.countries" });

  const pageUrl = `${siteConfig.domain}/${locale}/expositions`;

  const exhibitionsPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    name: t("metadata.title"),
    description: t("metadata.description"),
    url: pageUrl,
    inLanguage: locale,
    isPartOf: {
      "@id": `${siteConfig.domain}/${locale}#website`,
    },
  };

  function resolveTitle(exhibition: Exhibition) {
    return exhibition.titleKey ? tEvents(`${exhibition.titleKey}.title`) : exhibition.title;
  }

  function resolveLocation(exhibition: Exhibition) {
    const base = exhibition.venue ? `${exhibition.venue} — ${exhibition.address}` : exhibition.address;
    return exhibition.countryKey ? `${base}, ${tCountries(exhibition.countryKey)}` : base;
  }

  return (
    <>
      <JsonLd data={exhibitionsPageJsonLd} />

      <main className="bg-paper-base text-espresso">
        <section className="pb-16 pt-32 md:pb-20 md:pt-40">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full border border-[color:var(--stroke-strong)] bg-paper-surface px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-brand-gold">
                {t("hero.eyebrow")}
              </span>

              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-espresso md:text-6xl">
                {t("hero.title")}
              </h1>

              <p className="mt-5 text-base leading-8 text-[color:var(--muted)] md:text-lg">
                {t("hero.subtitle")}
              </p>
            </div>
          </Container>
        </section>

        <section className="pb-24 md:pb-32">
          <Container>
            <div className="mx-auto max-w-3xl space-y-20 md:space-y-28">
              {sortedExhibitions.map((exhibition) => {
                const title = resolveTitle(exhibition);
                const carouselImages = exhibition.images.map((src, index) => ({
                  src,
                  alt: exhibition.artworks?.[index] ?? title,
                }));

                return (
                  <article key={exhibition.id} className="flex flex-col gap-4">
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
                      {exhibition.year}
                    </span>

                    <h3 className="text-2xl font-semibold tracking-[-0.02em] text-espresso md:text-3xl">
                      {title}
                    </h3>

                    <div>
                      <p className="text-sm leading-6 text-[color:var(--muted)]">
                        {resolveLocation(exhibition)}
                      </p>
                      <p className="text-sm leading-6 text-[color:var(--muted)]">
                        {formatDateRange(exhibition.startDate, exhibition.endDate, locale)}
                      </p>
                    </div>

                    {exhibition.artworks && exhibition.artworks.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exhibition.artworks.map((name) => (
                          <span
                            key={name}
                            className="inline-flex items-center rounded-full border border-[color:var(--stroke-strong)] bg-paper-base px-3 py-1.5 text-xs font-medium text-brand-gold"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}

                    <ExhibitionCarousel
                      images={carouselImages}
                      className="mt-2"
                      dotLabels={carouselImages.map((_, index) =>
                        t("carousel.goToImage", { index: index + 1 })
                      )}
                    />
                  </article>
                );
              })}
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
