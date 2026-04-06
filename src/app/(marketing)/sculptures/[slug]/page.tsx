import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, ExternalLink } from "lucide-react";

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
    sculpture.images?.length > 0 ? sculpture.images : ["/placeholder.png"];

  const isSold =
    sculpture.availability?.toLowerCase().includes("vendue") ?? false;

  const whatsappNumber = "33662482491";
  const whatsappMessage = encodeURIComponent(
    isSold
      ? `Bonjour Marcos, je suis intéressé(e) par une pièce similaire à "${sculpture.title}".`
      : `Bonjour Marcos, je suis intéressé(e) par la sculpture "${sculpture.title}".`
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const etsyUrl = sculpture.etsyUrl ?? null;
  const shouldUseEtsy = Boolean(etsyUrl && !isSold);

  const primaryCtaLabel = shouldUseEtsy
    ? "Commander cette œuvre sur Etsy"
    : isSold
      ? "Commander une pièce similaire"
      : "Commander cette œuvre";

  const primaryCtaClass =
    "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl";

  return (
    <main className="py-16 md:py-24">
      <Container>
        <div className="mb-10">
          <Link
            href="/sculptures"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux sculptures
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <section>
            <ImageGallery images={images} title={sculpture.title} />
          </section>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-black/5 bg-white/80 p-6 shadow-sm backdrop-blur md:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
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

              {sculpture.details?.length > 0 && (
                <div className="mt-8 space-y-2">
                  {sculpture.details.map((detail, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 text-sm text-neutral-600"
                    >
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-neutral-400" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 grid gap-4 rounded-2xl bg-neutral-50 p-5">
                {sculpture.dimensions && (
                  <div className="flex justify-between gap-4 border-b border-neutral-200 pb-3">
                    <span className="text-sm text-neutral-500">Dimensions</span>
                    <span className="max-w-[60%] text-right text-sm font-medium text-neutral-900">
                      {sculpture.dimensions}
                    </span>
                  </div>
                )}

                {sculpture.materials && (
                  <div className="flex justify-between gap-4 border-b border-neutral-200 pb-3">
                    <span className="text-sm text-neutral-500">Matériaux</span>
                    <span className="max-w-[60%] text-right text-sm font-medium text-neutral-900">
                      {sculpture.materials}
                    </span>
                  </div>
                )}

                {sculpture.year && (
                  <div className="flex justify-between gap-4 border-b border-neutral-200 pb-3">
                    <span className="text-sm text-neutral-500">Année</span>
                    <span className="text-sm font-medium text-neutral-900">
                      {sculpture.year}
                    </span>
                  </div>
                )}

                {sculpture.availability && (
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-neutral-500">
                      Disponibilité
                    </span>
                    <span className="text-right text-sm font-medium text-neutral-900">
                      {sculpture.availability}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p className="text-sm text-neutral-600">
                  Chaque pièce est unique. Aucune reproduction identique.
                </p>

                {!isSold ? (
                  <p className="mt-2 text-sm font-medium text-orange-500">
                    Pièce disponible actuellement
                  </p>
                ) : (
                  <p className="mt-2 text-sm font-medium text-neutral-500">
                    Cette œuvre a trouvé son collectionneur, mais une création
                    similaire peut être réalisée sur demande.
                  </p>
                )}
              </div>

              <div className="mt-10 flex flex-col gap-3">
                {shouldUseEtsy ? (
                  <a
                    href={etsyUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={primaryCtaClass}
                  >
                    {primaryCtaLabel}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={primaryCtaClass}
                  >
                    {primaryCtaLabel}
                  </a>
                )}

                <p className="text-center text-xs text-neutral-500">
                  Réponse rapide • Devis personnalisé • Sans engagement
                </p>

                <Link
                  href="/experience-ia"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
                >
                  <Sparkles className="h-4 w-4" />
                  Créer votre propre sculpture avec IA
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}