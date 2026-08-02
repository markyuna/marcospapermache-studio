// src/components/sculptures/AtelierStorySection.tsx

import Image from "next/image";
import type { ArtworkStoryImage } from "@/types/artwork";

type Props = {
  storyTitle: string;
  storyContent: string;
  storyVideoUrl: string | null;
  storyImages?: ArtworkStoryImage[] | null;
};

const COLLAGE_SPAN_CLASSES = [
  "col-span-2 md:col-span-2 md:row-span-3",
  "md:col-span-2 md:row-span-2",
  "md:row-span-2",
  "md:row-span-2",
  "md:col-span-2",
  "",
];

const COLLAGE_ROTATION_CLASSES = [
  "md:-rotate-2",
  "md:rotate-[1.5deg]",
  "md:-rotate-[1.5deg]",
  "md:rotate-2",
];

function getCollageSpanClasses(index: number): string {
  return COLLAGE_SPAN_CLASSES[index % COLLAGE_SPAN_CLASSES.length];
}

function getCollageRotationClasses(index: number): string {
  return COLLAGE_ROTATION_CLASSES[index % COLLAGE_ROTATION_CLASSES.length];
}

function getEmbedUrl(url: string): { url: string; isYoutube: boolean } | null {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/
  );
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    const params = new URLSearchParams({
      autoplay: "1",
      loop: "1",
      playlist: videoId,
      controls: "0",
      mute: "1",
      modestbranding: "1",
      rel: "0",
      showinfo: "0",
      iv_load_policy: "3",
      disablekb: "1",
    });
    return {
      url: `https://www.youtube.com/embed/${videoId}?${params.toString()}`,
      isYoutube: true,
    };
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      url: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      isYoutube: false,
    };
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
                src={embedUrl.url}
                title={storyTitle || "Vidéo atelier"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
              {embedUrl.isYoutube && (
                <div className="absolute inset-0" aria-hidden="true" />
              )}
            </div>
          </div>
        )}

        {/* Story images collage */}
        {safeImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4 [grid-auto-flow:dense] [grid-auto-rows:110px] md:grid-cols-4 md:gap-5 md:[grid-auto-rows:130px]">
            {safeImages.map((image, index) => (
              <div
                key={image.id}
                className={`group relative overflow-hidden rounded-xl bg-[#efe8dc] shadow-md transition-transform duration-300 hover:z-10 hover:rotate-0 hover:scale-[1.02] hover:shadow-xl cursor-pointer ${getCollageSpanClasses(index)} ${getCollageRotationClasses(index)}`}
              >
                <Image
                  src={image.image_url}
                  alt={image.alt_text || "Atelier"}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 400px"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
