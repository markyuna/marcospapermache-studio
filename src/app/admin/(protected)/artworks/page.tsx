import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CreateArtworkForm from "@/components/admin/CreateArtworkForm";

type ArtworkImage = {
  image_url: string;
  is_cover: boolean;
  position: number | null;
};

type Artwork = {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  year: number | null;
  availability: string | null;
  price: string | null;
  is_featured: boolean | null;
  artwork_images: ArtworkImage[] | null;
};

type ArtworkRow = Omit<Artwork, "artwork_images"> & {
  img_url: string | null;
  img_is_cover: boolean | null;
  img_position: number | null;
};

async function getArtworks(): Promise<Artwork[]> {
  try {
    const rows = await prisma.$queryRawUnsafe<ArtworkRow[]>(`
      SELECT
        a.id, a.title, a.slug,
        a.category, a.year, a.availability, a.price, a.is_featured,
        ai.image_url AS img_url,
        ai.is_cover  AS img_is_cover,
        ai.position  AS img_position
      FROM artworks a
      LEFT JOIN artwork_images ai ON ai.artwork_id = a.id
      ORDER BY a.created_at DESC, ai.position ASC NULLS LAST
    `);

    const artworkMap = new Map<number, Artwork>();

    for (const row of rows) {
      if (!artworkMap.has(row.id)) {
        artworkMap.set(row.id, {
          id: row.id,
          title: row.title,
          slug: row.slug,
          category: row.category,
          year: row.year,
          availability: row.availability,
          price: row.price,
          is_featured: row.is_featured,
          artwork_images: [],
        });
      }

      if (row.img_url) {
        artworkMap.get(row.id)!.artwork_images!.push({
          image_url: row.img_url,
          is_cover: row.img_is_cover ?? false,
          position: row.img_position,
        });
      }
    }

    return Array.from(artworkMap.values());
  } catch (error) {
    console.error("Unexpected error loading artworks:", error);
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function AdminArtworksPage() {
  const artworks = await getArtworks();

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold text-neutral-950 md:text-3xl">Galerie</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">

          {/* ── LEFT: Create form ── */}
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.1em] text-neutral-500">
              Ajouter une œuvre
            </p>
            <CreateArtworkForm />
          </div>

          {/* ── RIGHT: Gallery ── */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-500">
                Toutes les œuvres
              </p>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-600 ring-1 ring-black/5">
                {artworks.length} œuvre{artworks.length > 1 ? "s" : ""}
              </span>
            </div>

            {artworks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-16 text-center text-sm text-neutral-400 shadow-sm">
                Aucune œuvre enregistrée pour le moment.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {artworks.map((artwork) => {
                  const sortedImages = [...(artwork.artwork_images ?? [])].sort(
                    (a, b) => (a.position ?? 9999) - (b.position ?? 9999)
                  );

                  const cover =
                    sortedImages.find((img) => img.is_cover) ??
                    sortedImages[0] ??
                    null;

                  return (
                    <article
                      key={artwork.id}
                      className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {/* Cover image */}
                      <div className="relative aspect-square bg-neutral-100">
                        {cover ? (
                          <Image
                            src={cover.image_url}
                            alt={artwork.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-[1.02]"
                            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                            Aucune image
                          </div>
                        )}

                        {/* Overlay badges */}
                        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                          {artwork.category ? (
                            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-neutral-800 backdrop-blur">
                              {artwork.category}
                            </span>
                          ) : null}
                          {artwork.year ? (
                            <span className="rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                              {artwork.year}
                            </span>
                          ) : null}
                          {artwork.is_featured ? (
                            <span className="rounded-full bg-amber-500/90 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                              Featured
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <h3 className="line-clamp-1 text-[13px] font-semibold text-neutral-900">
                          {artwork.title}
                        </h3>

                        {artwork.price ? (
                          <p className="mt-0.5 text-xs text-neutral-500">{artwork.price}</p>
                        ) : null}

                        <div className="mt-3 flex gap-1.5">
                          <Link
                            href={`/admin/artworks/${artwork.id}`}
                            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-900 transition hover:border-neutral-500"
                          >
                            Gérer
                          </Link>
                          <Link
                            href={`/fr/sculptures/${artwork.slug}`}
                            target="_blank"
                            className="inline-flex items-center justify-center rounded-lg border border-neutral-200 px-3 py-1.5 text-[11px] font-medium text-neutral-500 transition hover:text-neutral-800"
                          >
                            Voir
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
