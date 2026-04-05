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
          Marcos Papermache développe un univers artistique contemporain centré
          sur la matière, le relief et la transformation. Chaque œuvre est
          pensée comme une présence visuelle forte, mêlant sensibilité
          artisanale, expérimentation et esthétique premium.
        </p>
      </Container>
    </main>
  );
}