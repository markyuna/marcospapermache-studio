import { Bot, PencilRuler, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/container";

const steps = [
  {
    title: "Imaginez",
    description:
      "Décrivez une sculpture, une ambiance, une émotion ou une forme.",
    icon: Sparkles,
  },
  {
    title: "Générez",
    description:
      "L’IA crée un concept visuel inspiré de l’univers Marcos Papermache.",
    icon: Bot,
  },
  {
    title: "Transformez",
    description:
      "Le concept devient la base d’une commande artistique réelle et sur mesure.",
    icon: PencilRuler,
  },
];

export function ProcessSection() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">
            Processus
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            De l’idée à la sculpture
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}