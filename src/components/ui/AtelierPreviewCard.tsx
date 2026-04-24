"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

type Props = {
  image?: string;
  title?: string;
  subtitle?: string;
};

export default function AtelierPreviewCard({
  image = "/images/sculptures/default.jpg", // cambia por una tuya
  title = "Sculpture murale",
  subtitle = "Papier mâché · Pièce unique",
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      {/* glow premium */}
      <div className="absolute -inset-10 rounded-[3rem] bg-[radial-gradient(circle_at_top,#ff9f43_0%,transparent_60%)] opacity-25 blur-2xl" />

      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/60 p-4 shadow-[0_30px_100px_rgba(65,38,15,0.12)] backdrop-blur-2xl">
        
        {/* IMAGE */}
        <div className="group relative overflow-hidden rounded-[2rem]">
          <Image
            src={image}
            alt={title}
            width={800}
            height={600}
            className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-105"
          />

          {/* overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.45),transparent)] opacity-80" />

          {/* content */}
          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-xs uppercase tracking-[0.28em] text-white/70">
              Atelier
            </p>

            <h3 className="mt-2 text-xl font-semibold text-white">
              {title}
            </h3>

            <p className="text-sm text-white/80">
              {subtitle}
            </p>
          </div>
        </div>

        {/* bottom card */}
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur-xl">
          <Sparkles className="mt-1 h-5 w-5 text-[#d86208]" />
          <p className="text-sm leading-6 text-[#6b5b4f]">
            Visualisez une première intention artistique avant la création finale.
          </p>
        </div>
      </div>
    </motion.div>
  );
}