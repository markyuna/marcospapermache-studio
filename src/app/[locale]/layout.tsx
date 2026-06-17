// src/app/[locale]/layout.tsx

import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import ClarityInit from "@/components/analytics/ClarityInit";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import { routing } from "@/i18n/routing";
import { getAbsoluteUrl, siteConfig } from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL(siteConfig.domain),

    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        en: "/en",
        es: "/es",
      },
    },

    openGraph: {
      siteName: siteConfig.name,
      locale,
      type: "website",
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      images: [siteConfig.defaultOgImage],
    },

    robots: {
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

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.domain}/${locale}#website`,
    name: siteConfig.name,
    alternateName: siteConfig.legalName,
    url: `${siteConfig.domain}/${locale}`,
    inLanguage: locale,
    description: siteConfig.description,
    image: getAbsoluteUrl(siteConfig.defaultOgImage),
    publisher: {
      "@id": `${siteConfig.domain}/${locale}#artist`,
    },
  };

  const artistJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.domain}/${locale}#artist`,
    name: siteConfig.creator,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    jobTitle: "Artiste sculpteur en papier mâché",
    description:
      "Artiste créateur de sculptures contemporaines, œuvres murales et créations sur mesure en papier mâché.",
    url: `${siteConfig.domain}/${locale}`,
    image: getAbsoluteUrl(siteConfig.defaultOgImage),
    sameAs: [siteConfig.instagram],
    knowsAbout: [
      "Papier mâché",
      "Sculpture artisanale",
      "Art contemporain",
      "Œuvre murale",
      "Création sur mesure",
      "Décoration artistique",
    ],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.domain}/${locale}#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: `${siteConfig.domain}/${locale}`,
    logo: getAbsoluteUrl(siteConfig.logo),
    image: getAbsoluteUrl(siteConfig.defaultOgImage),
    founder: {
      "@id": `${siteConfig.domain}/${locale}#artist`,
    },
    sameAs: [siteConfig.instagram],
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ClarityInit />

      <JsonLd data={websiteJsonLd} />
      <JsonLd data={artistJsonLd} />
      <JsonLd data={organizationJsonLd} />

      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}