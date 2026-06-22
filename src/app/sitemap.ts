import type { MetadataRoute } from "next";

import { getArtworks } from "@/lib/artworks";
import { siteConfig } from "@/lib/seo";

type RouteConfig = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const staticRoutes: RouteConfig[] = [
  { path: "",                      changeFrequency: "weekly",  priority: 1.0  },
  { path: "/sculptures",           changeFrequency: "weekly",  priority: 0.9  },
  { path: "/creations-sur-mesure", changeFrequency: "monthly", priority: 0.85 },
  { path: "/artiste-papier-mache", changeFrequency: "monthly", priority: 0.8  },
  { path: "/commande",             changeFrequency: "monthly", priority: 0.75 },
  { path: "/about",                changeFrequency: "monthly", priority: 0.7  },
  { path: "/contact",              changeFrequency: "yearly",  priority: 0.6  },
  { path: "/create",               changeFrequency: "yearly",  priority: 0.5  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = siteConfig.locales.flatMap((locale) =>
    staticRoutes.map(({ path, changeFrequency, priority }) => ({
      url: `${siteConfig.domain}/${locale}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
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
        changeFrequency: "monthly" as const,
        priority: artwork.is_featured ? 0.85 : 0.75,
      }))
    );
  } catch (error) {
    console.error("Erreur lors de la génération du sitemap:", error);
  }

  return [...staticUrls, ...artworkUrls];
}
