import { Bot, PencilRuler, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/container";

const steps = [
  {
    title: "Imaginez",
    description:
      "Décrivez une intention, une émotion, une matière ou une présence sculpturale.",
    icon: Sparkles,
  },
  {
    title: "Générez",
    description:
      "L’IA propose une direction visuelle inspirée de l’univers Marcos Papermache.",
    icon: Bot,
  },
  {
    title: "Transformez",
    description:
      "Le concept devient la base d’une création réelle, pensée et façonnée sur mesure.",
    icon: PencilRuler,
  },
];

export function ProcessSection() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="mb-14 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.32em] text-[#9a6b47]">
            Processus
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#181512] md:text-5xl">
            De l’idée à la sculpture
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-[1.9rem] border border-black/5 bg-white/65 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ff6a00]/15 bg-gradient-to-br from-[#fff4ea] to-[#f3e8dc]">
                  <Icon className="h-5 w-5 text-[#ff6a00]" />
                </div>

                <h3 className="mt-6 text-xl font-medium text-[#181512]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#5f5348]">
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