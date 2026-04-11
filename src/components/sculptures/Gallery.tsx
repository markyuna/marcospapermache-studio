"use client";

import { useLocale, useTranslations } from "next-intl";

import type { Artwork } from "@/types/artwork";
import { localizeArtwork } from "@/lib/artwork-i18n";
import SculptureCard from "@/components/sculptures/SculptureCard";

type GalleryProps = {
  artworks: Artwork[];
};

function getCoverImage(artwork: Artwork) {
  return (
    artwork.images.find((image) => image.is_cover) ??
    artwork.images[0] ??
    null
  );
}

export default function Gallery({ artworks }: GalleryProps) {
  const t = useTranslations("Gallery");
  const locale = useLocale();

  if (!artworks.length) {
    return (
      <div className="rounded-[30px] border border-black/5 bg-white/70 p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
        <p className="text-lg text-neutral-600">{t("emptyTitle")}</p>
        <p className="mt-2 text-sm text-neutral-400">
          {t("emptyDescription")}
        </p>
      </div>
    );
  }

  const localizedArtworks = artworks.map((artwork) =>
    localizeArtwork(artwork, locale)
  );

  return (
    <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {localizedArtworks.map((artwork) => {
        const cover = getCoverImage(artwork);

        return (
          <SculptureCard
            key={artwork.id}
            slug={artwork.slug}
            src={cover?.image_url ?? ""}
            imageAlt={cover?.alt_text || artwork.title}
            title={artwork.title}
            category={artwork.category}
            subtitle={artwork.subtitle}
            description={artwork.description}
            dimensions={artwork.dimensions}
            year={artwork.year}
            availability={artwork.availability}
            hasImage={Boolean(cover?.image_url)}
          />
        );
      })}
    </div>
  );
}