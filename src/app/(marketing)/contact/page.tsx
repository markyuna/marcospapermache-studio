import { Container } from "@/components/layout/container";

export default function ContactPage() {
  return (
    <main className="py-24 md:py-32">
      <Container className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">
          Contact
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">
          Parlons de votre projet.
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-300">
          Pour une collaboration, une commande ou une question sur une œuvre,
          vous pouvez utiliser cette page de contact dédiée.
        </p>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <p className="text-sm leading-7 text-neutral-300">
            Adresse email, formulaire, réseaux sociaux et informations
            professionnelles viendront ici.
          </p>
        </div>
      </Container>
    </main>
  );
}