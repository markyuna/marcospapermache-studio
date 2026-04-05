import Link from "next/link";

import { Container } from "@/components/layout/container";

export function CtaSection() {
  return (
    <section className="pb-24 pt-8 md:pb-32">
      <Container>
        <div className="rounded-[2.2rem] border border-black/5 bg-gradient-to-br from-[#fff8f2] via-[#fff1e5] to-[#efdeca] p-8 shadow-[0_25px_90px_rgba(255,106,0,0.10)] md:p-12">
          <p className="text-xs uppercase tracking-[0.32em] text-[#9a6b47]">
            Expérience premium
          </p>

          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-[#181512] md:text-5xl">
            Donnez forme à une idée et transformez-la en œuvre sculpturale.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f5348]">
            Lancez l’expérience IA ou envoyez directement une demande de
            création personnalisée pensée pour votre espace.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/create"
              className="rounded-full bg-[#ff6a00] px-6 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(255,106,0,0.2)] transition hover:scale-[1.02] hover:bg-[#eb6100]"
            >
              Créer avec IA
            </Link>

            <Link
              href="/commande"
              className="rounded-full border border-black/10 bg-white/75 px-6 py-3 text-sm font-medium text-[#181512] transition hover:bg-white"
            >
              Faire une commande
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}