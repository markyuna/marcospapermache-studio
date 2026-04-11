// src/components/about/AboutArtist.tsx
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";

export default function AboutArtist() {
  const t = useTranslations("AboutArtist");

  return (
    <section className="relative overflow-hidden bg-[#f7f2ec] py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,176,123,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(154,107,71,0.08),transparent_32%)]" />

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="relative">
            <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-[#ead8c5]/70 blur-3xl" />
            <div className="absolute -bottom-8 right-0 h-36 w-36 rounded-full bg-[#d8b07b]/25 blur-3xl" />

            <div className="group relative overflow-hidden rounded-[2rem] border border-black/5 bg-[#ece4da] shadow-[0_30px_100px_rgba(24,21,18,0.10)]">
              <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black/50 via-black/12 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

              <Image
                src="/images/about/about-artist-process.jpg"
                alt={t("imageAlt")}
                width={1200}
                height={1500}
                priority
                className="h-[520px] w-full object-cover object-center transition duration-700 group-hover:scale-[1.02] md:h-[680px]"
              />

              <div className="absolute bottom-0 left-0 z-20 p-6 md:p-8">
                <p className="max-w-xs text-sm font-light italic tracking-[0.02em] text-white/90 md:text-base">
                  “{t("quote")}”
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.34em] text-[#9a6b47]">
              {t("badge")}
            </p>

            <h2 className="mt-5 text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-[#181512] md:text-5xl lg:text-6xl">
              {t("title")}
            </h2>

            <div className="mt-8 space-y-6 text-base leading-8 text-[#5f5348] md:text-lg">
              <p>{t("paragraph1")}</p>
              <p>{t("paragraph2")}</p>
            </div>

            <div className="mt-10">
              <Link
                href="/sculptures"
                className="inline-flex items-center gap-3 rounded-full border border-[#1a1a1a]/10 bg-white px-6 py-3 text-sm font-medium text-[#181512] shadow-[0_12px_30px_rgba(24,21,18,0.08)] transition hover:-translate-y-0.5 hover:border-[#9a6b47]/30 hover:text-[#9a6b47]"
              >
                {t("cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}