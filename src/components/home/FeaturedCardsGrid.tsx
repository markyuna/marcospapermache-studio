"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { Link } from "@/i18n/navigation";
import { isSoldAvailability } from "@/lib/availability";
import { SoldBadge } from "@/components/sculptures/SoldBadge";

export type FeaturedCardData = {
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
}: FeaturedCardData) {
  const isSold = isSoldAvailability(availability);

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
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
            priority={index === 0}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/48 via-[#181512]/5 to-white/5 transition duration-500 group-hover:from-[#181512]/38" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,transparent_0%,transparent_45%,rgba(24,21,18,0.25)_100%)]" />

          <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/82 text-xs font-medium text-[#9c6e47] shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md md:left-5 md:top-5">
            {String(index + 1).padStart(2, "0")}
          </div>

          {isSold ? (
            <div className="absolute right-4 top-4 md:right-5 md:top-5">
              <SoldBadge label={soldLabel} />
            </div>
          ) : null}

          <div className="absolute inset-x-4 bottom-4 rounded-[1.45rem] border border-white/25 bg-white/16 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-md transition duration-500 group-hover:bg-white/22 md:inset-x-5 md:bottom-5 md:p-5">
            {subtitle ? (
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/78">
                {subtitle}
              </p>
            ) : null}
            <h3 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white md:text-[1.7rem]">
              {title}
            </h3>
            {availability && !isSold ? (
              <p className="mt-2 line-clamp-1 text-sm leading-6 text-white/78">
                {availability}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative z-10 px-3 pb-4 pt-5 md:px-4 md:pb-5 md:pt-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-[#7a5a40] transition duration-300 group-hover:text-[#c65400]">
            {discoverLabel}
            <span className="ml-2 inline-block h-px w-8 translate-y-[-2px] bg-current opacity-35 transition-all duration-300 group-hover:w-12" />
          </span>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ead9cb] bg-white text-[#7a5a40] shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition duration-300 group-hover:border-[#ff8a2a]/35 group-hover:bg-[#fff7ef] group-hover:text-[#c65400]">
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedCardsGrid({ cards }: { cards: FeaturedCardData[] }) {
  return (
    <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.slug}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.65,
            delay: i * 0.13,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <SculptureCard {...card} />
        </motion.div>
      ))}
    </div>
  );
}
