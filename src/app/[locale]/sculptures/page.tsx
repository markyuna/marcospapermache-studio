// src/app/[locale]/sculptures/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import Gallery from "@/components/sculptures/Gallery";
import { Container } from "@/components/layout/container";
import { getArtworks } from "@/lib/artworks";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SculpturesPage" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function SculpturesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SculpturesPage" });
  const artworks = await getArtworks();

  return (
    <main className="bg-[#f8f5ef] text-neutral-900">
      <section className="relative isolate overflow-hidden">
        <div className="relative h-[42vh] min-h-[320px] w-full md:h-[50vh] md:min-h-[420px]">
          <Image
            src="/banniere.png"
            alt={t("bannerAlt")}
            fill
            priority
            className="object-cover object-[center_28%] md:object-[center_32%] scale-[1.03]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-[#f8f5ef]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#f8f5ef] md:h-32" />

          <div className="absolute inset-0 flex items-end">
            <Container className="pb-10 md:pb-14">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.38em] text-white/70 md:text-xs">
                  {t("eyebrow")}
                </p>

                <div className="mt-4 h-px w-14 bg-white/40 md:mt-5" />

                <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-white md:mt-5 md:text-6xl xl:text-7xl">
                  {t("title")}
                </h1>
              </div>
            </Container>
          </div>
        </div>
      </section>

      <section className="relative -mt-2 py-14 md:-mt-4 md:py-20">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 flex flex-col gap-4 border-t border-black/10 pt-8 md:mb-12 md:pt-10">
              <div className="max-w-2xl">
                <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-400">
                  {t("collectionLabel")}
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-neutral-900 md:text-3xl">
                  {t("collectionTitle")}
                </h2>
              </div>
            </div>
          </div>

          <Gallery artworks={artworks} />
        </Container>
      </section>
    </main>
  );
}