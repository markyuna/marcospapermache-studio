// src/components/home/FeaturedSection.tsx

import { ArrowRight, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FeaturedCardsGrid } from "@/components/home/FeaturedCardsGrid";
import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";
import { getArtworksBySlugs } from "@/lib/artworks";

export async function FeaturedSection() {
  const t = await getTranslations("Featured");
  const tGallery = await getTranslations("Gallery");

  const featuredLampSlugs = [
    "eveil-lumineux",
    "ondulation-lumineuse",
    "lampe-totem",
  ];

  const featuredSculptures = await getArtworksBySlugs(featuredLampSlugs);

  return (
    <section className="relative overflow-hidden py-24 md:py-32 xl:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.08),transparent_25%),radial-gradient(circle_at_85%_12%,rgba(255,190,120,0.13),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(180,130,80,0.10),transparent_28%),linear-gradient(to_bottom,var(--paper-base),var(--paper-surface),var(--paper-base))]" />

      <div className="pointer-events-none absolute -left-28 top-24 h-80 w-80 rounded-full bg-[#f1d5b7]/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-20 h-96 w-96 rounded-full bg-[#ffb15f]/10 blur-3xl" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff6a00]/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ff6a00]/10 to-transparent" />

      <Container className="relative z-10">
        <div className="mb-14 flex flex-col gap-8 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ead9cb] bg-white/78 px-4 py-2 shadow-[0_10px_30px_rgba(70,48,24,0.04)] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#c8873f]" />
              <p className="text-[10px] uppercase tracking-[0.34em] text-[#b07a52] md:text-[11px]">
                {t("badge")}
              </p>
            </div>

            <h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.06em] md:text-5xl xl:text-6xl">
              <span className="block bg-linear-to-r from-[#181512] via-[#8a633d] to-[#ff8a2a] bg-clip-text text-transparent">
                {t("title")}
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#6c5d50] md:text-lg">
              {t("description")}
            </p>
          </div>

          <Link
            href="/sculptures"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-[#e7d5c5] bg-white/82 px-5 py-3 text-sm font-medium text-[#4f4338] shadow-[0_14px_40px_rgba(65,38,14,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ff6a00]/30 hover:bg-white hover:text-[#c65400]"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <FeaturedCardsGrid
          cards={featuredSculptures
            .map((artwork, index) => {
              const coverImage =
                artwork.images.find((image) => image.is_cover)?.image_url ??
                artwork.images[0]?.image_url;

              if (!coverImage) return null;

              return {
                slug: artwork.slug,
                title: artwork.title,
                subtitle: artwork.subtitle,
                image: coverImage,
                availability: artwork.availability,
                index,
                discoverLabel: t("discover"),
                soldLabel: tGallery("sold"),
              };
            })
            .filter((card) => card !== null)}
        />
      </Container>
    </section>
  );
}