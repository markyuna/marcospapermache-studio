import Link from "next/link";

import { Container } from "@/components/layout/container";

export function CtaSection() {
  return (
    <section className="pb-24 pt-10 md:pb-32">
      <Container>
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 md:p-12">
          <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">
            Expérience premium
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold text-white md:text-5xl">
            Donnez forme à une idée et transformez-la en œuvre sculpturale.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300">
            Lancez l’expérience IA ou envoyez directement une demande de
            commande personnalisée.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/create"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              Créer avec IA
            </Link>
            <Link
              href="/commande"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Faire une commande
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}