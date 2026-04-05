import { Container } from "@/components/layout/container";

export default function AboutPage() {
  return (
    <main className="py-24 md:py-32">
      <Container className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">
          À propos
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">
          Un langage sculptural entre artisanat, émotion et modernité.
        </h1>
        <p className="mt-8 text-lg leading-9 text-neutral-300">
        Marcos Suarez originaire de La Havane, Cuba, dont le parcours artistique a commencé. Il découvre très jeune sa passion pour la sculpture en papier mâché. Il a commencé par créer des souvenirs faits à la main en carton et en papier, qui ont été vendus avec succès sur les marchés touristiques, notamment près de la célèbre cathédrale de La Havane. Marcos est un artiste sculpteur talentueux qui excelle dans l'art unique de la sculpture en papier mâché. Sa passion pour la création artistique et sa maîtrise de cette technique insolite ont fait de lui l'une des figures les plus prometteuses du monde de l'art contemporain.
        </p>
      </Container>
    </main>
  );
}