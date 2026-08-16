// src/app/[locale]/page.tsx

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { CtaSection } from "@/components/home/cta-section";
import { FeaturedSection } from "@/components/home/featured-section";
import { HeroSection } from "@/components/home/hero-section";
import { ProcessSection } from "@/components/home/process-section";
import ReviewsSection from "@/components/home/ReviewsSection";
import { createMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

const homeSeo = {
  fr: {
    title: "Sculpture Artisanale en Papier Mâché | Marcos Suarez",
    description:
      "Marcos Suarez, sculpteur papier basé à Paris, crée des sculptures artisanales en papier mâché sur mesure, pièces uniques en matières recyclées.",
  },
  en: {
    title: "Handmade Paper Mâché Sculptures | Marcos Suarez, Paper Sculptor",
    description:
      "Marcos Suarez, Paris-based paper sculptor, creates custom handmade paper mâché sculptures — unique pieces made from recycled materials.",
  },
  es: {
    title: "Esculturas Artesanales de Papel Maché | Marcos Suarez",
    description:
      "Marcos Suarez, escultor de papel en París, crea esculturas artesanales de papel maché a medida. Piezas únicas hechas con materiales reciclados.",
  },
} as const;

type HomeLocaleKey = keyof typeof homeSeo;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = homeSeo[locale as HomeLocaleKey] ?? homeSeo.fr;

  return createMetadata({
    title: seo.title,
    description: seo.description,
    path: `/${locale}`,
    locale,
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <>
      <HeroSection />

      <div className="relative z-10">
        <FeaturedSection />
        <ProcessSection />
        <ReviewsSection />
        <CtaSection />
      </div>
    </>
  );
}