// src/data/exhibitions.ts

export type Exhibition = {
  id: string;
  year: number;
  /** Default title, used as-is when `titleKey` is not set (proper names — identical across locales). */
  title: string;
  /** When set, looks up `Exhibitions.events.<titleKey>.title` in next-intl instead of `title`. */
  titleKey?: string;
  venue?: string;
  address: string;
  /** When set, looks up `Exhibitions.countries.<countryKey>` in next-intl and appends it to the address. */
  countryKey?: "switzerland";
  startDate: string;
  endDate: string;
  /** Carousel images, in display order. */
  images: string[];
  /** Proper names of featured works (shown as badges) — identical across locales. */
  artworks?: string[];
};

export const exhibitions: Exhibition[] = [
  {
    id: "swiss-art-expo-zurich-2025",
    year: 2025,
    title: "Swiss Art Expo — Artbox Project Zürich 7.0",
    address: "Zürich",
    countryKey: "switzerland",
    startDate: "2025-08-20",
    endDate: "2025-08-24",
    images: [
      "/expo/ArtworkPhoto_ÉlanOrganique.webp",
      "/expo/ArtworkPhoto_GardiendelaForêt.webp",
    ],
    artworks: ["Élan Organique", "Gardien de la Forêt"],
  },
  {
    id: "galerie-thuillier-paris-2024",
    year: 2024,
    title: "Exposición vídeo",
    titleKey: "parisVideoExhibition",
    venue: "Galerie Thuillier",
    address: "13 Rue de Thorigny, Paris",
    startDate: "2024-04-26",
    endDate: "2024-05-09",
    images: ["/expo/expo_paris.png"],
  },
];
