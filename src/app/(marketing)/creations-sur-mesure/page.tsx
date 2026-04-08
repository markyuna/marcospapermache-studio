import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import CommandeForm from "@/components/forms/CommandeForm";

import { Container } from "@/components/layout/container";

const steps = [
  {
    title: "Partager votre idée",
    description:
      "Décrivez votre envie, votre espace, vos inspirations ou l’émotion que vous souhaitez faire naître.",
  },
  {
    title: "Définir la direction artistique",
    description:
      "Nous échangeons sur les formes, les matières, les dimensions et l’intention esthétique de la pièce.",
  },
  {
    title: "Donner vie à l’œuvre",
    description:
      "La sculpture est réalisée à la main dans une approche artisanale, sensible et contemporaine.",
  },
];

const values = [
  "Pièce unique pensée pour votre univers",
  "Fabrication artisanale à la main",
  "Matériaux recyclés et approche responsable",
  "Esthétique contemporaine et expressive",
];

export default function CustomCreationPage() {
  return (
    <main className="relative overflow-hidden">
      <section className="relative overflow-hidden pb-24 pt-28 md:pb-32 md:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.14),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(255,190,120,0.16),transparent_26%),linear-gradient(to_bottom,#fffaf5,#fff5ed,#fffaf5)]" />

        <Container className="relative">
          <div className="max-w-4xl">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#b07a52]">
              Création sur mesure
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#1b1713] md:text-6xl">
              Une œuvre pensée spécialement pour vous
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6c5d50]">
              Chaque création sur mesure naît d’un dialogue entre matière,
              intuition et intention. L’objectif est de concevoir une pièce
              singulière, en résonance avec votre intérieur, votre sensibilité
              et votre projet.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#ef8316] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:bg-[#af6020]"
              >
                Demander une création
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/sculptures"
                className="inline-flex items-center gap-2 rounded-full border border-[#dcc7b2] bg-white/80 px-6 py-3 text-sm font-medium text-[#4f4338] backdrop-blur-md transition duration-300 hover:border-[#ff6a00]/30 hover:text-[#c65400]"
              >
                Voir les œuvres
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-24">
        <Container>
          <div className="mb-12 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#b07a52]">
              Processus
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#1b1713] md:text-5xl">
              Comment se déroule une commande
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[2rem] border border-black/5 bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ead7c2] bg-[#fff7f0] text-sm font-medium text-[#9c6e47]">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="mt-6 text-2xl font-medium text-[#181512]">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#5f5348]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#b07a52]">
                Approche
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#1b1713] md:text-5xl">
                Une démarche artisanale, poétique et contemporaine
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-[#6c5d50] md:text-lg">
                Chaque projet est abordé comme une recherche de forme, de
                présence et d’émotion. La matière recyclée devient langage, la
                main donne le rythme, et la pièce finale trouve sa place entre
                sculpture, objet et mémoire.
              </p>
            </div>

            <div className="rounded-[2rem] border border-black/5 bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-sm">
              <ul className="space-y-4">
                {values.map((value) => (
                  <li key={value} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#c65400]" />
                    <span className="text-sm leading-7 text-[#5f5348] md:text-base">
                      {value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

        <section className="pb-24 pt-10 md:pb-32">
            <Container>
                <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
                
                <div>
                    <p className="text-[11px] uppercase tracking-[0.34em] text-[#9c6e47]">
                    Projet personnalisé
                    </p>

                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#181512] md:text-5xl">
                    Parlons de votre future création
                    </h2>

                    <p className="mt-5 text-base leading-8 text-[#5f5348] md:text-lg">
                    Décrivez votre idée, votre espace ou simplement votre intention.
                    Chaque projet est une collaboration.
                    </p>
                </div>

                <CommandeForm />

                </div>
            </Container>
        </section>
    </main>
  );
}