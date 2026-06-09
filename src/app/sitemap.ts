// src/app/sitemap.ts

import type { MetadataRoute } from "next";

import { getArtworks } from "@/lib/artworks";
import { siteConfig } from "@/lib/seo";

const staticRoutes = [
  "",
  "/about",
  "/sculptures",
  "/creations-sur-mesure",
  "/commande",
  "/create",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = siteConfig.locales.flatMap(
    (locale) =>
      staticRoutes.map((route) => ({
        url: `${siteConfig.domain}/${locale}${route}`,
        lastModified: now,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : route === "/sculptures" ? 0.9 : 0.7,
      }))
  );

  let artworkUrls: MetadataRoute.Sitemap = [];

  try {
    const artworks = await getArtworks();

    artworkUrls = siteConfig.locales.flatMap((locale) =>
      artworks.map((artwork) => ({
        url: `${siteConfig.domain}/${locale}/sculptures/${artwork.slug}`,
        lastModified: artwork.updated_at
          ? new Date(artwork.updated_at)
          : artwork.created_at
            ? new Date(artwork.created_at)
            : now,
        changeFrequency: "monthly",
        priority: artwork.is_featured ? 0.85 : 0.75,
      }))
    );
  } catch (error) {
    console.error("Erreur lors de la génération du sitemap:", error);
  }

  return [...staticUrls, ...artworkUrls];
}