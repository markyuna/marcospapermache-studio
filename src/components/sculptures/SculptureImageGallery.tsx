"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ArtworkImage } from "@/types/artwork";

type Props = {
  images: ArtworkImage[];
  title: string;
};

export default function SculptureImageGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImage = images[activeIndex];

  function goToPrevious() {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function goToNext() {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  function openLightbox(index: number) {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  }

  function closeLightbox() {
    setIsLightboxOpen(false);
  }

  useEffect(() => {
    if (!isLightboxOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        goToPrevious();
      }

      if (event.key === "ArrowRight") {
        goToNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen, images.length]);

  if (!images.length) {
    return null;
  }

  return (
    <>
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => openLightbox(activeIndex)}
          className="group relative block w-full overflow-hidden rounded-[28px] bg-[#efe8dc] text-left"
        >
          <div className="relative aspect-[4/5]">
            <Image
              key={activeImage.id}
              src={activeImage.image_url}
              alt={activeImage.alt_text || title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition duration-500 group-hover:scale-[1.015]"
              priority
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/45 via-black/10 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="text-sm font-medium text-white">
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
                className={`relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl border bg-[#efe8dc] transition ${
                  index === activeIndex
                    ? "border-black shadow-[0_10px_30px_rgba(15,23,42,0.12)]"
                    : "border-black/10 opacity-75 hover:opacity-100"
                }`}
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

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
            <div
              className="relative w-full max-w-6xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute right-2 top-2 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                aria-label="Fermer la galerie"
              >
                <X className="h-5 w-5" />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  <button
                    type="button"
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <div className="relative aspect-[4/5] max-h-[85vh] overflow-hidden rounded-[28px] bg-neutral-900">
                <Image
                  key={activeImage.id}
                  src={activeImage.image_url}
                  alt={activeImage.alt_text || title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 text-white/85">
                <p className="text-sm">
                  {activeImage.alt_text || title}
                </p>
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                  {activeIndex + 1} / {images.length}
                </p>
              </div>

              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border transition ${
                        index === activeIndex
                          ? "border-white opacity-100"
                          : "border-white/20 opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`Afficher l’image ${index + 1} dans la galerie`}
                    >
                      <Image
                        src={image.image_url}
                        alt={image.alt_text || `${title} ${index + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}