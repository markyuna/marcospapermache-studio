//src/app/[locale]/sculptures/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import SculptureImageGallery from "@/components/sculptures/SculptureImageGallery";
import { localizeArtwork } from "@/lib/artwork-i18n";
import { getArtworkBySlug } from "@/lib/artworks";

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
    <main className="relative overflow-hidden bg-[linear-gradient(to_bottom,#fcfaf6,#f7f2ea,#fbf8f3)] py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,191,163,0.14),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(255,106,0,0.08),transparent_20%)]" />

      <Container className="relative z-10">
        <div className="grid gap-14 lg:grid-cols-[1.06fr_0.94fr] xl:gap-20">
          <div>
            {localizedArtwork.images.length > 0 ? (
              <SculptureImageGallery
                images={localizedArtwork.images}
                title={localizedArtwork.title}
              />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center rounded-[32px] border border-black/[0.04] bg-white/75 text-neutral-400 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
                {t("noImage")}
              </div>
            )}
          </div>

          <aside className="h-fit lg:sticky lg:top-28">
            <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-400">
              {localizedArtwork.category || t("fallbackCategory")}
            </p>

            <h1 className="mt-4 text-4xl font-medium tracking-[-0.045em] text-[#181512] md:text-5xl xl:text-[3.4rem]">
              {localizedArtwork.title}
            </h1>

            {localizedArtwork.subtitle ? (
              <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-500 md:text-xl">
                {localizedArtwork.subtitle}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {localizedArtwork.availability ? (
                <span className="rounded-full border border-[#eadcc8] bg-[#f3ece2] px-4 py-2 text-sm font-medium text-[#5c4632]">
                  {localizedArtwork.availability}
                </span>
              ) : null}

              {localizedArtwork.year ? (
                <span className="rounded-full border border-black/5 bg-white/75 px-4 py-2 text-sm text-neutral-600 backdrop-blur-sm">
                  {localizedArtwork.year}
                </span>
              ) : null}
            </div>

            {(localizedArtwork.dimensions || localizedArtwork.materials) ? (
              <div className="mt-8 space-y-5 rounded-[28px] border border-black/[0.04] bg-white/72 p-6 shadow-[0_16px_45px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                {localizedArtwork.dimensions ? (
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-400">
                      {t("dimensions")}
                    </p>
                    <p className="mt-2 text-base text-neutral-700">
                      {localizedArtwork.dimensions}
                    </p>
                  </div>
                ) : null}

                {localizedArtwork.materials ? (
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-400">
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
                <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-400">
                  {t("description")}
                </p>
                <p className="mt-4 text-lg leading-8 text-neutral-600">
                  {localizedArtwork.description}
                </p>
              </div>
            ) : null}

            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild variant="default" size="lg">
                <Link href={`/${locale}/contact`}>{t("cta.request")}</Link>
              </Button>

              {localizedArtwork.etsy_url ? (
                <Button asChild variant="outline" size="lg">
                  <Link
                    href={localizedArtwork.etsy_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("cta.etsy")}
                  </Link>
                </Button>
              ) : null}
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}