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
  { path: "/expositions",          changeFrequency: "monthly", priority: 0.4  },
  { path: "/mentions-legales",              changeFrequency: "yearly",  priority: 0.2  },
  { path: "/politique-de-confidentialite",  changeFrequency: "yearly",  priority: 0.2  },
];

export const revalidate = 300;

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

  let artworks;

  try {
    artworks = await getArtworks();
  } catch (error) {
    console.error(
      "[sitemap] Échec du chargement des œuvres depuis Supabase — sitemap non régénéré, l'ancienne version reste servie:",
      error
    );
    throw error;
  }

  const artworkUrls: MetadataRoute.Sitemap = siteConfig.locales.flatMap((locale) =>
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

  return [...staticUrls, ...artworkUrls];
}
