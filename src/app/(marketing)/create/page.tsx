import Link from "next/link";

import { Container } from "@/components/layout/container";

export default function CreatePage() {
  return (
    <main className="py-24 md:py-32">
      <Container className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">
          Créer avec IA
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">
          Imaginez une sculpture avant de la faire naître.
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-300">
          Décrivez votre idée, générez un concept visuel, puis transformez-le en
          commande sur mesure.
        </p>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <p className="text-sm text-neutral-300">
            Cette page accueillera bientôt :
          </p>

          <ul className="mt-6 space-y-3 text-sm text-neutral-300">
            <li>— champ de prompt</li>
            <li>— presets de styles</li>
            <li>— génération d’image</li>
            <li>— sauvegarde du concept</li>
            <li>— bouton de conversion en commande réelle</li>
          </ul>

          <div className="mt-8">
            <Link
              href="/commande"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Aller vers la commande
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}