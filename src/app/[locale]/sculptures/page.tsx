import type { Metadata } from "next";
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
    <main className="bg-[#f8f5ef] py-24 md:py-32">
      <Container>
        <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">
          {t("eyebrow")}
        </p>

        <h1 className="mt-4 text-4xl font-semibold text-neutral-900 md:text-6xl">
          {t("title")}
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-500">
          {t("description")}
        </p>

        <div className="mt-16">
          <Gallery artworks={artworks} />
        </div>
      </Container>
    </main>
  );
}