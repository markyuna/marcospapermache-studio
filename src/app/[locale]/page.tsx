// src/app/[locale]/page.tsx

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { CtaSection } from "@/components/home/cta-section";
import { FeaturedSection } from "@/components/home/featured-section";
import GoogleReviewsSection from "@/components/home/GoogleReviewsSection";
import { HeroSection } from "@/components/home/hero-section";
import { ProcessSection } from "@/components/home/process-section";
import { createMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createMetadata({
    title: "Sculptures artisanales en papier mâché",
    description:
      "Découvrez l’univers de Marcos Paper Mâché : sculptures contemporaines, œuvres lumineuses et créations sur mesure façonnées à la main en papier mâché.",
    path: `/${locale}`,
    locale,
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
        <GoogleReviewsSection />
        <CtaSection />
      </div>
    </>
  );
}