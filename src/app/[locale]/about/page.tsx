// src/app/[locale]/about/page.tsx
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  const values = [
    {
      title: t("values.items.0.title"),
      text: t("values.items.0.text"),
    },
    {
      title: t("values.items.1.title"),
      text: t("values.items.1.text"),
    },
    {
      title: t("values.items.2.title"),
      text: t("values.items.2.text"),
    },
  ];

  return (
    <main className="relative overflow-hidden bg-[linear-gradient(to_bottom,#f7f2ec_0%,#f4eee7_35%,#faf7f3_100%)] text-[#1b1713]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.08),transparent_24%),radial-gradient(circle_at_85%_10%,rgba(255,190,120,0.10),transparent_22%)]" />

      <section className="relative overflow-hidden">
  <div className="relative h-[72vh] min-h-[620px] w-full">

    {/* IMAGEN BACKGROUND */}
    <Image
      src="/marcos.png"
      alt={t("hero.imageAlt")}
      fill
      priority
      className="object-cover object-right"
    />

    {/* OVERLAY PARA OSCURECER LADO IZQUIERDO */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#f7f2ec]/95 via-[#f7f2ec]/70 to-transparent" />

    {/* CONTENIDO */}
    <Container className="relative z-10 flex h-full items-center">
      <div className="max-w-[560px] text-left">

        <div className="inline-flex rounded-full border border-[#e7d8ca] bg-white/70 px-4 py-2 backdrop-blur-sm">
          <span className="text-[10px] uppercase tracking-[0.34em] text-[#9e744d] md:text-[11px]">
            {t("hero.badge")}
          </span>
        </div>

        <h1 className="mt-6 text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#8b6947] md:text-6xl xl:text-7xl">
          {t("hero.title")}
        </h1>

        <p className="mt-6 max-w-[480px] text-base leading-8 text-[#6d5b4d] md:text-lg">
          {t("hero.description")}
        </p>

      </div>
    </Container>

    {/* TRANSICIÓN ABAJO */}
    <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(120%_100%_at_50%_0%,transparent_48%,#f4efe9_49%)] md:h-32" />

  </div>
</section>


      <section className="relative py-24 md:py-32">
        <Container className="grid items-center gap-14 lg:grid-cols-[1fr_0.95fr] lg:gap-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-[#e7d8ca] bg-white/70 px-4 py-2 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.34em] text-[#ae7b53] md:text-[11px]">
                {t("approach.badge")}
              </p>
            </div>

            <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#8b6947] md:text-6xl">
              {t("approach.title")}
            </h2>

            <div className="mt-8 space-y-6 text-lg leading-9 text-[#5f544a]">
              <p>{t("approach.paragraphs.0")}</p>
              <p>{t("approach.paragraphs.1")}</p>
              <p>{t("approach.paragraphs.2")}</p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute -inset-6 rounded-[3rem] bg-[radial-gradient(circle_at_30%_20%,rgba(255,180,110,0.18),transparent_42%),radial-gradient(circle_at_80%_70%,rgba(255,210,160,0.18),transparent_36%)] blur-2xl" />

            <div className="relative overflow-hidden rounded-[38%_62%_58%_42%/34%_36%_64%_66%] border border-white/60 bg-white/60 shadow-[0_30px_100px_rgba(86,57,29,0.14)] backdrop-blur-sm">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/support_vin.png"
                  alt={t("approach.imageAlt")}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/18 via-transparent to-white/10" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative pb-24 md:pb-32">
        <Container>
          <div className="rounded-[2.5rem] border border-[#eadccf] bg-white/70 p-8 shadow-[0_25px_90px_rgba(75,48,22,0.08)] backdrop-blur-sm md:p-10 xl:p-14">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-[#ecdccf] bg-[#fffaf5] px-4 py-2">
                <p className="text-[10px] uppercase tracking-[0.34em] text-[#b07a52] md:text-[11px]">
                  {t("values.badge")}
                </p>
              </div>

              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#1b1713] md:text-5xl">
                {t("values.title")}
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-[#6c5d50] md:text-lg">
                {t("values.description")}
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {values.map((value) => (
                <article
                  key={value.title}
                  className="rounded-[2rem] border border-[#efe2d6] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,248,242,0.82))] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(140,95,42,0.10)]"
                >
                  <div className="h-10 w-10 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffd5a8,#f4b06f)] opacity-80" />

                  <h3 className="mt-5 text-xl font-medium tracking-[-0.03em] text-[#1d1915]">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#6c5d50]">
                    {value.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="relative pb-24 md:pb-32">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-[#eadbcc] bg-[linear-gradient(135deg,#fffaf5_0%,#f7eee4_55%,#fefaf6_100%)] px-8 py-12 shadow-[0_25px_80px_rgba(80,50,22,0.08)] md:px-12 md:py-14">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#ffb36b]/15 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#ffd8ae]/20 blur-3xl" />

            <div className="relative grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div className="max-w-xl">
                <div className="inline-flex items-center rounded-full border border-[#ecdccf] bg-white/70 px-4 py-2 backdrop-blur-sm">
                  <p className="text-[10px] uppercase tracking-[0.34em] text-[#b07a52] md:text-[11px]">
                    {t("interiors.badge")}
                  </p>
                </div>

                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#1b1713] md:text-5xl">
                  {t("interiors.title")}
                </h2>

                <p className="mt-5 text-base leading-8 text-[#6c5d50] md:text-lg">
                  {t("interiors.description1")}
                </p>

                <p className="mt-4 text-base leading-8 text-[#6c5d50] md:text-lg">
                  {t("interiors.description2")}
                </p>

                <Link
                  href="/commande"
                  className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-[#e6d4c2] bg-white/85 px-5 py-3 text-sm font-medium text-[#4f4338] shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ff6a00]/30 hover:text-[#c65400]"
                >
                  {t("interiors.cta")}
                  <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid grid-cols-12 gap-4 md:gap-5">
                <article className="group relative col-span-6 overflow-hidden rounded-[1.8rem] border border-white/60 bg-white/50 shadow-[0_16px_40px_rgba(0,0,0,0.06)] backdrop-blur-sm">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src="/home3.jpg"
                      alt={t("interiors.images.livingRoomAlt")}
                      fill
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/30 via-transparent to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#8f6846] backdrop-blur-md">
                      {t("interiors.images.livingRoomLabel")}
                    </div>
                  </div>
                </article>

                <article className="group relative col-span-6 overflow-hidden rounded-[1.8rem] border border-white/60 bg-white/50 shadow-[0_16px_40px_rgba(0,0,0,0.06)] backdrop-blur-sm md:mt-10">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src="/home2.jpg"
                      alt={t("interiors.images.wallAlt")}
                      fill
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/30 via-transparent to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#8f6846] backdrop-blur-md">
                      {t("interiors.images.wallLabel")}
                    </div>
                  </div>
                </article>

                <article className="group relative col-span-12 overflow-hidden rounded-[2rem] border border-white/60 bg-white/50 shadow-[0_18px_45px_rgba(0,0,0,0.06)] backdrop-blur-sm">
                  <div className="relative aspect-[16/7]">
                    <Image
                      src="/home1.jpg"
                      alt={t("interiors.images.contemporaryAlt")}
                      fill
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/35 via-transparent to-transparent" />

                    <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#8f6846] backdrop-blur-md">
                      {t("interiors.images.contemporaryLabel")}
                    </div>

                    <div className="absolute inset-x-5 bottom-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                      <div className="max-w-lg">
                        <p className="text-sm font-medium text-white/95 md:text-base">
                          {t("interiors.images.quote")}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}