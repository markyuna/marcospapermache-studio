"use client";

import Image from "next/image";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

type SculptureCardProps = {
  slug: string;
  src: string;
  imageAlt?: string;
  title: string;
  category?: string | null;
  subtitle?: string | null;
  description?: string | null;
  dimensions?: string | null;
  year?: number | null;
  availability?: string | null;
  hasImage?: boolean;
};

function getAvailabilityStyle(availability?: string | null) {
  const normalized = availability?.toLowerCase().trim() ?? "";

  if (
    normalized.includes("vendue") ||
    normalized.includes("sold") ||
    normalized.includes("vendida")
  ) {
    return "border-neutral-900/80 bg-neutral-900 text-white";
  }

  if (
    normalized.includes("disponible") ||
    normalized.includes("available") ||
    normalized.includes("disponible por encargo") ||
    normalized.includes("sur demande") ||
    normalized.includes("on request") ||
    normalized.includes("por encargo")
  ) {
    return "border-[#eadcc8] bg-[#f3ece2] text-[#5c4632]";
  }

  return "border-black/10 bg-white/90 text-neutral-600";
}

export default function SculptureCard({
  slug,
  src,
  imageAlt,
  title,
  category,
  subtitle,
  description,
  dimensions,
  year,
  availability,
  hasImage = true,
}: SculptureCardProps) {
  const t = useTranslations("Gallery");

  return (
    <Link href={`/sculptures/${slug}`} className="group block h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-[26px] border border-black/[0.05] bg-white/85 shadow-[0_10px_34px_rgba(0,0,0,0.06)] backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:border-black/[0.07] hover:shadow-[0_16px_50px_rgba(0,0,0,0.08)]">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d9c4a5]/70 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

        <div className="relative aspect-[4/5] overflow-hidden bg-[#efe8dc]">
          {hasImage && src ? (
            <>
              <Image
                src={src}
                alt={imageAlt || title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612]/14 via-transparent to-transparent transition duration-500 group-hover:from-[#1a1612]/20" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-neutral-400">
              {t("imageUnavailable")}
            </div>
          )}

          {availability ? (
            <div className="absolute left-3 top-3">
              <span
                className={clsx(
                  "rounded-full border px-2.5 py-1 text-[10px] font-medium backdrop-blur-md sm:text-[11px]",
                  getAvailabilityStyle(availability)
                )}
              >
                {availability}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="min-h-[98px]">
            <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-400 sm:text-[11px]">
              {category || t("defaultCategory")}
            </p>

            <h2 className="mt-2.5 line-clamp-2 text-[1.15rem] font-medium leading-[1.12] tracking-[-0.02em] text-neutral-900 transition duration-300 group-hover:text-black sm:text-[1.26rem] xl:text-[1.18rem] 2xl:text-[1.24rem]">
              {title}
            </h2>

            <div className="mt-2 min-h-[36px]">
              {subtitle ? (
                <p className="line-clamp-2 text-[13px] leading-5 text-neutral-500 sm:text-sm">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-3 min-h-[22px]">
            {dimensions || year ? (
              <p className="text-[13px] text-neutral-500 sm:text-sm">
                {[dimensions, year].filter(Boolean).join(" • ")}
              </p>
            ) : null}
          </div>

          <div className="mt-3 flex-1">
            {description ? (
              <p className="line-clamp-3 text-[13px] leading-6 text-neutral-600 sm:text-sm sm:leading-6">
                {description}
              </p>
            ) : null}
          </div>

          <div className="mt-4 pt-3">
            <span className="inline-flex items-center text-sm font-medium text-[#6d533b] transition duration-300 group-hover:translate-x-0.5">
              {t("discover")}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}