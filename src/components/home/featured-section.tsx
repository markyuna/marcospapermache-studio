import Link from "next/link";

import { Container } from "@/components/layout/container";

const featuredWorks = [
  {
    title: "Trajectoire",
    category: "Sculpture murale",
    description: "Relief organique avec accents dorés et composition fluide.",
  },
  {
    title: "Fusion des Consciences",
    category: "Œuvre encadrée",
    description: "Une pièce artisanale entre présence, mémoire et mouvement.",
  },
  {
    title: "Support à vins",
    category: "Sculpture fonctionnelle",
    description: "Objet d’art décoratif pensé pour sublimer l’espace.",
  },
];

export function FeaturedSection() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#9a6b47]">
              Sélection
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#181512] md:text-5xl">
              Sculptures en lumière
            </h2>
          </div>

          <Link
            href="/sculptures"
            className="hidden text-sm text-[#6f6257] transition hover:text-[#ff6a00] md:block"
          >
            Voir toute la galerie
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredWorks.map((work) => (
            <article
              key={work.title}
              className="group rounded-[1.9rem] border border-black/5 bg-white/65 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/85"
            >
              <div className="aspect-[4/5] rounded-[1.35rem] border border-[#ff6a00]/10 bg-gradient-to-br from-[#fff9f4] via-[#f6eadc] to-[#ead7c2]" />

              <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-[#b08a67]">
                {work.category}
              </p>

              <h3 className="mt-3 text-xl font-medium text-[#181512] transition group-hover:text-[#c65400]">
                {work.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#5f5348]">
                {work.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}