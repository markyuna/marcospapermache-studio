// src/components/about/InteriorsGallery.tsx

"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand } from "lucide-react";

import Lightbox from "@/components/ui/Lightbox";

type InteriorImage = {
  src: string;
  alt: string;
  label: string;
};

type Props = {
  livingRoom: InteriorImage;
  wall: InteriorImage;
  contemporary: InteriorImage;
  quote: string;
};

export default function InteriorsGallery({
  livingRoom,
  wall,
  contemporary,
  quote,
}: Props) {
  const images = [livingRoom, wall, contemporary];
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  function openLightbox(index: number) {
    setActiveIndex(index);
    setIsOpen(true);
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-5">
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="group relative col-span-6 overflow-hidden rounded-[1.8rem] border border-white/60 bg-white/50 shadow-[0_16px_40px_rgba(0,0,0,0.06)] backdrop-blur-sm"
          aria-label={livingRoom.alt}
        >
          <div className="relative aspect-[4/5]">
            <Image
              src={livingRoom.src}
              alt={livingRoom.alt}
              fill
              unoptimized
              sizes="(min-width: 1024px) 24vw, 46vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/30 via-transparent to-transparent" />
            <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#8f6846] backdrop-blur-md">
              {livingRoom.label}
            </div>
            <div className="pointer-events-none absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/85 text-[#4f4338] opacity-0 shadow-sm backdrop-blur transition duration-300 group-hover:opacity-100">
              <Expand className="h-4 w-4" />
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => openLightbox(1)}
          className="group relative col-span-6 overflow-hidden rounded-[1.8rem] border border-white/60 bg-white/50 shadow-[0_16px_40px_rgba(0,0,0,0.06)] backdrop-blur-sm md:mt-10"
          aria-label={wall.alt}
        >
          <div className="relative aspect-[4/5]">
            <Image
              src={wall.src}
              alt={wall.alt}
              fill
              unoptimized
              sizes="(min-width: 1024px) 24vw, 46vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/30 via-transparent to-transparent" />
            <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#8f6846] backdrop-blur-md">
              {wall.label}
            </div>
            <div className="pointer-events-none absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/85 text-[#4f4338] opacity-0 shadow-sm backdrop-blur transition duration-300 group-hover:opacity-100">
              <Expand className="h-4 w-4" />
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => openLightbox(2)}
          className="group relative col-span-12 overflow-hidden rounded-[2rem] border border-white/60 bg-white/50 shadow-[0_18px_45px_rgba(0,0,0,0.06)] backdrop-blur-sm"
          aria-label={contemporary.alt}
        >
          <div className="relative aspect-[16/7]">
            <Image
              src={contemporary.src}
              alt={contemporary.alt}
              fill
              unoptimized
              sizes="(min-width: 1024px) 50vw, 92vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/35 via-transparent to-transparent" />

            <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#8f6846] backdrop-blur-md">
              {contemporary.label}
            </div>

            <div className="pointer-events-none absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/85 text-[#4f4338] opacity-0 shadow-sm backdrop-blur transition duration-300 group-hover:opacity-100">
              <Expand className="h-4 w-4" />
            </div>

            <div className="absolute inset-x-5 bottom-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div className="max-w-lg">
                <p className="text-sm font-medium text-white/95 md:text-base">
                  {quote}
                </p>
              </div>
            </div>
          </div>
        </button>
      </div>

      <Lightbox
        images={images}
        initialIndex={activeIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
