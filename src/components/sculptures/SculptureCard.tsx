import Image from "next/image";
import Link from "next/link";

type SculptureCardProps = {
  slug: string;
  src: string;
  title: string;
};

export default function SculptureCard({
  slug,
  src,
  title,
}: SculptureCardProps) {
  return (
    <Link
      href={`/sculptures/${slug}`}
      className="group block overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
        <p className="mt-2 text-sm text-neutral-500">Découvrir l’œuvre</p>
      </div>
    </Link>
  );
}