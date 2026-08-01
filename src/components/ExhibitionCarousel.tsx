// src/components/ExhibitionCarousel.tsx

"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export type ExhibitionCarouselImage = {
  src: string;
  alt: string;
};

type ExhibitionCarouselProps = {
  images: ExhibitionCarouselImage[];
  intervalMs?: number;
  className?: string;
  /** Aria-labels for the dot indicators, aligned by index with `images`. */
  dotLabels?: string[];
};

export default function ExhibitionCarousel({
  images,
  intervalMs = 4000,
  className,
  dotLabels,
}: ExhibitionCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (!hasMultiple || isPaused || reducedMotion) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [hasMultiple, isPaused, reducedMotion, intervalMs, images.length]);

  if (images.length === 0) return null;

  const activeImage = images[activeIndex];

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!hasMultiple) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % images.length);
    }
  }

  return (
    <div
      className={clsx(
        "relative h-[280px] w-full overflow-hidden rounded-xl border border-[color:var(--stroke-strong)] bg-paper-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
        className
      )}
      role="region"
      aria-roledescription="carousel"
      tabIndex={hasMultiple ? 0 : -1}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeImage.src}
          initial={hasMultiple ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            unoptimized
            sizes="(min-width: 768px) 640px, 100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {hasMultiple && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-espresso/55 to-transparent" />

          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={clsx(
                  "h-2 rounded-full transition-all duration-300",
                  index === activeIndex
                    ? "w-5 bg-paper-glow"
                    : "w-2 bg-paper-glow/50 hover:bg-paper-glow/80"
                )}
                aria-label={dotLabels?.[index] ?? `${index + 1}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
