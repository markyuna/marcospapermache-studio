import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
      className="group relative overflow-hidden rounded-[2rem] border border-black/5 bg-white/72 p-5 shadow-[0_20px_70px_rgba(60,35,10,0.06)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-[#ff6a00]/10 hover:bg-white/90 hover:shadow-[0_28px_80px_rgba(180,120,60,0.12)] md:p-6"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#ff6a00]/30 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-[#ff6a00]/10 bg-[linear-gradient(145deg,#fffaf5_0%,#f8eee3_45%,#eddcc9_100%)]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
          priority={index === 0}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/30 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />

        <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/78 text-xs font-medium text-[#9c6e47] shadow-sm backdrop-blur-md">
          {String(index + 1).padStart(2, "0")}
        </div>

        {isSold && (
          <div className="absolute right-5 top-5 rounded-full border border-white/30 bg-[#181512]/72 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white shadow-sm backdrop-blur-md">
            {soldLabel}
          </div>
        )}
      </div>

      <div className="mt-6">
        {subtitle && (
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#b08a67]">
            {subtitle}
          </p>
        )}

        <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em] text-[#181512] transition duration-300 group-hover:text-[#c65400]">
          {title}
        </h3>

        {availability && !isSold && (
          <p className="mt-3 text-sm leading-6 text-[#6c5d50]">{availability}</p>
        )}

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#7a5a40] transition duration-300 group-hover:text-[#c65400]">
          {discoverLabel}
          <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
        </div>
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
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.08),transparent_24%),radial-gradient(circle_at_85%_18%,rgba(255,190,120,0.10),transparent_22%),linear-gradient(to_bottom,#fffaf6,#fff6ef,#fffaf6)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff6a00]/20 to-transparent" />

      <Container className="relative z-10">
        <div className="mb-14 flex flex-col gap-8 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-[#ead9cb] bg-white/75 px-4 py-2 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.34em] text-[#b07a52] md:text-[11px]">
                {t("badge")}
              </p>
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#1b1713] md:text-5xl xl:text-6xl">
              {t("title")}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#6c5d50] md:text-lg">
              {t("description")}
            </p>
          </div>

          <Link
            href="/sculptures"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-[#e7d5c5] bg-white/82 px-5 py-3 text-sm font-medium text-[#4f4338] shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ff6a00]/30 hover:text-[#c65400]"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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