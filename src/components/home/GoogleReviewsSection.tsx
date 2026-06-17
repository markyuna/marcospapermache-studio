// src/components/home/GoogleReviewsSection.tsx

"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Quote, Star } from "lucide-react";

const googleReviewsUrl = "https://share.google/dhHfwS0J5xfDQAcoz";

const reviews = [
  {
    name: "MARIO VENTURA",
    initials: "MV",
    meta: "3 avis · 1 photo",
    text: "Je suis très content de ma commande que j’ai faite sur mesure chez MarkPepperMaché ! Le travail est signé, original, et on sent vraiment la passion derrière chaque création. C’est un artiste à découvrir absolument. Je recommande vivement !",
    date: "Juin 2025",
    rating: 5,
  },
  {
    name: "Samia SAM",
    initials: "SS",
    meta: "Local Guide · 19 avis",
    text: "J’ai commandé une sculpture chez MarkPepperMaché et je suis absolument ravie ! Marcos me l’a réalisée sur mesure et le résultat était tout simplement magnifique. C’est un véritable artiste, talentueux et à l’écoute. Tout est fabriqué à partir de matériaux recyclés et écologiques, ce qui rend son travail encore plus admirable. Je recommande vivement !",
    date: "Juin 2025",
    rating: 5,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} étoiles`}>
      {Array.from({ length: rating }).map((_, index) => (
        <Star
          key={index}
          className="h-4 w-4 fill-[#c8873f] text-[#c8873f]"
        />
      ))}
    </div>
  );
}

export default function GoogleReviewsSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f7f0e6] px-6 py-24 text-neutral-950 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(200,135,63,0.18),transparent_32%),radial-gradient(circle_at_85%_35%,rgba(255,168,94,0.13),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0))]" />

      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#d9c7ac]/70 bg-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#9b6a35] shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c8873f]" />
              Avis Google
            </div>

            <h2 className="max-w-3xl bg-gradient-to-br from-[#181512] via-[#9b5f2f] to-[#e7a85f] bg-clip-text text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-transparent md:text-6xl">
                Ils parlent de mon atelier
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-neutral-700 md:text-lg">
              Des retours authentiques autour de créations façonnées à la main,
              pensées comme des pièces uniques et sensibles.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="lg:ml-auto lg:max-w-xl"
          >
            <div className="rounded-[2rem] border border-[#e5d7c3]/80 bg-white/62 p-5 shadow-[0_24px_70px_rgba(24,21,18,0.07)] backdrop-blur md:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-semibold tracking-[-0.05em] text-[#181512]">
                      5.0
                    </span>

                    <div>
                      <Stars rating={5} />
                      <p className="mt-1 text-xs text-neutral-500">
                        Avis clients publiés sur Google
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href={googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#c8873f]/30 bg-white px-5 py-3 text-sm font-semibold text-[#181512] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#c8873f]/60 hover:bg-[#fffaf4] hover:shadow-[0_18px_45px_rgba(24,21,18,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8873f] focus-visible:ring-offset-2"
                >
                  Voir tous les avis
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {reviews.map((review, index) => (
            <motion.article
              key={`${review.name}-${index}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="group relative overflow-hidden rounded-[2.25rem] border border-[#e4d6c1]/85 bg-white/72 p-6 shadow-[0_28px_90px_rgba(24,21,18,0.075)] backdrop-blur transition duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_34px_110px_rgba(24,21,18,0.11)] md:p-8"
            >
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#c8873f]/40 to-transparent" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#e9a35f]/10 blur-3xl transition duration-500 group-hover:bg-[#e9a35f]/18" />

              <div className="mb-8 flex items-start justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-13 w-13 items-center justify-center rounded-full border border-[#eadfce] bg-[#f8f0e6] text-sm font-semibold text-[#9b6a35] shadow-inner">
                    {review.initials}
                  </div>

                  <div>
                    <p className="text-sm font-semibold tracking-[-0.01em] text-[#181512]">
                      {review.name}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {review.meta}
                    </p>

                    <div className="mt-3">
                      <Stars rating={review.rating} />
                    </div>
                  </div>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f7f0e6] text-[#9b6a35] ring-1 ring-[#eadfce]">
                  <Quote className="h-4 w-4" />
                </div>
              </div>

              <p className="text-[15px] leading-8 text-neutral-700 md:text-base md:leading-8">
                “{review.text}”
              </p>

              <div className="mt-8 flex items-center justify-between border-t border-[#eadfce] pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                  Avis Google
                </p>

                <p className="text-xs font-medium text-neutral-500">
                  {review.date}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}