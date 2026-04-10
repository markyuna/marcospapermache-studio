import { Container } from "@/components/layout/container";

export default function CommandePage() {
  return (
    <main className="py-24 md:py-32">
      <Container className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">
          Commande
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">
          Demande de création personnalisée.
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-300">
          Décrivez votre projet, vos dimensions, votre budget et votre univers
          visuel pour lancer une commande sur mesure.
        </p>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm text-neutral-400">Nom</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm text-neutral-400">Email</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 md:col-span-2">
              <p className="text-sm text-neutral-400">Description</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm text-neutral-400">Budget</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm text-neutral-400">Dimensions</p>
            </div>
          </div>

          <button className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-medium text-black">
            Envoyer la demande
          </button>
        </div>
      </Container>
    </main>
  );
}