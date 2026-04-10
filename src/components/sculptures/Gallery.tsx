// src/components/sculptures/Gallery.tsx
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import type { Artwork } from "@/types/artwork";

type GalleryProps = {
  artworks: Artwork[];
};

function getCoverImage(artwork: Artwork) {
  return (
    artwork.images.find((image) => image.is_cover) ??
    artwork.images[0] ??
    null
  );
}

function getAvailabilityStyle(availability?: string | null) {
  const normalized = availability?.toLowerCase() ?? "";

  if (normalized.includes("vendue")) {
    return "border-neutral-900/80 bg-neutral-900 text-white";
  }

  if (normalized.includes("disponible")) {
    return "border-[#ead8bc] bg-[#f6efe2] text-[#6d533b]";
  }

  return "border-black/10 bg-white/90 text-neutral-600";
}

export default function Gallery({ artworks }: GalleryProps) {
  if (!artworks.length) {
    return (
      <div className="rounded-[30px] border border-black/5 bg-white/70 p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
        <p className="text-lg text-neutral-600">
          Aucune œuvre n’est encore disponible dans la galerie.
        </p>
        <p className="mt-2 text-sm text-neutral-400">
          Ajoute tes premières sculptures depuis Supabase pour les afficher ici.
        </p>
      </div>
    );
  }

  return (
    <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {artworks.map((artwork) => {
        const cover = getCoverImage(artwork);

        return (
          <Link
            key={artwork.id}
            href={`/sculptures/${artwork.slug}`}
            className="group block h-full"
          >
            <article className="relative flex h-full flex-col overflow-hidden rounded-[30px] border border-black/5 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-sm transition duration-500 hover:-translate-y-1.5 hover:border-[#ff6a00]/10 hover:shadow-[0_26px_80px_rgba(15,23,42,0.11)]">
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#ff8a1f]/30 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

              <div className="relative aspect-[4/5] overflow-hidden bg-[#efe8dc]">
                {cover ? (
                  <>
                    <Image
                      src={cover.image_url}
                      alt={cover.alt_text || artwork.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612]/18 via-transparent to-transparent transition duration-500 group-hover:from-[#1a1612]/26" />
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm text-neutral-400">
                    Image indisponible
                  </div>
                )}

                {artwork.availability && (
                  <div className="absolute left-4 top-4">
                    <span
                      className={clsx(
                        "rounded-full border px-3 py-1 text-[11px] font-medium backdrop-blur-md",
                        getAvailabilityStyle(artwork.availability)
                      )}
                    >
                      {artwork.availability}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="min-h-[116px]">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">
                    {artwork.category || "Sculpture"}
                  </p>

                  <h2 className="mt-3 line-clamp-2 text-[1.38rem] font-medium leading-[1.1] tracking-[-0.02em] text-neutral-900 transition duration-300 group-hover:text-[#be5a08]">
                    {artwork.title}
                  </h2>

                  <div className="mt-2 min-h-[40px]">
                    {artwork.subtitle ? (
                      <p className="line-clamp-2 text-sm text-neutral-500">
                        {artwork.subtitle}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 min-h-[24px]">
                  {(artwork.dimensions || artwork.year) && (
                    <p className="text-sm text-neutral-500">
                      {[artwork.dimensions, artwork.year].filter(Boolean).join(" • ")}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex-1">
                  {artwork.description && (
                    <p className="line-clamp-4 text-sm leading-7 text-neutral-600">
                      {artwork.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-4">
                  <span className="inline-flex items-center text-sm font-medium text-[#c45e09] transition duration-300 group-hover:translate-x-0.5">
                    Découvrir l’œuvre
                  </span>
                </div>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}