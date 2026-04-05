"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";

export function HeroSection() {
  return (
<section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 xl:pt-40 xl:pb-32">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_32%),linear-gradient(to_bottom,#151515,#080808)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_30%,transparent_70%,rgba(255,255,255,0.02))]" />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            <p className="mb-5 text-[11px] uppercase tracking-[0.42em] text-[#d6c28d] md:text-xs">
              Marcos Papermache · Art contemporain
            </p>

            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.96] tracking-[-0.04em] text-white md:text-7xl xl:text-[6.5rem]">
              La matière devient forme,
              <br />
              l’idée devient sculpture.
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-neutral-300 md:text-lg">
              Un univers sculptural où l’artisanat, la sensibilité contemporaine
              et l’intelligence artificielle se rencontrent pour donner vie à
              des œuvres uniques et à des créations sur mesure.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
              >
                Créer avec IA
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/sculptures"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/5"
              >
                Voir les sculptures
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              {["Pièces uniques", "Commandes sur mesure", "Expérience IA"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.22em] text-neutral-300"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.12, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -left-8 top-10 hidden h-40 w-40 rounded-full bg-white/10 blur-3xl lg:block" />
            <div className="absolute -bottom-10 right-0 hidden h-48 w-48 rounded-full bg-[#d6c28d]/10 blur-3xl lg:block" />

            <div className="relative rounded-[2rem] border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-4 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
              <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-5 md:p-6">
                <div className="aspect-[4/5] rounded-[1.4rem] border border-white/10 bg-[linear-gradient(145deg,#1f1f1f,#0a0a0a)] p-5 md:p-6">
                  <div className="relative flex h-full items-end overflow-hidden rounded-[1.1rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_30%),linear-gradient(to_bottom,#111111,#050505)] p-6">
                    <div className="absolute left-1/2 top-[18%] h-52 w-52 -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.03] blur-sm" />
                    <div className="absolute bottom-10 left-10 h-32 w-24 rounded-full bg-white/[0.06] blur-[2px]" />
                    <div className="absolute bottom-14 left-[42%] h-48 w-32 -translate-x-1/2 rounded-[45%] bg-gradient-to-b from-neutral-200/20 to-neutral-400/5 shadow-[0_18px_80px_rgba(255,255,255,0.05)]" />
                    <div className="absolute bottom-8 right-10 h-28 w-28 rounded-[30%] rotate-12 border border-[#d6c28d]/20 bg-[#d6c28d]/10 blur-[1px]" />

                    <div className="relative z-10 max-w-xs">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">
                        Pièce signature
                      </p>
                      <h2 className="mt-3 text-2xl font-medium text-white">
                        Présence organique
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-neutral-300">
                        Une direction artistique sculpturale, minimaliste et
                        contemporaine pensée comme une présence dans l’espace.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">
                      Univers
                    </p>
                    <p className="mt-1 text-sm text-white">
                      Luxe minimal · organique · sur mesure
                    </p>
                  </div>

                  <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}