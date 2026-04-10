"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import clsx from "clsx";

type LightboxImage = {
  src: string;
  alt?: string;
};

type Props = {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
};

export default function Lightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: Props) {
  const safeInitialIndex = useMemo(() => {
    if (!images.length) return 0;
    if (initialIndex < 0) return 0;
    if (initialIndex >= images.length) return images.length - 1;
    return initialIndex;
  }, [images.length, initialIndex]);

  const [sessionIndex, setSessionIndex] = useState<number | null>(null);

  const currentIndex = sessionIndex ?? safeInitialIndex;
  const image = images[currentIndex];

  function handleClose() {
    setSessionIndex(null);
    onClose();
  }

  function goToPrevious() {
    setSessionIndex((current) => {
      const baseIndex = current ?? safeInitialIndex;
      return baseIndex === 0 ? images.length - 1 : baseIndex - 1;
    });
  }

  function goToNext() {
    setSessionIndex((current) => {
      const baseIndex = current ?? safeInitialIndex;
      return baseIndex === images.length - 1 ? 0 : baseIndex + 1;
    });
  }

  function goToIndex(nextIndex: number) {
    setSessionIndex(nextIndex);
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
        return;
      }

      if (images.length > 1 && event.key === "ArrowLeft") {
        goToPrevious();
        return;
      }

      if (images.length > 1 && event.key === "ArrowRight") {
        goToNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [isOpen, images.length, safeInitialIndex]);

  if (!isOpen || !images.length || !image || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Galerie plein écran"
      onClick={handleClose}
    >
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,210,150,0.08),transparent_42%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_30%)]" />
      </div>

      <button
        type="button"
        onClick={handleClose}
        className="absolute right-4 top-4 z-[1000001] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition duration-300 hover:scale-[1.03] hover:bg-white/15 md:right-6 md:top-6"
        aria-label="Fermer la galerie"
      >
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-3 top-1/2 z-[1000001] inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition duration-300 hover:scale-[1.03] hover:bg-white/15 md:left-6"
            aria-label="Image précédente"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goToNext();
            }}
            className="absolute right-3 top-1/2 z-[1000001] inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition duration-300 hover:scale-[1.03] hover:bg-white/15 md:right-6"
            aria-label="Image suivante"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div
        className="relative z-[1000000] flex h-dvh w-full flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center">
          <div className="flex flex-1 items-center justify-center">
            <div
              className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[32px] border border-white/8 bg-white/[0.04] px-2 py-2 shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:px-4 sm:py-4 lg:px-6 lg:py-6"
              style={{ animation: "lightbox-zoom-in 0.4s ease" }}
            >
              <div className="relative h-full min-h-0 w-full">
                <Image
                  key={image.src}
                  src={image.src}
                  alt={image.alt || ""}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex w-full items-center justify-between gap-4 text-white/90">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
                Galerie
              </p>
              <h3 className="mt-1 truncate text-lg font-medium">
                {image.alt || "Image"}
              </h3>
            </div>

            <div className="shrink-0 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {images.map((thumbnail, thumbnailIndex) => (
                <button
                  key={`${thumbnail.src}-${thumbnailIndex}`}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    goToIndex(thumbnailIndex);
                  }}
                  className={clsx(
                    "relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border transition duration-300",
                    thumbnailIndex === currentIndex
                      ? "border-white opacity-100 shadow-[0_12px_30px_rgba(0,0,0,0.4)]"
                      : "border-white/15 opacity-55 hover:opacity-100"
                  )}
                  aria-label={`Afficher l’image ${thumbnailIndex + 1} dans la galerie`}
                >
                  <Image
                    src={thumbnail.src}
                    alt={thumbnail.alt || `Image ${thumbnailIndex + 1}`}
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
    </div>,
    document.body
  );
}