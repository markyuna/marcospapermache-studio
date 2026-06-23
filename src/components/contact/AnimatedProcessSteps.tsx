"use client";

import { motion } from "framer-motion";

type Step = { title: string; text: string };

export default function AnimatedProcessSteps({ steps }: { steps: Step[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {steps.map((step, index) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="group rounded-[1.75rem] border border-white/[0.07] bg-white/[0.04] p-6 transition duration-300 hover:border-[#c07040]/25 hover:bg-white/[0.07]"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#c07040]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-3 text-base font-semibold text-white">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-7 text-white/45">{step.text}</p>
        </motion.div>
      ))}
    </div>
  );
}
