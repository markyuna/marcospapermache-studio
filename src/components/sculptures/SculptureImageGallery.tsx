// src/components/sculptures/SculptureImageGallery.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand } from "lucide-react";
import clsx from "clsx";

import Lightbox from "@/components/ui/Lightbox";
import type { ArtworkImage } from "@/types/artwork";

type Props = {
  images: ArtworkImage[];
  title: string;
};

export default function SculptureImageGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImage = images[activeIndex];

  const lightboxImages = images.map((image) => ({
    src: image.image_url,
    alt: image.alt_text || title,
  }));

  function openLightbox(index: number) {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  }

  if (!images.length || !activeImage) {
    return null;
  }

  return (
    <>
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => openLightbox(activeIndex)}
          className="group relative block w-full overflow-hidden rounded-[30px] bg-[#efe8dc] text-left shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
          aria-label={`Ouvrir l’image de ${title} en grand`}
        >
          <div className="relative aspect-[4/5]">
            <Image
              key={activeImage.id}
              src={activeImage.image_url}
              alt={activeImage.alt_text || title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
              priority
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/50 via-black/10 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/88 px-3 py-2 text-sm font-medium text-neutral-900 backdrop-blur">
              <Expand className="h-4 w-4" />
              Voir en grand
            </span>

            <span className="text-xs uppercase tracking-[0.24em] text-white/80">
              {activeIndex + 1} / {images.length}
            </span>
          </div>
        </button>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={clsx(
                  "relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl border bg-[#efe8dc] transition duration-300",
                  index === activeIndex
                    ? "border-black shadow-[0_10px_30px_rgba(15,23,42,0.12)]"
                    : "border-black/10 opacity-75 hover:opacity-100"
                )}
                aria-label={`Afficher l’image ${index + 1}`}
              >
                <Image
                  src={image.image_url}
                  alt={image.alt_text || `${title} ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        images={lightboxImages}
        initialIndex={activeIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}