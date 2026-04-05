import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sculptures } from "@/data/sculptures";

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

export default async function SculpturePage({
  params,
}: SculpturePageProps) {
  const { slug } = await params;

  const sculpture = sculptures.find((item) => item.slug === slug);

  if (!sculpture) {
    notFound();
  }

  return (
    <main className="bg-[#f8f5ef] text-neutral-900">
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">
              Sculpture
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
              {sculpture.title}
            </h1>

            <p className="mt-4 text-lg text-neutral-600">
              {sculpture.subtitle}
            </p>

            <p className="mt-8 max-w-xl text-base leading-8 text-neutral-700 md:text-lg">
              {sculpture.description}
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Commander cette œuvre
              </Link>

              <Link
                href="/sculptures"
                className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-800 transition hover:bg-white"
              >
                Retour à la galerie
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <Image
                src={sculpture.images[0]}
                alt={sculpture.title}
                width={1200}
                height={1400}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-4 md:px-10 md:py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {sculpture.images.slice(1).map((img, index) => (
            <div
              key={img}
              className="relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
            >
              <Image
                src={img}
                alt={`${sculpture.title} détail ${index + 1}`}
                width={1000}
                height={1200}
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <article className="rounded-[1.75rem] bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
            <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
              Dimensions
            </p>
            <p className="mt-4 text-lg font-medium text-neutral-900">
              {sculpture.dimensions}
            </p>
          </article>

          <article className="rounded-[1.75rem] bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
            <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
              Matériaux
            </p>
            <p className="mt-4 text-lg leading-8 text-neutral-700">
              {sculpture.materials}
            </p>
          </article>

          <article className="rounded-[1.75rem] bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
            <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
              Pièce
            </p>
            <p className="mt-4 text-lg font-medium text-neutral-900">
              Unique
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <article className="rounded-[2rem] bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
            <h2 className="text-2xl font-semibold">Détails de l’œuvre</h2>

            <ul className="mt-6 space-y-4 text-neutral-700">
              {sculpture.details.map((detail) => (
                <li key={detail} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-neutral-900" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[2rem] bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
            <h2 className="text-2xl font-semibold">Vision</h2>
            <p className="mt-6 leading-8 text-neutral-700">
              {sculpture.vision}
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-16">
        <div className="rounded-[2.5rem] bg-neutral-900 px-8 py-14 text-white md:px-14">
          <p className="text-xs uppercase tracking-[0.32em] text-white/60">
            Création sur mesure
          </p>

          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
            Vous souhaitez une pièce inspirée de cet univers ?
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
            Chaque sculpture peut devenir le point de départ d’une création sur
            mesure, pensée pour un espace, une ambiance ou une intention
            particulière.
          </p>

          <div className="mt-10">
            <Link
              href="/creations-sur-mesure"
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:opacity-90"
            >
              Demander une création
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}