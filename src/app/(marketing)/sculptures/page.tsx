import Gallery from "@/components/sculptures/Gallery";
import { Container } from "@/components/layout/container";

export default function SculpturesPage() {
  return (
    <main className="py-24 md:py-32">
      <Container>
        <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">
          Galerie
        </p>
        <h1 className="mt-4 text-4xl font-semibold md:text-6xl">
          Sculptures
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-500">
          Une sélection de pièces sculpturales entre formes organiques,
          matières recyclées et composition contemporaine.
        </p>

        <Gallery />
      </Container>
    </main>
  );
}