"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  title: string;
};

export default function ImageGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);

  const mainImage = images?.[active] ?? "/placeholder.png";

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-black/5">
        <Image
          src={mainImage}
          alt={title}
          fill
          className="object-cover transition duration-500"
        />
      </div>

      {/* Miniaturas */}
      <div className="flex gap-3 overflow-x-auto">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border transition 
              ${active === index ? "border-black" : "border-transparent opacity-70 hover:opacity-100"}`}
          >
            <Image
              src={img}
              alt={`${title}-${index}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}