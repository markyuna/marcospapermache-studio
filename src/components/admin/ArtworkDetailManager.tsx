"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Save,
  Star,
  Trash2,
  Upload,
} from "lucide-react";

type ArtworkImage = {
  id: string;
  artwork_id: string;
  storage_path: string | null;
  image_url: string;
  alt_text: string | null;
  position: number | null;
  is_cover: boolean;
  created_at: string;
};

type Artwork = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  year: number | null;
  description: string | null;
  subtitle: string | null;
  dimensions: string | null;
  price: string | null;
  materials: string | null;
  availability: string | null;
  etsy_url: string | null;
  is_featured: boolean | null;
  created_at?: string;
  artwork_images: ArtworkImage[];
};

type Props = {
  artwork: Artwork;
};

type ApiSuccess<T = unknown> = {
  success: true;
  data?: T;
  [key: string]: unknown;
};

type ApiError = {
  error?: string;
  message?: string;
  [key: string]: unknown;
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

async function parseApiResponse<T = ApiSuccess>(
  response: Response,
  fallbackMessage: string
): Promise<T> {
  const rawText = await response.text();

  let parsed: T | ApiError | null = null;

  if (rawText) {
    try {
      parsed = JSON.parse(rawText) as T | ApiError;
    } catch {
      throw new Error(
        "Le serveur a renvoyé une réponse invalide. Vérifie que la route API existe bien et retourne du JSON."
      );
    }
  }

  if (!response.ok) {
    const apiError =
      parsed &&
      typeof parsed === "object" &&
      ("error" in parsed || "message" in parsed)
        ? (parsed as ApiError)
        : null;

    throw new Error(apiError?.error || apiError?.message || fallbackMessage);
  }

  return (parsed ?? ({ success: true } as T)) as T;
}

function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ArtworkDetailManager({ artwork }: Props) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState(artwork.title);
  const [slug, setSlug] = useState(artwork.slug);
  const [category, setCategory] = useState(artwork.category ?? "");
  const [year, setYear] = useState(artwork.year?.toString() ?? "");
  const [subtitle, setSubtitle] = useState(artwork.subtitle ?? "");
  const [description, setDescription] = useState(artwork.description ?? "");
  const [dimensions, setDimensions] = useState(artwork.dimensions ?? "");
  const [price, setPrice] = useState(artwork.price ?? "");
  const [materials, setMaterials] = useState(artwork.materials ?? "");
  const [availability, setAvailability] = useState(artwork.availability ?? "");
  const [etsyUrl, setEtsyUrl] = useState(artwork.etsy_url ?? "");
  const [isFeatured, setIsFeatured] = useState(Boolean(artwork.is_featured));

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [isSavingArtwork, setIsSavingArtwork] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [processingImageId, setProcessingImageId] = useState<string | null>(
    null
  );
  const [isDeletingArtwork, setIsDeletingArtwork] = useState(false);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sortedImages = useMemo(() => {
    return [...artwork.artwork_images].sort((a, b) => {
      const posA = a.position ?? 9999;
      const posB = b.position ?? 9999;
      return posA - posB;
    });
  }, [artwork.artwork_images]);

  const coverImage = useMemo(() => {
    return sortedImages.find((image) => image.is_cover) ?? sortedImages[0] ?? null;
  }, [sortedImages]);

  const isBusy =
    isSavingArtwork ||
    isUploading ||
    isDeletingArtwork ||
    Boolean(processingImageId) ||
    isRefreshing;

  function refreshPage() {
    startTransition(() => {
      router.refresh();
    });
  }

  function resetMessages() {
    setFeedback(null);
    setErrorMessage(null);
  }

  function clearSelectedFiles() {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug.trim() || slug === normalizeSlug(title)) {
      setSlug(normalizeSlug(value));
    }
  }

  async function handleSaveArtwork(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    const trimmedTitle = title.trim();
    const trimmedSlug = normalizeSlug(slug);
    const trimmedCategory = category.trim();
    const trimmedSubtitle = subtitle.trim();
    const trimmedDescription = description.trim();
    const trimmedDimensions = dimensions.trim();
    const trimmedPrice = price.trim();
    const trimmedMaterials = materials.trim();
    const trimmedAvailability = availability.trim();
    const trimmedEtsyUrl = etsyUrl.trim();

    const parsedYear = year.trim() ? Number(year) : null;

    if (!trimmedTitle) {
      setErrorMessage("Le titre est requis.");
      return;
    }

    if (!trimmedSlug) {
      setErrorMessage("Le slug est requis.");
      return;
    }

    if (year.trim() && (!Number.isInteger(parsedYear) || parsedYear <= 0)) {
      setErrorMessage("L’année doit être un nombre valide.");
      return;
    }

    if (
      trimmedEtsyUrl &&
      !/^https?:\/\/.+/i.test(trimmedEtsyUrl)
    ) {
      setErrorMessage("L’URL Etsy doit être une URL valide.");
      return;
    }

    try {
      setIsSavingArtwork(true);

      const response = await fetch(`/api/admin/artworks/${artwork.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          slug: trimmedSlug,
          category: trimmedCategory || null,
          year: parsedYear,
          subtitle: trimmedSubtitle || null,
          description: trimmedDescription || null,
          dimensions: trimmedDimensions || null,
          price: trimmedPrice || null,
          materials: trimmedMaterials || null,
          availability: trimmedAvailability || null,
          etsy_url: trimmedEtsyUrl || null,
          is_featured: isFeatured,
        }),
      });

      await parseApiResponse(response, "Impossible de mettre à jour l’œuvre.");

      setSlug(trimmedSlug);
      setFeedback("Œuvre mise à jour avec succès.");
      refreshPage();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Une erreur est survenue lors de la mise à jour."
        )
      );
    } finally {
      setIsSavingArtwork(false);
    }
  }

  async function handleUploadImages(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    if (selectedFiles.length === 0) {
      setErrorMessage("Sélectionne au moins une image.");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(`/api/admin/artworks/${artwork.id}/images`, {
        method: "POST",
        body: formData,
      });

      await parseApiResponse(response, "Impossible d’ajouter les images.");

      clearSelectedFiles();
      setFeedback("Images ajoutées avec succès.");
      refreshPage();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Une erreur est survenue pendant l’upload.")
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSetCover(imageId: string) {
    resetMessages();

    try {
      setProcessingImageId(imageId);

      const response = await fetch(
        `/api/admin/artworks/${artwork.id}/images/${imageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "set-cover",
          }),
        }
      );

      await parseApiResponse(
        response,
        "Impossible de définir cette image comme cover."
      );

      setFeedback("Image de couverture mise à jour.");
      refreshPage();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Une erreur est survenue."));
    } finally {
      setProcessingImageId(null);
    }
  }

  async function handleDeleteImage(imageId: string) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette image ?"
    );

    if (!confirmed) return;

    resetMessages();

    try {
      setProcessingImageId(imageId);

      const response = await fetch(
        `/api/admin/artworks/${artwork.id}/images/${imageId}`,
        {
          method: "DELETE",
        }
      );

      await parseApiResponse(response, "Impossible de supprimer l’image.");

      setFeedback("Image supprimée avec succès.");
      refreshPage();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Une erreur est survenue."));
    } finally {
      setProcessingImageId(null);
    }
  }

  async function handleDeleteArtwork() {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette œuvre et toutes ses images ?"
    );

    if (!confirmed) return;

    resetMessages();

    try {
      setIsDeletingArtwork(true);

      const response = await fetch(`/api/admin/artworks/${artwork.id}`, {
        method: "DELETE",
      });

      await parseApiResponse(response, "Impossible de supprimer l’œuvre.");

      router.push("/admin/artworks");
      router.refresh();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Une erreur est survenue."));
    } finally {
      setIsDeletingArtwork(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href="/admin/artworks"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la galerie admin
            </Link>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
              {title.trim() || artwork.title}
            </h1>

            {subtitle.trim() ? (
              <p className="mt-2 max-w-3xl text-sm text-neutral-600">
                {subtitle}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-2 text-sm text-neutral-600">
              <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-black/5">
                Slug: {slug || artwork.slug}
              </span>

              {(category || artwork.category) ? (
                <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-black/5">
                  Catégorie: {category || artwork.category}
                </span>
              ) : null}

              {(year || artwork.year) ? (
                <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-black/5">
                  Année: {year || artwork.year}
                </span>
              ) : null}

              {isFeatured ? (
                <span className="rounded-full bg-amber-400 px-3 py-1 text-neutral-900 shadow-sm ring-1 ring-amber-300/70">
                  Featured
                </span>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={handleDeleteArtwork}
            disabled={isDeletingArtwork || isBusy}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeletingArtwork ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Supprimer l’œuvre
          </button>
        </div>

        {(feedback || errorMessage) && (
          <div className="mb-6 space-y-3">
            {feedback ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {feedback}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}
          </div>
        )}

        <div className="mb-8 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f6efe5]">
              <Save className="h-5 w-5 text-neutral-900" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-neutral-950">
                Modifier l’œuvre
              </h2>
              <p className="text-sm text-neutral-500">
                Modifie ici les informations principales, artistiques et commerciales.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveArtwork} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Titre
              </label>
              <input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                disabled={isBusy}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Titre de l’œuvre"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Slug
              </label>
              <input
                value={slug}
                onChange={(e) => setSlug(normalizeSlug(e.target.value))}
                disabled={isBusy}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="slug-de-l-oeuvre"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-neutral-700">
                Sous-titre
              </label>
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                disabled={isBusy}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Sculpture murale contemporaine"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Catégorie
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isBusy}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Sculpture murale"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Année
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={isBusy}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="2025"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Dimensions
              </label>
              <input
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                disabled={isBusy}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="50 x 70 cm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Prix
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isBusy}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="2000 €"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-neutral-700">
                Matériaux
              </label>
              <input
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                disabled={isBusy}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Papier mâché, carton recyclé, capsules..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Disponibilité
              </label>
              <input
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                disabled={isBusy}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Disponible sur demande"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                URL Etsy
              </label>
              <input
                type="url"
                value={etsyUrl}
                onChange={(e) => setEtsyUrl(e.target.value)}
                disabled={isBusy}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="https://markpaper.etsy.com/..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-[#fcfaf7] px-4 py-3">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  disabled={isBusy}
                  className="h-4 w-4 rounded border-neutral-300"
                />
                <span className="text-sm font-medium text-neutral-700">
                  Marquer comme œuvre mise en avant
                </span>
              </label>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-neutral-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                disabled={isBusy}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Description de l’œuvre"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isBusy}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingArtwork ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>

        <div className="mb-8 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f6efe5]">
              <Plus className="h-5 w-5 text-neutral-800" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-950">
                Ajouter des images
              </h2>
              <p className="text-sm text-neutral-500">
                Ajoute une ou plusieurs images à cette œuvre.
              </p>
            </div>
          </div>

          <form onSubmit={handleUploadImages} className="space-y-4">
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-[#fcfaf7] p-5">
              <label className="mb-3 block text-sm font-medium text-neutral-700">
                Sélectionner des images
              </label>

              <input
                ref={fileInputRef}
                type="file"
                name="images"
                accept="image/*"
                multiple
                disabled={isBusy}
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  setSelectedFiles(files);
                }}
                className="block w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-700 file:mr-4 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-3 text-xs text-neutral-500">
                Tu peux sélectionner plusieurs fichiers à la fois.
              </p>

              {selectedFiles.length > 0 ? (
                <div className="mt-4 rounded-xl bg-white p-3 ring-1 ring-black/5">
                  <p className="text-sm font-medium text-neutral-800">
                    {selectedFiles.length} fichier
                    {selectedFiles.length > 1 ? "s sélectionnés" : " sélectionné"}
                  </p>

                  <div className="mt-2 space-y-1 text-xs text-neutral-500">
                    {selectedFiles.map((file) => (
                      <div key={`${file.name}-${file.size}`}>{file.name}</div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isBusy || selectedFiles.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Ajouter les images
            </button>
          </form>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
              {coverImage ? (
                <Image
                  src={coverImage.image_url}
                  alt={coverImage.alt_text || title || artwork.title}
                  width={1600}
                  height={1200}
                  className="h-auto w-full object-cover"
                  priority
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center text-sm text-neutral-400">
                  Aucune image disponible
                </div>
              )}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {(subtitle || dimensions || price || availability || materials) ? (
                <>
                  {subtitle ? (
                    <div className="rounded-2xl bg-[#fcfaf7] p-4 ring-1 ring-black/5">
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                        Sous-titre
                      </p>
                      <p className="mt-2 text-sm text-neutral-700">{subtitle}</p>
                    </div>
                  ) : null}

                  {dimensions ? (
                    <div className="rounded-2xl bg-[#fcfaf7] p-4 ring-1 ring-black/5">
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                        Dimensions
                      </p>
                      <p className="mt-2 text-sm text-neutral-700">{dimensions}</p>
                    </div>
                  ) : null}

                  {price ? (
                    <div className="rounded-2xl bg-[#fcfaf7] p-4 ring-1 ring-black/5">
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                        Prix
                      </p>
                      <p className="mt-2 text-sm text-neutral-700">{price}</p>
                    </div>
                  ) : null}

                  {availability ? (
                    <div className="rounded-2xl bg-[#fcfaf7] p-4 ring-1 ring-black/5">
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                        Disponibilité
                      </p>
                      <p className="mt-2 text-sm text-neutral-700">
                        {availability}
                      </p>
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>

            {materials ? (
              <div className="mt-4 rounded-2xl bg-[#fcfaf7] p-4 ring-1 ring-black/5">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                  Matériaux
                </p>
                <p className="mt-2 text-sm leading-7 text-neutral-700">{materials}</p>
              </div>
            ) : null}

            {(description || artwork.description) ? (
              <div className="mt-4 rounded-2xl bg-[#fcfaf7] p-4 text-sm leading-7 text-neutral-700 ring-1 ring-black/5">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-400">
                  Description
                </p>
                {description || artwork.description}
              </div>
            ) : null}

            {etsyUrl ? (
              <div className="mt-4">
                <a
                  href={etsyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:border-black hover:text-black"
                >
                  Voir l’annonce Etsy
                </a>
              </div>
            ) : null}
          </section>

          <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-950">
                Images de l’œuvre
              </h2>

              <span className="rounded-full bg-[#f6efe5] px-3 py-1 text-xs font-medium text-neutral-700">
                {artwork.artwork_images.length} image
                {artwork.artwork_images.length > 1 ? "s" : ""}
              </span>
            </div>

            {artwork.artwork_images.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-12 text-center text-sm text-neutral-500">
                Cette œuvre n’a pas encore d’images.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {sortedImages.map((image) => {
                  const isCurrentImageProcessing = processingImageId === image.id;

                  return (
                    <article
                      key={image.id}
                      className="overflow-hidden rounded-2xl border border-black/5 bg-[#fffdf9] shadow-sm"
                    >
                      <div className="relative aspect-[4/3] bg-neutral-100">
                        <Image
                          src={image.image_url}
                          alt={image.alt_text || title || artwork.title}
                          fill
                          className="object-cover"
                        />

                        {image.is_cover ? (
                          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-2.5 py-1 text-xs font-semibold text-neutral-900 shadow">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            Cover
                          </div>
                        ) : null}
                      </div>

                      <div className="space-y-3 p-4">
                        <div className="text-xs text-neutral-500">
                          Position: {image.position ?? "—"}
                        </div>

                        <div className="text-xs text-neutral-500">
                          Alt: {image.alt_text || "—"}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {!image.is_cover ? (
                            <button
                              type="button"
                              onClick={() => handleSetCover(image.id)}
                              disabled={isBusy}
                              className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isCurrentImageProcessing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Star className="h-4 w-4" />
                              )}
                              Définir comme cover
                            </button>
                          ) : (
                            <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3.5 py-2 text-sm font-medium text-amber-700 ring-1 ring-amber-200">
                              <Star className="h-4 w-4 fill-current" />
                              Image de couverture
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteImage(image.id)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isCurrentImageProcessing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}