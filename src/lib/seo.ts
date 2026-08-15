// src/lib/seo.ts

import type { Metadata } from "next";

export const siteConfig = {
  name: "Marcos Paper Mâché",
  legalName: "Marcos Paper Mâché Studio",
  domain: "https://www.marcospapermache.com",
  defaultLocale: "fr",
  locales: ["fr", "en", "es"] as const,
  creator: "Marcos Suarez",
  instagram: "https://www.instagram.com/marcospapermache",
  defaultOgImage: "/images/og/marcospapermache-og.webp",
  logo: "/images/logo.png",
  description:
    "Atelier d’art contemporain en papier mâché. Sculptures uniques, œuvres murales et créations sur mesure façonnées à la main.",
};

type SeoParams = {
  title: string;
  description?: string;
  path?: string;
  locale?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

function cleanPath(path: string) {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

function getLocalizedPath(path: string) {
  return cleanPath(path).replace(/^\/(fr|en|es)/, "");
}

export function getAbsoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http")) return pathOrUrl;

  const safePath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;

  return `${siteConfig.domain}${safePath}`;
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "",
  locale = siteConfig.defaultLocale,
  image = siteConfig.defaultOgImage,
  type = "website",
  noIndex = false,
}: SeoParams): Metadata {
  const safePath = cleanPath(path);
  const localizedPath = getLocalizedPath(safePath);
  const url = `${siteConfig.domain}${safePath}`;
  const imageUrl = getAbsoluteUrl(image);

  return {
    metadataBase: new URL(siteConfig.domain),

    title,

    description,

    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    publisher: siteConfig.name,

    alternates: {
      canonical: url,
      languages: {
        fr: `${siteConfig.domain}/fr${localizedPath}`,
        en: `${siteConfig.domain}/en${localizedPath}`,
        es: `${siteConfig.domain}/es${localizedPath}`,
      },
    },

    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },

    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}