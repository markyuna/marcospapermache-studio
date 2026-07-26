// src/components/sculptures/SculptureImageGallery.tsx

"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
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

  const safeActiveIndex =
    images.length === 0 ? 0 : Math.min(activeIndex, images.length - 1);

  const activeImage = images[safeActiveIndex];

  const lightboxImages = useMemo(
    () =>
      images.map((image, index) => ({
        src: image.image_url,
        alt: image.alt_text || `${title} ${index + 1}`,
      })),
    [images, title]
  );

  function openLightbox(index: number) {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  }

  function handleSelectImage(index: number) {
    setActiveIndex(index);
  }

  function handlePrev(e: React.MouseEvent) {
    e.stopPropagation();
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  }

  function handleNext(e: React.MouseEvent) {
    e.stopPropagation();
    setActiveIndex((i) => (i + 1) % images.length);
  }

  if (!images.length || !activeImage) {
    return null;
  }

  const hasMultiple = images.length > 1;

  return (
    <>
      <div className="space-y-4">
        {/* Main image */}
        <div className="group relative overflow-hidden rounded-[24px] border border-black/[0.04] bg-[#efe8dc] shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <button
            type="button"
            onClick={() => openLightbox(safeActiveIndex)}
            className="relative block w-full text-left"
            aria-label={`Ouvrir l'image de ${title} en grand`}
          >
            <div className="relative w-full aspect-[4/5]">
              <Image
                key={activeImage.id}
                src={activeImage.image_url}
                alt={activeImage.alt_text || title}
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#181512]/28 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

            {/* Expand + counter */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/88 px-3 py-1.5 text-xs font-medium text-neutral-900 backdrop-blur-md">
                <Expand className="h-3.5 w-3.5" />
                Voir en grand
              </span>

              {hasMultiple && (
                <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/85 backdrop-blur-sm">
                  {safeActiveIndex + 1} / {images.length}
                </span>
              )}
            </div>
          </button>

          {/* Arrow buttons */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Image précédente"
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/80 text-neutral-700 shadow-md backdrop-blur-sm transition duration-200 hover:bg-white hover:text-neutral-900 hover:shadow-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Image suivante"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/80 text-neutral-700 shadow-md backdrop-blur-sm transition duration-200 hover:bg-white hover:text-neutral-900 hover:shadow-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {hasMultiple && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => handleSelectImage(index)}
                className={clsx(
                  "relative h-16 w-14 shrink-0 overflow-hidden rounded-xl border bg-[#efe8dc] transition duration-300",
                  index === safeActiveIndex
                    ? "border-black/70 opacity-100 shadow-[0_6px_18px_rgba(0,0,0,0.12)]"
                    : "border-black/10 opacity-60 hover:opacity-90"
                )}
                aria-label={`Afficher l'image ${index + 1}`}
                aria-pressed={index === safeActiveIndex ? "true" : "false"}
              >
                <Image
                  src={image.image_url}
                  alt={image.alt_text || `${title} ${index + 1}`}
                  fill
                  unoptimized
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        images={lightboxImages}
        initialIndex={safeActiveIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}
