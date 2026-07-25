// src/app/[locale]/mentions-legales/page.tsx

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import JsonLd from "@/components/seo/JsonLd";
import { Link } from "@/i18n/navigation";
import { createMetadata, siteConfig } from "@/lib/seo";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "Legal.mentionsLegales.metadata",
  });

  return createMetadata({
    title: t("title"),
    description: t("description"),
    path: `/${locale}/mentions-legales`,
    locale,
  });
}

export default async function MentionsLegalesPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Legal.mentionsLegales" });
  const tLastUpdated = await getTranslations({ locale, namespace: "Legal" });

  const pageUrl = `${siteConfig.domain}/${locale}/mentions-legales`;

  const editeurList = t.raw("editeur.list") as string[];

  const lastUpdated = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const legalPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: t("metadata.title"),
    description: t("metadata.description"),
    url: pageUrl,
    inLanguage: locale,
    isPartOf: {
      "@id": `${siteConfig.domain}/${locale}#website`,
    },
  };

  return (
    <>
      <JsonLd data={legalPageJsonLd} />

      <main className="relative overflow-hidden bg-[linear-gradient(to_bottom,#f7f2ec_0%,#f4eee7_35%,#faf7f3_100%)] text-[#1b1713]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.06),transparent_24%)]" />

        <section className="relative pb-24 pt-32 md:pb-32 md:pt-40">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#8b6947] md:text-5xl">
                {t("title")}
              </h1>

              <div className="mt-12 space-y-10">
                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("editeur.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("editeur.intro")}
                  </p>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-8 text-[#6c5d50]">
                    {editeurList.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("directeur.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("directeur.text")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("hebergement.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("hebergement.text")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("propriete.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("propriete.text")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("liens.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("liens.text")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("donneesPersonnelles.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("donneesPersonnelles.beforeLink")}
                    <Link
                      href="/politique-de-confidentialite"
                      className="text-[#a56b32] underline underline-offset-2 transition hover:text-[#8b5a29]"
                    >
                      {t("donneesPersonnelles.linkLabel")}
                    </Link>
                    {t("donneesPersonnelles.afterLink")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("cookies.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("cookies.beforeLink")}
                    <Link
                      href="/politique-de-confidentialite"
                      className="text-[#a56b32] underline underline-offset-2 transition hover:text-[#8b5a29]"
                    >
                      {t("cookies.linkLabel")}
                    </Link>
                    {t("cookies.afterLink")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("droitApplicable.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("droitApplicable.text")}
                  </p>
                </section>
              </div>

              <p className="mt-14 border-t border-[#e1d3bf]/80 pt-6 text-sm text-[#9a8b7c]">
                {tLastUpdated("lastUpdated", { date: lastUpdated })}
              </p>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
