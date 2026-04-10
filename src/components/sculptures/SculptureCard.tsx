// src/components/sculptures/SculptureCard.tsx
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";

type SculptureCardProps = {
  slug: string;
  src: string;
  title: string;
  availability?: string;
};

export default function SculptureCard({
  slug,
  src,
  title,
  availability,
}: SculptureCardProps) {
  const normalizedAvailability = availability?.toLowerCase() ?? "";
  const isSold = normalizedAvailability.includes("vendue");
  const isAvailable =
    normalizedAvailability.includes("disponible") && !isSold;

  return (
    <Link
      href={`/sculptures/${slug}`}
      className="group relative block overflow-hidden rounded-[2rem] border border-black/5 bg-white/80 shadow-[0_16px_50px_rgba(60,35,10,0.06)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[#ff6a00]/15 hover:shadow-[0_26px_70px_rgba(180,120,60,0.14)]"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#ff6a00]/25 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-b-[1.4rem]">
        <Image
          src={src}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.08] group-hover:brightness-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/45 via-[#181512]/10 to-transparent transition duration-500 group-hover:from-[#181512]/28" />

        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,200,120,0.24),transparent_60%)]" />
        </div>

        <div className="absolute left-4 top-4">
          <span
            className={clsx(
              "rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] backdrop-blur-md",
              isSold
                ? "border-white/15 bg-black/65 text-white"
                : "border-white/60 bg-white/85 text-[#5f4632]"
            )}
          >
            {isSold ? "Vendue" : isAvailable ? "Disponible" : "Sur demande"}
          </span>
        </div>

        <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/88 px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm backdrop-blur">
            Découvrir
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-medium tracking-[-0.02em] text-[#181512] transition duration-300 group-hover:text-[#c65400]">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#6c5d50]">
          {isSold
            ? "Voir la pièce et découvrir une création similaire."
            : isAvailable
              ? "Disponible — voir les détails de la pièce."
              : "Création disponible sur demande."}
        </p>
      </div>
    </Link>
  );
}