// src/components/home/FeaturedSection.tsx

import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";
import { getArtworksBySlugs } from "@/lib/artworks";

type SculptureCardProps = {
  slug: string;
  title: string;
  subtitle?: string | null;
  image: string;
  availability?: string | null;
  index: number;
  discoverLabel: string;
  soldLabel: string;
};

function SculptureCard({
  slug,
  title,
  subtitle,
  image,
  availability,
  index,
  discoverLabel,
  soldLabel,
}: SculptureCardProps) {
  const normalizedAvailability = availability?.toLowerCase() ?? "";

  const isSold =
    normalizedAvailability.includes("vendue") ||
    normalizedAvailability.includes("vendido") ||
    normalizedAvailability.includes("sold");

  return (
    <Link
      href={`/sculptures/${slug}`}
      className="group relative block overflow-hidden rounded-[2.4rem] bg-white/62 p-3 shadow-[0_24px_80px_rgba(70,45,22,0.08)] ring-1 ring-[#eadfce]/70 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/82 hover:shadow-[0_34px_100px_rgba(120,75,32,0.15)] hover:ring-[#ff8a2a]/25 md:p-4"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2.4rem] bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,0.95),transparent_30%),radial-gradient(circle_at_82%_0%,rgba(255,138,42,0.13),transparent_28%),linear-gradient(145deg,rgba(255,250,246,0.85),rgba(248,238,227,0.72))]" />

      <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#ff8a2a]/45 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="relative overflow-hidden rounded-[2rem] bg-[#f7efe5] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.65)]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
            priority={index === 0}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/48 via-[#181512]/5 to-white/5 transition duration-500 group-hover:from-[#181512]/38" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,transparent_0%,transparent_45%,rgba(24,21,18,0.25)_100%)]" />

          <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/82 text-xs font-medium text-[#9c6e47] shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md md:left-5 md:top-5">
            {String(index + 1).padStart(2, "0")}
          </div>

          {isSold && (
            <div className="absolute right-4 top-4 rounded-full border border-white/30 bg-[#181512]/76 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white shadow-sm backdrop-blur-md md:right-5 md:top-5">
              {soldLabel}
            </div>
          )}

          <div className="absolute inset-x-4 bottom-4 rounded-[1.45rem] border border-white/25 bg-white/16 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-md transition duration-500 group-hover:bg-white/22 md:inset-x-5 md:bottom-5 md:p-5">
            {subtitle && (
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/78">
                {subtitle}
              </p>
            )}

            <h3 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white md:text-[1.7rem]">
              {title}
            </h3>

            {availability && !isSold && (
              <p className="mt-2 line-clamp-1 text-sm leading-6 text-white/78">
                {availability}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 px-3 pb-4 pt-5 md:px-4 md:pb-5 md:pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#b08a67]">
              Papier mâché
            </p>

            <p className="mt-1 text-sm leading-6 text-[#6c5d50]">
              Sculpture lumineuse artisanale
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ead9cb] bg-white text-[#7a5a40] shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition duration-300 group-hover:border-[#ff8a2a]/35 group-hover:bg-[#fff7ef] group-hover:text-[#c65400]">
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#7a5a40] transition duration-300 group-hover:text-[#c65400]">
          {discoverLabel}
          <span className="h-px w-8 bg-current opacity-35 transition-all duration-300 group-hover:w-12" />
        </span>
      </div>
    </Link>
  );
}

export async function FeaturedSection() {
  const t = await getTranslations("Featured");

  const featuredLampSlugs = [
    "eveil-lumineux",
    "ondulation-lumineuse",
    "lampe-totem",
  ];

  const featuredSculptures = await getArtworksBySlugs(featuredLampSlugs);

  return (
    <section className="relative overflow-hidden py-24 md:py-32 xl:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.08),transparent_25%),radial-gradient(circle_at_85%_12%,rgba(255,190,120,0.13),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(180,130,80,0.10),transparent_28%),linear-gradient(to_bottom,#fffaf6,#fff5ec,#fffaf6)]" />

      <div className="pointer-events-none absolute -left-28 top-24 h-80 w-80 rounded-full bg-[#f1d5b7]/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-20 h-96 w-96 rounded-full bg-[#ffb15f]/10 blur-3xl" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff6a00]/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ff6a00]/10 to-transparent" />

      <Container className="relative z-10">
        <div className="mb-14 flex flex-col gap-8 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ead9cb] bg-white/78 px-4 py-2 shadow-[0_10px_30px_rgba(70,48,24,0.04)] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#c8873f]" />
              <p className="text-[10px] uppercase tracking-[0.34em] text-[#b07a52] md:text-[11px]">
                {t("badge")}
              </p>
            </div>

            <h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.06em] md:text-5xl xl:text-6xl">
              <span className="block bg-linear-to-r from-[#181512] via-[#8a633d] to-[#ff8a2a] bg-clip-text text-transparent">
                {t("title")}
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#6c5d50] md:text-lg">
              {t("description")}
            </p>
          </div>

          <Link
            href="/sculptures"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-[#e7d5c5] bg-white/82 px-5 py-3 text-sm font-medium text-[#4f4338] shadow-[0_14px_40px_rgba(65,38,14,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ff6a00]/30 hover:bg-white hover:text-[#c65400]"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {featuredSculptures.map((artwork, index) => {
            const coverImage =
              artwork.images.find((image) => image.is_cover)?.image_url ??
              artwork.images[0]?.image_url;

            if (!coverImage) return null;

            return (
              <SculptureCard
                key={artwork.slug}
                slug={artwork.slug}
                title={artwork.title}
                subtitle={artwork.subtitle}
                image={coverImage}
                availability={artwork.availability}
                index={index}
                discoverLabel={t("discover")}
                soldLabel={t("sold")}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}