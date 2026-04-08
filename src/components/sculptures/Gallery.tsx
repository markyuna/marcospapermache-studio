import Image from "next/image";
import Link from "next/link";
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

export default function Gallery({ artworks }: GalleryProps) {
  if (!artworks.length) {
    return (
      <div className="rounded-[28px] border border-black/5 bg-white/70 p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
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
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {artworks.map((artwork) => {
        const cover = getCoverImage(artwork);

        return (
          <Link
            key={artwork.id}
            href={`/sculptures/${artwork.slug}`}
            className="group block"
          >
            <article className="overflow-hidden rounded-[28px] border border-black/5 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#efe8dc]">
                {cover ? (
                  <Image
                    src={cover.image_url}
                    alt={cover.alt_text || artwork.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm text-neutral-400">
                    Image indisponible
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                      {artwork.category || "Sculpture"}
                    </p>

                    <h2 className="mt-3 text-2xl font-medium text-neutral-900">
                      {artwork.title}
                    </h2>

                    {artwork.subtitle && (
                      <p className="mt-2 text-sm text-neutral-500">
                        {artwork.subtitle}
                      </p>
                    )}
                  </div>

                  {artwork.availability && (
                    <span className="rounded-full bg-[#f6efe2] px-3 py-1 text-[11px] font-medium text-neutral-600">
                      {artwork.availability}
                    </span>
                  )}
                </div>

                {(artwork.dimensions || artwork.year) && (
                  <p className="mt-4 text-sm text-neutral-500">
                    {[artwork.dimensions, artwork.year].filter(Boolean).join(" • ")}
                  </p>
                )}

                {artwork.description && (
                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-neutral-600">
                    {artwork.description}
                  </p>
                )}
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}