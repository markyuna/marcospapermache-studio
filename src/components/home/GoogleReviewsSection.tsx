// src/components/home/GoogleReviewsSection.tsx

"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Quote, Star } from "lucide-react";
import { useTranslations } from "next-intl";

const googleReviewsUrl = "https://share.google/dhHfwS0J5xfDQAcoz";

type GoogleReview = {
  name: string;
  initials: string;
  meta: string;
  text: string;
  date: string;
  rating: number;
};

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={label}>
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-[#c8873f] text-[#c8873f]" />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  source,
  starsLabel,
}: {
  review: GoogleReview;
  source: string;
  starsLabel: string;
}) {
  return (
    <article className="group relative flex w-[300px] shrink-0 flex-col overflow-hidden rounded-[1.75rem] border border-[#e4d6c1]/90 bg-white/72 p-5 shadow-[0_12px_40px_rgba(24,21,18,0.055)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/92 hover:shadow-[0_20px_55px_rgba(24,21,18,0.09)]">
      {/* Top shine */}
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#c8873f]/30 to-transparent" />
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#e9a35f]/8 blur-2xl transition duration-500 group-hover:bg-[#e9a35f]/14" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#eadfce] bg-[#f8f0e6] text-[11px] font-semibold text-[#9b6a35]">
            {review.initials}
          </div>
          <div>
            <p className="text-sm font-semibold leading-none text-[#181512]">
              {review.name}
            </p>
            <p className="mt-1 text-[11px] text-neutral-400">{review.meta}</p>
          </div>
        </div>

        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f7f0e6] text-[#c8873f] ring-1 ring-[#eadfce]">
          <Quote className="h-3 w-3" />
        </div>
      </div>

      {/* Stars */}
      <div className="mt-3.5">
        <Stars rating={review.rating} label={starsLabel} />
      </div>

      {/* Text */}
      <p className="mt-3 flex-1 text-[13px] leading-7 text-neutral-600">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-[#eadfce] pt-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
          {source}
        </p>
        <p className="text-[11px] text-neutral-400">{review.date}</p>
      </div>
    </article>
  );
}

export default function GoogleReviewsSection() {
  const t = useTranslations("GoogleReviews");
  const reviews = t.raw("reviews") as GoogleReview[];

  return (
    <section className="relative isolate overflow-hidden bg-paper-surface py-24 text-neutral-950 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(200,135,63,0.15),transparent_32%),radial-gradient(circle_at_85%_35%,rgba(255,168,94,0.10),transparent_34%)]" />
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-white/30 blur-3xl" />

      {/* Header */}
      <div className="relative mx-auto mb-12 max-w-7xl px-6 md:mb-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#d9c7ac]/70 bg-white/55 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9b6a35] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c8873f]" />
              {t("badge")}
            </div>

            <h2 className="max-w-2xl bg-gradient-to-br from-[#181512] via-[#9b5f2f] to-[#e7a85f] bg-clip-text text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-transparent md:text-5xl">
              {t("title")}
            </h2>

            <p className="mt-4 max-w-lg text-base leading-8 text-neutral-600">
              {t("description")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col items-start gap-4 lg:items-end"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl font-semibold tracking-[-0.05em] text-[#181512]">
                5.0
              </span>
              <div>
                <Stars rating={5} label={t("starsAria", { rating: 5 })} />
                <p className="mt-1 text-xs text-neutral-500">
                  {t("ratingLabel")}
                </p>
              </div>
            </div>

            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#c8873f]/30 bg-white px-4 py-2.5 text-sm font-semibold text-[#181512] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#c8873f]/60 hover:bg-[#fffaf4] hover:shadow-[0_14px_35px_rgba(24,21,18,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8873f]/50"
            >
              {t("button")}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Marquee */}
      <div className="group relative overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#f7f0e6] to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#f7f0e6] to-transparent" />

        {/* Track — duplicated for seamless loop, pauses on group hover */}
        <div
          className="animate-marquee group-hover:[animation-play-state:paused] flex gap-4 py-4"
          style={{ width: "max-content" }}
        >
          {[...reviews, ...reviews].map((review, index) => (
            <ReviewCard
              key={`${review.name}-${index}`}
              review={review}
              source={t("source")}
              starsLabel={t("starsAria", { rating: review.rating })}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
