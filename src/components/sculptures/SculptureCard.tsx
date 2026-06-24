"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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
    return "border-[#d9c4a5]/80 bg-[#f3ece2]/90 text-[#7a5235]";
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
  dimensions,
  year,
  availability,
  hasImage = true,
}: SculptureCardProps) {
  const t = useTranslations("Gallery");

  return (
    <Link href={`/sculptures/${slug}`} className="group block h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-[20px] border border-black/[0.06] bg-white/82 shadow-[0_8px_32px_rgba(0,0,0,0.055)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#c8873f]/18 hover:shadow-[0_24px_64px_rgba(0,0,0,0.10)]">
        {/* Top shine on hover */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#d9c4a5]/55 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#ede6da]">
          {hasImage && src ? (
            <>
              <Image
                src={src}
                alt={imageAlt || title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612]/20 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
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
                  "rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-[0.06em] backdrop-blur-md",
                  getAvailabilityStyle(availability)
                )}
              >
                {availability}
              </span>
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-3.5">
          <p className="text-[9px] uppercase tracking-[0.28em] text-neutral-400">
            {category || t("defaultCategory")}
          </p>

          <h2 className="mt-1.5 line-clamp-2 text-[0.9rem] font-semibold leading-[1.2] tracking-[-0.02em] text-neutral-900 transition duration-300 group-hover:text-[#8b4d1a]">
            {title}
          </h2>

          {subtitle ? (
            <p className="mt-1 line-clamp-1 text-[11px] leading-[1.5] text-neutral-500">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-auto flex items-center justify-between border-t border-black/[0.06] pt-3">
            {dimensions || year ? (
              <p className="text-[10px] text-neutral-400">
                {[dimensions, year].filter(Boolean).join(" · ")}
              </p>
            ) : (
              <p className="text-[10px] font-medium text-[#9b6a35]">
                {t("discover")}
              </p>
            )}

            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f3ece4] text-[#9b6a35] ring-1 ring-[#e4d6c1]/60 transition-all duration-300 group-hover:bg-[linear-gradient(135deg,#ff9f43,#e76f16,#c85100)] group-hover:text-white group-hover:ring-transparent group-hover:shadow-[0_6px_20px_rgba(200,112,56,0.35)]">
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
