// src/components/sculptures/AtelierCarousel.tsx

"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type {
  FocusEvent as ReactFocusEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { useTranslations } from "next-intl";
import { Pause, Play, Plus } from "lucide-react";

import Lightbox from "@/components/ui/Lightbox";
import type { ArtworkStoryImage } from "@/types/artwork";

type Props = {
  images: ArtworkStoryImage[];
};

/** Pixels the pointer must travel before a press becomes a drag. */
const DRAG_THRESHOLD = 6;
/** Delay before auto-scroll resumes after a touch interaction. */
const TOUCH_RESUME_DELAY_MS = 1800;
/** Max content width of the page, used to align the first card. */
const CONTENT_MAX_WIDTH = 1200;

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

function wrap(value: number, length: number) {
  return ((value % length) + length) % length;
}

/** Auto-scroll speed in px/s, slightly faster on wide screens. */
function getBaseSpeed(viewportWidth: number) {
  return Math.min(60, Math.max(32, viewportWidth * 0.045));
}

type DragState = {
  pointerId: number;
  pointerType: string;
  startX: number;
  startOffset: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  moved: boolean;
};

export default function AtelierCarousel({ images }: Props) {
  const t = useTranslations("SculptureDetailPage.atelier");

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);

  const [copies, setCopies] = useState(2);
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Autoplay is on by default, unless the visitor asked the OS for reduced motion.
  const isPlaying = userPlaying ?? !prefersReducedMotion;

  // Animation state lives in refs so the rAF loop never re-renders React.
  const offsetRef = useRef(0);
  const speedRef = useRef(0);
  const inertiaRef = useRef(0);
  const setWidthRef = useRef(0);
  const viewportWidthRef = useRef(0);
  const hasAlignedRef = useRef(false);

  const playingRef = useRef(isPlaying);
  const hoverRef = useRef(false);
  const keyboardFocusRef = useRef(false);
  const pressRef = useRef(false);
  const lightboxOpenRef = useRef(false);
  const resumeAtRef = useRef(0);

  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    lightboxOpenRef.current = lightboxIndex !== null;
  }, [lightboxIndex]);

  const lightboxImages = useMemo(
    () =>
      images.map((image, index) => ({
        src: image.image_url,
        alt: image.alt_text || t("imageAlt", { index: index + 1 }),
      })),
    [images, t]
  );

  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    const setWidth = setWidthRef.current;
    if (!track || setWidth <= 0) return;

    offsetRef.current = wrap(offsetRef.current, setWidth);
    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  }, []);

  // Measure one set of images and render enough copies to always fill the viewport.
  useEffect(() => {
    const viewport = viewportRef.current;
    const firstSet = firstSetRef.current;
    if (!viewport || !firstSet) return;

    const measure = () => {
      const setWidth = firstSet.offsetWidth;
      const viewportWidth = viewport.clientWidth;
      if (setWidth <= 0 || viewportWidth <= 0) return;

      const previousSetWidth = setWidthRef.current;
      setWidthRef.current = setWidth;
      viewportWidthRef.current = viewportWidth;

      if (!hasAlignedRef.current) {
        // Start with the first card aligned to the page content edge.
        const inset = Math.max(16, (viewportWidth - CONTENT_MAX_WIDTH) / 2 + 24);
        offsetRef.current = wrap(-inset, setWidth);
        hasAlignedRef.current = true;
      } else if (previousSetWidth > 0 && previousSetWidth !== setWidth) {
        // Keep the same relative position when cards resize.
        offsetRef.current = (offsetRef.current / previousSetWidth) * setWidth;
      }

      setCopies(Math.max(2, Math.ceil(viewportWidth / setWidth) + 1));
      applyTransform();
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(firstSet);

    return () => observer.disconnect();
  }, [applyTransform, images.length]);

  // Animation loop — only runs while the carousel is on screen.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let frame = 0;
    let lastTime = 0;

    const tick = (now: number) => {
      const deltaSeconds = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0;
      lastTime = now;

      if (!dragRef.current?.moved) {
        const shouldRun =
          playingRef.current &&
          !hoverRef.current &&
          !keyboardFocusRef.current &&
          !pressRef.current &&
          !lightboxOpenRef.current &&
          now >= resumeAtRef.current;

        const targetSpeed = shouldRun ? getBaseSpeed(viewportWidthRef.current) : 0;

        // Ease in/out of the auto-scroll instead of stopping abruptly.
        speedRef.current +=
          (targetSpeed - speedRef.current) * Math.min(1, deltaSeconds * 4);
        offsetRef.current += speedRef.current * deltaSeconds;

        // Momentum after a swipe / drag.
        if (Math.abs(inertiaRef.current) > 4) {
          offsetRef.current += inertiaRef.current * deltaSeconds;
          inertiaRef.current *= Math.exp(-deltaSeconds * 4);
        } else {
          inertiaRef.current = 0;
        }
      }

      applyTransform();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame) return;
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "100px 0px" }
    );
    observer.observe(viewport);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [applyTransform]);

  function handlePointerEnter(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch") hoverRef.current = true;
  }

  function handlePointerLeave(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch") hoverRef.current = false;
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    suppressClickRef.current = false;
    inertiaRef.current = 0;
    pressRef.current = true;

    dragRef.current = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startX: event.clientX,
      startOffset: offsetRef.current,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      moved: false,
    };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;

    if (!drag.moved) {
      if (Math.abs(deltaX) < DRAG_THRESHOLD) return;
      drag.moved = true;
      speedRef.current = 0;
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    offsetRef.current = drag.startOffset - deltaX;

    const elapsed = event.timeStamp - drag.lastTime;
    if (elapsed > 0) {
      const instantVelocity = (-(event.clientX - drag.lastX) / elapsed) * 1000;
      drag.velocity = drag.velocity * 0.6 + instantVelocity * 0.4;
    }
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
  }

  function endPress(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (drag.moved) {
      suppressClickRef.current = true;
      inertiaRef.current = Math.max(-2400, Math.min(2400, drag.velocity));
    }

    if (drag.pointerType !== "mouse") {
      resumeAtRef.current = performance.now() + TOUCH_RESUME_DELAY_MS;
    }

    pressRef.current = false;
    dragRef.current = null;
  }

  // A drag must not be interpreted as a click on the card under the pointer.
  function handleClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  function handleFocus(event: ReactFocusEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches(":focus-visible")) {
      return;
    }

    keyboardFocusRef.current = true;

    // Bring the focused card into view when tabbing through the carousel.
    const viewport = viewportRef.current;
    if (!viewport) return;

    const cardRect = target.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const isFullyVisible =
      cardRect.left >= viewportRect.left && cardRect.right <= viewportRect.right;

    if (!isFullyVisible) {
      offsetRef.current +=
        cardRect.left - viewportRect.left - (viewportRect.width - cardRect.width) / 2;
      inertiaRef.current = 0;
      applyTransform();
    }
  }

  function handleBlur(event: ReactFocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      keyboardFocusRef.current = false;
    }
  }

  function openImage(index: number) {
    setLightboxIndex(index);
  }

  function renderCard(image: ArtworkStoryImage, index: number, isClone: boolean) {
    return (
      <button
        key={`${image.id}-${isClone ? "clone" : "main"}`}
        type="button"
        tabIndex={isClone ? -1 : 0}
        onClick={() => openImage(index)}
        aria-label={t("openImage", { index: index + 1, total: images.length })}
        className="group relative aspect-[4/5] w-[72vw] shrink-0 cursor-zoom-in overflow-hidden rounded-[28px] bg-[#efe8dc] shadow-[0_18px_40px_rgba(40,28,15,0.10)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#181512]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f6f1ea] sm:w-[44vw] md:w-[320px] md:hover:-translate-y-1.5 md:hover:shadow-[0_28px_60px_rgba(40,28,15,0.18)] lg:w-[380px]"
      >
        <Image
          src={image.image_url}
          alt={image.alt_text || t("imageAlt", { index: index + 1 })}
          fill
          unoptimized
          draggable={false}
          sizes="(max-width: 640px) 72vw, (max-width: 768px) 44vw, 380px"
          className="pointer-events-none select-none object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />

        <span
          aria-hidden="true"
          className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[#181512] shadow-[0_6px_18px_rgba(0,0,0,0.15)] backdrop-blur-md transition-transform duration-300 group-hover:scale-110"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </button>
    );
  }

  if (images.length === 0) return null;

  // A single photo doesn't need to loop: show it as one card.
  if (images.length === 1) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        {renderCard(images[0], 0, false)}
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex ?? 0}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
        />
      </div>
    );
  }

  return (
    <div className="-mt-6">
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={t("carouselLabel")}
        className="relative w-full touch-pan-y select-none overflow-x-clip py-8 [-webkit-mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPress}
        onPointerCancel={endPress}
        onClickCapture={handleClickCapture}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {Array.from({ length: copies }, (_, copyIndex) => (
            <div
              key={copyIndex}
              ref={copyIndex === 0 ? firstSetRef : undefined}
              aria-hidden={copyIndex === 0 ? undefined : true}
              className="flex shrink-0 gap-4 pr-4 md:gap-6 md:pr-6"
            >
              {images.map((image, index) => renderCard(image, index, copyIndex !== 0))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-[1200px] justify-end px-4 md:px-6">
        <button
          type="button"
          onClick={() => setUserPlaying(!isPlaying)}
          aria-label={isPlaying ? t("pause") : t("play")}
          title={isPlaying ? t("pause") : t("play")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.06] text-[#181512] transition-colors duration-300 hover:bg-black/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#181512]/60"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" fill="currentColor" strokeWidth={0} />
          ) : (
            <Play className="ml-0.5 h-4 w-4" fill="currentColor" strokeWidth={0} />
          )}
        </button>
      </div>

      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </div>
  );
}
