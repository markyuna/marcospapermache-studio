import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
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
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-10">
        <div className="order-2 md:order-1">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
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

          <ul className="mt-10 space-y-3 text-sm text-neutral-700 md:text-base">
            {sculpture.details.map((detail) => (
              <li key={detail} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-neutral-900" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>

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
              src={sculpture.image}
              alt={sculpture.title}
              width={1200}
              height={1400}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>
    </main>
  );
}