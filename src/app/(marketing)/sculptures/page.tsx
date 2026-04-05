import { Container } from "@/components/layout/container";

const works = [
  "Trajectoire",
  "Fusion des Consciences",
  "Support à vins",
  "Sculpture lumineuse",
  "Relief organique",
  "Pièce expérimentale",
];

export default function SculpturesPage() {
  return (
    <main className="py-24 md:py-32">
      <Container>
        <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">
          Galerie
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">
          Sculptures
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
          Une sélection de pièces sculpturales entre formes organiques,
          matières recyclées et composition contemporaine.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {works.map((work) => (
            <article
              key={work}
              className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="aspect-[4/5] rounded-[1.25rem] border border-white/10 bg-gradient-to-br from-neutral-800 to-neutral-900" />
              <h2 className="mt-5 text-xl font-medium text-white">{work}</h2>
              <p className="mt-2 text-sm leading-7 text-neutral-300">
                Pièce artisanale pensée comme un objet sculptural et décoratif.
              </p>
            </article>
          ))}
        </div>
      </Container>
    </main>
  );
}