import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

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
  const isSold =
    availability?.toLowerCase().includes("vendue") ?? false;

  return (
    <Link
      href={`/sculptures/${slug}`}
      className="group block overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

        {/* BADGE */}
        <div className="absolute top-4 left-4">
          <span
            className={clsx(
              "rounded-full px-3 py-1 text-xs font-medium backdrop-blur",
              isSold
                ? "bg-black/70 text-white"
                : "bg-white/90 text-neutral-900"
            )}
          >
            {isSold ? "Vendue" : "Disponible"}
          </span>
        </div>

        {/* HOVER CTA */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 transition duration-300 group-hover:opacity-100">
          <div className="rounded-full bg-white/90 px-4 py-2 text-center text-sm font-medium text-neutral-900 backdrop-blur">
            Découvrir
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <h3 className="text-lg font-medium text-neutral-900">{title}</h3>

        <p className="mt-2 text-sm text-neutral-500">
          {isSold
            ? "Voir la pièce et commander similaire"
            : "Disponible — voir les détails"}
        </p>
      </div>
    </Link>
  );
}