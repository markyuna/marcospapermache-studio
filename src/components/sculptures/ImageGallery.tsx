"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

type ImageGalleryProps = {
  images: string[];
  title: string;
};

export default function ImageGallery({
  images,
  title,
}: ImageGalleryProps) {
  const safeImages = images.length > 0 ? images : ["/placeholder.png"];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const activeImage = safeImages[activeIndex] ?? safeImages[0];

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") goToPrevious();
      if (event.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, safeImages.length]);

  return (
    <>
      <div className="space-y-4">
        <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => openLightbox(activeIndex)}
            className="relative h-full w-full cursor-zoom-in"
            aria-label={`Ouvrir l’image principale de ${title} en plein écran`}
          >
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <Image
                    src={activeImage}
                    alt={title}
                    fill
                    priority
                    className="object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

            <div className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-xs font-medium text-neutral-900 opacity-0 shadow-sm backdrop-blur transition duration-300 group-hover:opacity-100">
              <Expand className="h-4 w-4" />
              Plein écran
            </div>
          </button>
        </div>

        {safeImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {safeImages.map((image, index) => (
              <button
                key={`${title}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={clsx(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-white transition",
                  activeIndex === index
                    ? "border-neutral-900 shadow-sm ring-1 ring-neutral-900/10"
                    : "border-black/10 opacity-70 hover:opacity-100"
                )}
                aria-label={`Voir l’image ${index + 1} de ${title}`}
              >
                <Image
                  src={image}
                  alt={`${title} - vue ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={`Galerie plein écran de ${title}`}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute inset-0 h-full w-full cursor-default"
            aria-label="Fermer la galerie"
          />

          <div className="relative z-[101] flex h-full w-full items-center justify-center px-4 py-6 md:px-10">
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition hover:bg-white/15 md:right-6 md:top-6"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>

            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition hover:bg-white/15 md:left-6"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition hover:bg-white/15 md:right-6"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <div className="relative z-[102] mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center">
              <div className="relative h-[70vh] w-full overflow-hidden rounded-3xl md:h-[78vh]">
                <Image
                  src={safeImages[activeIndex]}
                  alt={`${title} - vue ${activeIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>

              <div className="mt-4 flex w-full max-w-5xl items-center justify-between gap-4 text-white/90">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-white/50">
                    Galerie
                  </p>
                  <h3 className="mt-1 text-lg font-medium">{title}</h3>
                </div>

                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                  {activeIndex + 1} / {safeImages.length}
                </div>
              </div>

              {safeImages.length > 1 && (
                <div className="mt-4 flex max-w-5xl gap-3 overflow-x-auto pb-2">
                  {safeImages.map((image, index) => (
                    <button
                      key={`lightbox-${title}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={clsx(
                        "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border transition",
                        activeIndex === index
                          ? "border-white shadow-lg"
                          : "border-white/20 opacity-60 hover:opacity-100"
                      )}
                      aria-label={`Afficher l’image ${index + 1}`}
                    >
                      <Image
                        src={image}
                        alt={`${title} miniature ${index + 1}`}
                        fill
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