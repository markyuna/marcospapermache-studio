"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

type SculptureImageGalleryProps = {
  images: string[];
  title: string;
};

export default function SculptureImageGallery({
  images,
  title,
}: SculptureImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <Image
          src={selectedImage}
          alt={title}
          width={1200}
          height={1400}
          className="h-auto w-full object-cover transition duration-500"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img, index) => {
            const isActive = img === selectedImage;

            return (
              <button
                key={img}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={clsx(
                  "relative overflow-hidden rounded-[1.25rem] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition",
                  "hover:-translate-y-0.5",
                  isActive
                    ? "ring-2 ring-neutral-900"
                    : "ring-1 ring-black/5"
                )}
                aria-label={`Voir l’image ${index + 1} de ${title}`}
              >
                <Image
                  src={img}
                  alt={`${title} vue ${index + 1}`}
                  width={500}
                  height={600}
                  className="aspect-[4/5] w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}