"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import Lightbox from "@/components/ui/Lightbox";
import type { GeneratedImage } from "@/generated/prisma/client/client";

type Props = {
  images: GeneratedImage[];
};

export default function GeneratedImagesGallery({ images }: Props) {
  const t = useTranslations("AccountPage.dashboard");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-[1.25rem] border border-neutral-200 bg-paper-base"
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="relative block aspect-square w-full"
              aria-label={t("viewImage")}
            >
              <Image
                src={image.imageUrl}
                alt={image.prompt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </button>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-black/70 p-3 backdrop-blur-sm transition duration-300 group-hover:translate-y-0 group-hover:pointer-events-auto">
              <Link
                href={{
                  pathname: "/commande",
                  query: {
                    prompt: image.prompt,
                    sourceAiImageId: image.id,
                  },
                }}
                onClick={(event) => event.stopPropagation()}
                className="block w-full rounded-full bg-paper-surface px-3 py-2 text-center text-xs font-medium text-[#181512] transition hover:bg-paper-base"
              >
                {t("orderThisSculpture")}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        images={images.map((image) => ({ src: image.imageUrl, alt: image.prompt }))}
        initialIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        showDownload
        downloadLabel={t("downloadImage")}
      />
    </>
  );
}
