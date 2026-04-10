// src/app/(marketing)/sculptures/page.tsx
import Gallery from "@/components/sculptures/Gallery";
import { Container } from "@/components/layout/container";
import { getArtworks } from "@/lib/artworks";

export const metadata = {
  title: "Sculptures | Marcos Papermache",
  description:
    "Une sélection de pièces sculpturales entre formes organiques, matières recyclées et composition contemporaine.",
};

export default async function SculpturesPage() {
  const artworks = await getArtworks();

  return (
    <main className="bg-[#f8f5ef] py-24 md:py-32">
      <Container>
        <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">
          Galerie
        </p>

        <h1 className="mt-4 text-4xl font-semibold text-neutral-900 md:text-6xl">
          Sculptures
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-500">
          Une sélection de pièces sculpturales entre formes organiques,
          matières recyclées et composition contemporaine.
        </p>

        <div className="mt-16">
          <Gallery artworks={artworks} />
        </div>
      </Container>
    </main>
  );
}