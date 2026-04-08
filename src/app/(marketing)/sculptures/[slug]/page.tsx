import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { getArtworkBySlug } from "@/lib/artworks";
import SculptureImageGallery from "@/components/sculptures/SculptureImageGallery";

type SculptureDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SculptureDetailPage({
  params,
}: SculptureDetailPageProps) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  return (
    <main className="bg-[#f8f5ef] py-24 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] xl:gap-16">
          <div className="object-cover transition duration-500 ease-in-out">
            {artwork.images.length > 0 ? (
              <SculptureImageGallery
                images={artwork.images}
                title={artwork.title}
              />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center rounded-[28px] bg-white text-neutral-400">
                Aucune image disponible
              </div>
            )}
          </div>

          <aside className="h-fit lg:sticky lg:top-28">
            <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">
              {artwork.category || "Sculpture"}
            </p>

            <h1 className="mt-4 text-4xl font-semibold text-neutral-900 md:text-5xl">
              {artwork.title}
            </h1>

            {artwork.subtitle && (
              <p className="mt-4 text-lg text-neutral-500 md:text-xl">
                {artwork.subtitle}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {artwork.availability && (
                <span className="rounded-full bg-[#f3eadb] px-4 py-2 text-sm font-medium text-neutral-700">
                  {artwork.availability}
                </span>
              )}

              {artwork.year && (
                <span className="rounded-full border border-black/5 bg-white/80 px-4 py-2 text-sm text-neutral-600">
                  {artwork.year}
                </span>
              )}
            </div>

            {(artwork.dimensions || artwork.materials) && (
              <div className="mt-8 space-y-4 rounded-[24px] border border-black/5 bg-white/70 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.04)]">
                {artwork.dimensions && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                      Dimensions
                    </p>
                    <p className="mt-2 text-base text-neutral-700">
                      {artwork.dimensions}
                    </p>
                  </div>
                )}

                {artwork.materials && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                      Matériaux
                    </p>
                    <p className="mt-2 text-base leading-7 text-neutral-700">
                      {artwork.materials}
                    </p>
                  </div>
                )}
              </div>
            )}

            {artwork.description && (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                  Description
                </p>
                <p className="mt-4 text-lg leading-8 text-neutral-600">
                  {artwork.description}
                </p>
              </div>
            )}

            {artwork.details.length > 0 && (
              <div className="mt-10">
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                  Détails de l’œuvre
                </p>

                <ul className="mt-4 space-y-3">
                  {artwork.details.map((detail) => (
                    <li
                      key={detail.id}
                      className="flex items-start gap-3 text-neutral-700"
                    >
                      <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-[#d7a34b]" />
                      <span className="leading-7">{detail.content}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-300 px-6 py-3 text-sm font-medium text-black shadow-[0_12px_30px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5"
              >
                Demander cette création
              </Link>

              {artwork.etsy_url && (
                <Link
                  href={artwork.etsy_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-6 py-3 text-sm font-medium text-neutral-800 transition hover:bg-white"
                >
                  Voir sur Etsy
                </Link>
              )}
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}