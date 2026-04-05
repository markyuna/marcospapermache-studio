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
    <section className="py-20 md:py-28">
      <Container>
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">
              Sélection
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              Sculptures en lumière
            </h2>
          </div>

          <Link
            href="/sculptures"
            className="hidden text-sm text-neutral-300 transition hover:text-white md:block"
          >
            Voir toute la galerie
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredWorks.map((work) => (
            <article
              key={work.title}
              className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.05]"
            >
              <div className="aspect-[4/5] rounded-[1.25rem] border border-white/10 bg-gradient-to-br from-neutral-800 to-neutral-900" />
              <p className="mt-6 text-xs uppercase tracking-[0.28em] text-neutral-500">
                {work.category}
              </p>
              <h3 className="mt-3 text-xl font-medium text-white">
                {work.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300">
                {work.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}