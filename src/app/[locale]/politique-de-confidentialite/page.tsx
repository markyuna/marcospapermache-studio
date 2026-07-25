// src/app/[locale]/politique-de-confidentialite/page.tsx

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import JsonLd from "@/components/seo/JsonLd";
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
    namespace: "Legal.confidentialite.metadata",
  });

  return createMetadata({
    title: t("title"),
    description: t("description"),
    path: `/${locale}/politique-de-confidentialite`,
    locale,
  });
}

export default async function PolitiqueDeConfidentialitePage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Legal.confidentialite" });
  const tLastUpdated = await getTranslations({ locale, namespace: "Legal" });

  const pageUrl = `${siteConfig.domain}/${locale}/politique-de-confidentialite`;

  const donneesCollecteesList = t.raw("donneesCollectees.list") as string[];
  const finalitesList = t.raw("finalites.list") as string[];
  const destinatairesList = t.raw("destinataires.list") as string[];

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
                    {t("responsable.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("responsable.beforeEmail")}
                    <a
                      href="mailto:contact@marcospapermache.com"
                      className="text-[#a56b32] underline underline-offset-2 transition hover:text-[#8b5a29]"
                    >
                      {t("responsable.emailLabel")}
                    </a>
                    {t("responsable.afterEmail")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("donneesCollectees.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("donneesCollectees.intro")}
                  </p>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-8 text-[#6c5d50]">
                    {donneesCollecteesList.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("finalites.heading")}
                  </h2>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-8 text-[#6c5d50]">
                    {finalitesList.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("destinataires.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("destinataires.intro")}
                  </p>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-8 text-[#6c5d50]">
                    {destinatairesList.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("transferts.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("transferts.text")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("conservation.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("conservation.text")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("droits.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("droits.beforeEmail")}
                    <a
                      href="mailto:contact@marcospapermache.com"
                      className="text-[#a56b32] underline underline-offset-2 transition hover:text-[#8b5a29]"
                    >
                      {t("droits.emailLabel")}
                    </a>
                    {t("droits.betweenEmailAndCnil")}
                    <a
                      href="https://www.cnil.fr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#a56b32] underline underline-offset-2 transition hover:text-[#8b5a29]"
                    >
                      {t("droits.cnilLabel")}
                    </a>
                    {t("droits.afterCnil")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("cookies.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("cookies.text")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("mineurs.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("mineurs.text")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("securite.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("securite.text")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1713]">
                    {t("modifications.heading")}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6c5d50]">
                    {t("modifications.text")}
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
