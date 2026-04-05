import SculptureCard from "@/components/sculptures/SculptureCard";
import { sculptures } from "@/data/sculptures";

export default function Gallery() {
  return (
    <section className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {sculptures.map((artwork) => (
        <SculptureCard
          key={artwork.slug}
          slug={artwork.slug}
          src={artwork.images?.[0] ?? "/placeholder.png"}
          title={artwork.title}
        />
      ))}
    </section>
  );
}