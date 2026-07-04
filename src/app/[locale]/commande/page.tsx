// src/app/[locale]/commande/page.tsx

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import CommandeForm from "@/components/forms/CommandeForm";
import { Container } from "@/components/layout/container";
import JsonLd from "@/components/seo/JsonLd";
import { getAuthenticatedUser } from "@/lib/admin-auth";
import { routing } from "@/i18n/routing";
import { createMetadata, getAbsoluteUrl, siteConfig } from "@/lib/seo";
import { supabaseAdmin } from "@/lib/supabase";

type CommandePageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    prompt?: string;
    sourceAiImageId?: string;
  }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: CommandePageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "CommandePage",
  });

  return createMetadata({
    title: t("title"),
    description: t("description"),
    path: `/${locale}/commande`,
    locale,
    image: siteConfig.defaultOgImage,
  });
}

export default async function CommandePage({
  params,
  searchParams,
}: CommandePageProps) {
  const { locale } = await params;
  const { prompt = "", sourceAiImageId = "" } = await searchParams;

  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: "CommandePage",
  });

  const user = await getAuthenticatedUser();

  let defaultName = "";
  let defaultEmail = user?.email ?? "";

  if (user) {
    const { data: previousCommande } = await supabaseAdmin
      .from("commandes")
      .select("name, email")
      .eq("supabase_user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (previousCommande) {
      defaultName = previousCommande.name ?? "";
      defaultEmail = previousCommande.email ?? defaultEmail;
    }
  }

  const pageUrl = `${siteConfig.domain}/${locale}/commande`;

  const commandePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: t("title"),
    description: t("description"),
    url: pageUrl,
    image: getAbsoluteUrl(siteConfig.defaultOgImage),
    inLanguage: locale,
    isPartOf: {
      "@id": `${siteConfig.domain}/${locale}#website`,
    },
    about: {
      "@id": `${pageUrl}#custom-sculpture-service`,
    },
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#custom-sculpture-service`,
    name: "Création de sculpture personnalisée en papier mâché",
    description:
      "Service de création sur mesure pour commander une sculpture artisanale en papier mâché, une œuvre murale, un objet sculptural ou une pièce lumineuse personnalisée.",
    serviceType: "Création artistique sur mesure",
    provider: {
      "@type": "Person",
      "@id": `${siteConfig.domain}/${locale}#artist`,
      name: siteConfig.creator,
      url: siteConfig.domain,
      sameAs: [siteConfig.instagram],
    },
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: pageUrl,
      availableLanguage: ["fr", "en", "es"],
    },
    url: pageUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: siteConfig.name,
        item: `${siteConfig.domain}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("badge"),
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={commandePageJsonLd} />
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f4eadf_0%,#f7efe7_24%,#fbf7f2_58%,#f8f1e8_100%)] py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(205,164,124,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.65),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(205,164,124,0.08),transparent_30%)]" />

        <Container className="relative max-w-6xl">
          <div className="mx-auto max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d9c7b4] bg-white/70 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.32em] text-[#8f7762] shadow-[0_8px_30px_rgba(24,21,18,0.04)] backdrop-blur-sm">
              {t("badge")}
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-[#181512] md:text-6xl">
              {t("title")}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#6f6257] md:text-xl">
              {t("description")}
            </p>

            <div className="mt-10 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-[#dfcfbf] bg-white/65 px-4 py-2 text-[#6b5f55] shadow-[0_10px_30px_rgba(24,21,18,0.04)] backdrop-blur-sm">
                {t("highlights.fast")}
              </span>
              <span className="rounded-full border border-[#dfcfbf] bg-white/65 px-4 py-2 text-[#6b5f55] shadow-[0_10px_30px_rgba(24,21,18,0.04)] backdrop-blur-sm">
                {t("highlights.custom")}
              </span>
              <span className="rounded-full border border-[#dfcfbf] bg-white/65 px-4 py-2 text-[#6b5f55] shadow-[0_10px_30px_rgba(24,21,18,0.04)] backdrop-blur-sm">
                {t("highlights.noCommitment")}
              </span>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <CommandeForm
              defaultPrompt={prompt}
              sourceAiImageId={sourceAiImageId}
              defaultName={defaultName}
              defaultEmail={defaultEmail}
            />
          </div>
        </Container>
      </section>
    </>
  );
}