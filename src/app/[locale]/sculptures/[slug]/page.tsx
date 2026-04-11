import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { getArtworkBySlug } from "@/lib/artworks";
import { localizeArtwork } from "@/lib/artwork-i18n";
import SculptureImageGallery from "@/components/sculptures/SculptureImageGallery";

type SculptureDetailPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

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
    return {
      title: t("metadata.fallbackTitle"),
      description: t("metadata.fallbackDescription"),
    };
  }

  const localizedArtwork = localizeArtwork(artwork, locale);

  return {
    title: `${localizedArtwork.title} | Marcos Papermache`,
    description:
      localizedArtwork.description ||
      localizedArtwork.subtitle ||
      t("metadata.fallbackDescription"),
  };
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

  return (
    <main className="bg-[#f8f5ef] py-24 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] xl:gap-16">
          <div>
            {localizedArtwork.images.length > 0 ? (
              <SculptureImageGallery
                images={localizedArtwork.images}
                title={localizedArtwork.title}
              />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center rounded-[28px] bg-white text-neutral-400">
                {t("noImage")}
              </div>
            )}
          </div>

          <aside className="h-fit lg:sticky lg:top-28">
            <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">
              {localizedArtwork.category || t("fallbackCategory")}
            </p>

            <h1 className="mt-4 text-4xl font-semibold text-neutral-900 md:text-5xl">
              {localizedArtwork.title}
            </h1>

            {localizedArtwork.subtitle ? (
              <p className="mt-4 text-lg text-neutral-500 md:text-xl">
                {localizedArtwork.subtitle}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {localizedArtwork.availability ? (
                <span className="rounded-full bg-[#f3eadb] px-4 py-2 text-sm font-medium text-neutral-700">
                  {localizedArtwork.availability}
                </span>
              ) : null}

              {localizedArtwork.year ? (
                <span className="rounded-full border border-black/5 bg-white/80 px-4 py-2 text-sm text-neutral-600">
                  {localizedArtwork.year}
                </span>
              ) : null}
            </div>

            {(localizedArtwork.dimensions || localizedArtwork.materials) ? (
              <div className="mt-8 space-y-4 rounded-[24px] border border-black/5 bg-white/70 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.04)]">
                {localizedArtwork.dimensions ? (
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                      {t("dimensions")}
                    </p>
                    <p className="mt-2 text-base text-neutral-700">
                      {localizedArtwork.dimensions}
                    </p>
                  </div>
                ) : null}

                {localizedArtwork.materials ? (
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                      {t("materials")}
                    </p>
                    <p className="mt-2 text-base leading-7 text-neutral-700">
                      {localizedArtwork.materials}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {localizedArtwork.description ? (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                  {t("description")}
                </p>
                <p className="mt-4 text-lg leading-8 text-neutral-600">
                  {localizedArtwork.description}
                </p>
              </div>
            ) : null}

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-300 px-6 py-3 text-sm font-medium text-black shadow-[0_12px_30px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5"
              >
                {t("cta.request")}
              </Link>

              {localizedArtwork.etsy_url ? (
                <Link
                  href={localizedArtwork.etsy_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-6 py-3 text-sm font-medium text-neutral-800 transition hover:bg-white"
                >
                  {t("cta.etsy")}
                </Link>
              ) : null}
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}