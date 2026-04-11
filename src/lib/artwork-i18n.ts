import type { Artwork } from "@/types/artwork";

export type ArtworkLocale = "fr" | "en" | "es";

type LocalizedField = {
  fr?: string | null;
  en?: string | null;
  es?: string | null;
};

export function getLocalizedValue(
  field: LocalizedField,
  locale: string
): string {
  if (locale === "es") {
    return field.es?.trim() || field.fr?.trim() || field.en?.trim() || "";
  }

  if (locale === "en") {
    return field.en?.trim() || field.fr?.trim() || field.es?.trim() || "";
  }

  return field.fr?.trim() || field.en?.trim() || field.es?.trim() || "";
}

export function localizeArtwork(artwork: Artwork, locale: string) {
  return {
    ...artwork,
    title: getLocalizedValue(
      {
        fr: artwork.title,
        en: artwork.title_en,
        es: artwork.title_es,
      },
      locale
    ),
    subtitle: getLocalizedValue(
      {
        fr: artwork.subtitle,
        en: artwork.subtitle_en,
        es: artwork.subtitle_es,
      },
      locale
    ),
    description: getLocalizedValue(
      {
        fr: artwork.description,
        en: artwork.description_en,
        es: artwork.description_es,
      },
      locale
    ),
    category: getLocalizedValue(
      {
        fr: artwork.category,
        en: artwork.category_en,
        es: artwork.category_es,
      },
      locale
    ),
    materials: getLocalizedValue(
      {
        fr: artwork.materials,
        en: artwork.materials_en,
        es: artwork.materials_es,
      },
      locale
    ),
    availability: getLocalizedValue(
      {
        fr: artwork.availability,
        en: artwork.availability_en,
        es: artwork.availability_es,
      },
      locale
    ),
  };
}