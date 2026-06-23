"use client";

import { motion } from "framer-motion";
import { HandHeart, Palette, Sparkles } from "lucide-react";

type Step = {
  title: string;
  description: string;
};

const icons = [Sparkles, Palette, HandHeart];

export default function AnimatedSteps({ steps }: { steps: Step[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {steps.map((step, index) => {
        const Icon = icons[index] ?? Sparkles;

        return (
          <motion.article
            key={step.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.65,
              delay: index * 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/65 p-8 shadow-[0_24px_75px_rgba(65,38,15,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_95px_rgba(65,38,15,0.13)]"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,#f0a45b,transparent)] opacity-70" />

            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#efd8c1] bg-[#fff4e9] text-[#c85100] shadow-sm">
                <Icon className="h-5 w-5" />
              </div>

              <span className="text-xs font-semibold tracking-[0.24em] text-[#c7a27f]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-[#181512] md:text-2xl">
              {step.title}
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#65574c]">
              {step.description}
            </p>
          </motion.article>
        );
      })}
    </div>
  );
}
