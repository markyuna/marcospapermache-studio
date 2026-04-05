import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";

import { sculptures } from "@/data/sculptures";
import { Container } from "@/components/layout/container";
import ImageGallery from "@/components/sculptures/ImageGallery";

type SculpturePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return sculptures.map((sculpture) => ({
    slug: sculpture.slug,
  }));
}

export async function generateMetadata({
  params,
}: SculpturePageProps): Promise<Metadata> {
  const { slug } = await params;

  const sculpture = sculptures.find((item) => item.slug === slug);

  if (!sculpture) {
    return {
      title: "Sculpture introuvable | Marcos Papermache",
      description: "Cette sculpture est introuvable.",
    };
  }

  return {
    title: `${sculpture.title} | Marcos Papermache`,
    description:
      sculpture.description ??
      "Découverte d’une sculpture artisanale signée Marcos Papermache.",
  };
}

export default async function SculpturePage({ params }: SculpturePageProps) {
  const { slug } = await params;

  const sculpture = sculptures.find((item) => item.slug === slug);

  if (!sculpture) {
    notFound();
  }

  const images =
    sculpture.images && sculpture.images.length > 0
      ? sculpture.images
      : ["/placeholder.png"];

  return (
    <main className="py-16 md:py-24">
      <Container>
        <div className="mb-8">
          <Link
            href="/sculptures"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux sculptures
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <section className="space-y-4">
            <ImageGallery images={images} title={sculpture.title} />
          </section>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm backdrop-blur md:p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">
                Sculpture artisanale
              </p>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
                {sculpture.title}
              </h1>

              {sculpture.subtitle && (
                <p className="mt-3 text-lg text-neutral-500">
                  {sculpture.subtitle}
                </p>
              )}

              <p className="mt-6 text-base leading-8 text-neutral-600">
                {sculpture.description ??
                  "Une pièce sculpturale unique réalisée à la main, entre matière, texture et composition contemporaine."}
              </p>

              <div className="mt-8 grid gap-4 rounded-2xl bg-neutral-50 p-5">
                {sculpture.dimensions && (
                  <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-3">
                    <span className="text-sm text-neutral-500">Dimensions</span>
                    <span className="text-right text-sm font-medium text-neutral-900">
                      {sculpture.dimensions}
                    </span>
                  </div>
                )}

                {sculpture.materials && (
                  <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-3">
                    <span className="text-sm text-neutral-500">Matériaux</span>
                    <span className="text-right text-sm font-medium text-neutral-900">
                      {sculpture.materials}
                    </span>
                  </div>
                )}

                {sculpture.year && (
                  <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-3">
                    <span className="text-sm text-neutral-500">Année</span>
                    <span className="text-right text-sm font-medium text-neutral-900">
                      {sculpture.year}
                    </span>
                  </div>
                )}

                {sculpture.availability && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-neutral-500">
                      Disponibilité
                    </span>
                    <span className="text-right text-sm font-medium text-neutral-900">
                      {sculpture.availability}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                >
                  Commander cette œuvre
                </Link>

                <Link
                  href="/experience-ia"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
                >
                  <Sparkles className="h-4 w-4" />
                  Créer une version avec IA
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {sculpture.story && (
          <section className="mt-16 max-w-4xl">
            <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">
              À propos de l’œuvre
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-neutral-900 md:text-3xl">
              L’histoire derrière la pièce
            </h2>

            <p className="mt-6 text-lg leading-8 text-neutral-600">
              {sculpture.story}
            </p>
          </section>
        )}
      </Container>
    </main>
  );
}