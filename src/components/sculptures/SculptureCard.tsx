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
    return "border-[#ead8bc] bg-[#f6efe2] text-[#6d533b]";
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
      <article className="relative flex h-full flex-col overflow-hidden rounded-[30px] border border-black/5 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-sm transition duration-500 hover:-translate-y-1.5 hover:border-[#ff6a00]/10 hover:shadow-[0_26px_80px_rgba(15,23,42,0.11)]">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#ff8a1f]/30 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

        <div className="relative aspect-[4/5] overflow-hidden bg-[#efe8dc]">
          {hasImage && src ? (
            <>
              <Image
                src={src}
                alt={imageAlt || title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612]/18 via-transparent to-transparent transition duration-500 group-hover:from-[#1a1612]/26" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-neutral-400">
              {t("imageUnavailable")}
            </div>
          )}

          {availability ? (
            <div className="absolute left-4 top-4">
              <span
                className={clsx(
                  "rounded-full border px-3 py-1 text-[11px] font-medium backdrop-blur-md",
                  getAvailabilityStyle(availability)
                )}
              >
                {availability}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="min-h-[116px]">
            <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">
              {category || t("defaultCategory")}
            </p>

            <h2 className="mt-3 line-clamp-2 text-[1.38rem] font-medium leading-[1.1] tracking-[-0.02em] text-neutral-900 transition duration-300 group-hover:text-[#be5a08]">
              {title}
            </h2>

            <div className="mt-2 min-h-[40px]">
              {subtitle ? (
                <p className="line-clamp-2 text-sm text-neutral-500">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-4 min-h-[24px]">
            {(dimensions || year) ? (
              <p className="text-sm text-neutral-500">
                {[dimensions, year].filter(Boolean).join(" • ")}
              </p>
            ) : null}
          </div>

          <div className="mt-4 flex-1">
            {description ? (
              <p className="line-clamp-4 text-sm leading-7 text-neutral-600">
                {description}
              </p>
            ) : null}
          </div>

          <div className="mt-5 pt-4">
            <span className="inline-flex items-center text-sm font-medium text-[#c45e09] transition duration-300 group-hover:translate-x-0.5">
              {t("discover")}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}