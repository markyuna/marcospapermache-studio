import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
      <Container className="relative grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-6 text-xs uppercase tracking-[0.38em] text-neutral-400">
            Art contemporain · Papier mâché · IA
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] text-white md:text-7xl">
            Des sculptures premium entre matière, imagination et technologie.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-300">
            Découvrez des œuvres sculpturales uniques et imaginez votre propre
            création grâce à une expérience assistée par intelligence
            artificielle.
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
        </div>

        <div className="relative">
          <div className="aspect-[4/5] rounded-[2rem] border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 p-6 shadow-2xl">
            <div className="flex h-full items-end rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-neutral-400">
                  Pièce signature
                </p>
                <h2 className="mt-3 text-2xl font-medium text-white">
                  Fusion organique
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-7 text-neutral-300">
                  Un univers sculptural minimaliste, contemporain et poétique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}