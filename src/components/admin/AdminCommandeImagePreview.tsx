"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ExternalLink, X, ZoomIn } from "lucide-react";

type AdminCommandeImagePreviewProps = {
  imageUrl: string;
  alt: string;
};

export default function AdminCommandeImagePreview({
  imageUrl,
  alt,
}: AdminCommandeImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Aperçu image
            </h2>
            <p className="text-sm text-neutral-500">
              Visualisation rapide du visuel envoyé
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
            >
              <ZoomIn className="h-4 w-4" />
              Voir en grand
            </button>

            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
            >
              <ExternalLink className="h-4 w-4" />
              Ouvrir l’image
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative block w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 text-left transition hover:border-orange-200"
        >
          <div className="relative h-[260px] w-full md:h-[360px] xl:h-[460px]">
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className="object-contain transition duration-300 group-hover:scale-[1.01]"
              sizes="(max-width: 1280px) 100vw, 900px"
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-black/55 via-black/20 to-transparent px-4 py-5 opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              Cliquer pour agrandir
            </span>
          </div>
        </button>
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-6xl rounded-[2rem] border border-white/10 bg-[#111111] p-3 shadow-2xl md:p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-white/80">Aperçu grand format</p>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/15"
                aria-label="Fermer l’aperçu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex max-h-[82vh] min-h-[420px] items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#0b0b0c]">
              <div className="relative h-[82vh] w-full">
                <Image
                  src={imageUrl}
                  alt={alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}