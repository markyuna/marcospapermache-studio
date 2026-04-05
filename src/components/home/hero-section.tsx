"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-24 pt-28 md:pb-32 md:pt-36 xl:pb-36 xl:pt-44">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.14),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(255,190,120,0.16),transparent_26%),linear-gradient(to_bottom,#fffaf5,#fff5ed,#fffaf5)]" />

      <Container className="relative">
        <div className="grid items-center gap-16 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="mb-5 text-[11px] uppercase tracking-[0.42em] text-[#a77446] md:text-xs">
              Marcos Papermache · Art contemporain
            </p>

            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-[#181512] md:text-7xl xl:text-[6.4rem]">
              La matière devient forme,
              <br />
              l’idée devient sculpture.
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-[#5f5348] md:text-lg">
              Un univers où l’artisanat, la présence sculpturale et la création
              assistée par IA se rencontrent pour donner naissance à des œuvres
              sensibles, contemporaines et sur mesure.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff6a00] px-6 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(255,106,0,0.22)] transition hover:scale-[1.02] hover:bg-[#eb6100]"
              >
                Créer avec IA
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/sculptures"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-6 py-3 text-sm font-medium text-[#181512] transition hover:bg-white"
              >
                Voir les sculptures
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              {["Pièces uniques", "Sur mesure", "Expérience artistique"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-black/5 bg-white/65 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#7a6654] backdrop-blur-sm"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -left-6 top-8 hidden h-40 w-40 rounded-full bg-[#ff6a00]/10 blur-3xl lg:block" />
            <div className="absolute -bottom-8 right-0 hidden h-48 w-48 rounded-full bg-[#ffd7b0]/30 blur-3xl lg:block" />

            <div className="relative rounded-[2.2rem] border border-black/5 bg-gradient-to-br from-[#fffaf5] via-[#f8ecdf] to-[#ead8c4] p-4 shadow-[0_40px_100px_rgba(180,120,60,0.18)]">
              <div className="overflow-hidden rounded-[1.8rem] border border-white/60 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.8),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.4),rgba(255,255,255,0.1))] p-5 md:p-6">
                <div className="aspect-[4/5] rounded-[1.5rem] border border-[#d8b08b]/20 bg-[linear-gradient(145deg,#fffdf9,#f2e4d4)] p-5 md:p-6">
                  <div className="relative flex h-full items-end overflow-hidden rounded-[1.2rem] border border-[#d8b08b]/15 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_34%),linear-gradient(to_bottom,#f9f1e7,#ecdfd1)] p-6">
                    <div className="absolute left-1/2 top-[18%] h-52 w-52 -translate-x-1/2 rounded-full border border-[#d9b38c]/20 bg-white/35 blur-sm" />
                    <div className="absolute bottom-10 left-10 h-32 w-24 rounded-full bg-white/45 blur-[2px]" />
                    <div className="absolute bottom-14 left-[42%] h-48 w-32 -translate-x-1/2 rounded-[45%] bg-gradient-to-b from-[#fff9f4] to-[#d7b191]/30 shadow-[0_18px_80px_rgba(196,120,48,0.12)]" />
                    <div className="absolute bottom-8 right-10 h-28 w-28 rotate-12 rounded-[30%] border border-[#d6a56d]/25 bg-[#ffb36b]/15 blur-[1px]" />

                    <div className="relative z-10 max-w-xs">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-[#a48a73]">
                        Pièce signature
                      </p>
                      <h2 className="mt-3 text-2xl font-medium text-[#181512]">
                        Présence organique
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-[#5f5348]">
                        Une direction artistique sculpturale, minimaliste et
                        contemporaine pensée comme une présence silencieuse dans
                        l’espace.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl border border-black/5 bg-white/60 px-4 py-3 backdrop-blur-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#a48a73]">
                      Univers
                    </p>
                    <p className="mt-1 text-sm text-[#181512]">
                      Organique · contemporain · sur mesure
                    </p>
                  </div>

                  <div className="h-10 w-10 rounded-full border border-[#ff6a00]/15 bg-gradient-to-br from-[#fff4ea] to-[#f3e8dc]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}