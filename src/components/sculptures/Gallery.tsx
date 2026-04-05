import SculptureCard from "./SculptureCard";
import { sculptures } from "@/data/sculptures";

type GalleryProps = {
  limit?: number;
};

export default function Gallery({ limit }: GalleryProps) {
  const items = limit ? sculptures.slice(0, limit) : sculptures;

  return (
    <section className="py-16">
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {items.map((artwork) => (
          <SculptureCard
            key={artwork.slug}
            slug={artwork.slug}
            src={artwork.image}
            title={artwork.title}
          />
        ))}
      </div>
    </section>
  );
}