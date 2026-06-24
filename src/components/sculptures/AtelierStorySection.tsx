// src/components/sculptures/AtelierStorySection.tsx

import Image from "next/image";
import type { ArtworkStoryImage } from "@/types/artwork";

type Props = {
  storyTitle: string;
  storyContent: string;
  storyVideoUrl: string | null;
  storyImages?: ArtworkStoryImage[] | null;
};

function getEmbedUrl(url: string): string | null {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;
}

export default function AtelierStorySection({
  storyTitle,
  storyContent,
  storyVideoUrl,
  storyImages,
}: Props) {
  const safeImages = storyImages ?? [];
  const hasContent =
    storyTitle || storyContent || storyVideoUrl || safeImages.length > 0;

  if (!hasContent) return null;

  const embedUrl = storyVideoUrl ? getEmbedUrl(storyVideoUrl) : null;

  return (
    <section className="mt-20 md:mt-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-black/[0.07]" />
          <span className="text-[11px] uppercase tracking-[0.32em] text-neutral-400">
            Atelier
          </span>
          <div className="h-px flex-1 bg-black/[0.07]" />
        </div>

        {(storyTitle || storyContent) && (
          <div className="mb-10 max-w-2xl">
            {storyTitle && (
              <h2 className="text-2xl font-medium tracking-[-0.04em] text-[#181512] md:text-3xl">
                {storyTitle}
              </h2>
            )}
            {storyContent && (
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-neutral-600 md:text-[17px]">
                {storyContent}
              </p>
            )}
          </div>
        )}

        {/* Video embed */}
        {embedUrl && (
          <div className="mb-10 overflow-hidden rounded-[20px] shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
            <div className="relative aspect-video w-full">
              <iframe
                src={embedUrl}
                title={storyTitle || "Vidéo atelier"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        )}

        {/* Story images grid */}
        {safeImages.length > 0 && (
          <div
            className={
              safeImages.length === 1
                ? "max-w-xl"
                : safeImages.length === 2
                  ? "grid grid-cols-2 gap-4"
                  : "grid grid-cols-2 gap-4 sm:grid-cols-3"
            }
          >
            {safeImages.map((image) => (
              <div
                key={image.id}
                className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-black/[0.04] bg-[#efe8dc] shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
              >
                <Image
                  src={image.image_url}
                  alt={image.alt_text || "Atelier"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
