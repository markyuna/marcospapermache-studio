"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
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

type ArtworkStoryImage = {
  id: string;
  artwork_id: string;
  storage_path: string | null;
  image_url: string;
  alt_text: string | null;
  position: number;
  created_at: string;
};

type Artwork = {
  id: string;

  title: string;
  title_en: string | null;
  title_es: string | null;

  slug: string;

  category: string | null;
  category_en: string | null;
  category_es: string | null;

  year: number | null;

  description: string | null;
  description_en: string | null;
  description_es: string | null;

  subtitle: string | null;
  subtitle_en: string | null;
  subtitle_es: string | null;

  dimensions: string | null;
  price: string | null;

  materials: string | null;
  materials_en: string | null;
  materials_es: string | null;

  availability: string | null;
  availability_en: string | null;
  availability_es: string | null;

  etsy_url: string | null;
  is_featured: boolean | null;
  created_at?: string;

  story_title: string | null;
  story_title_en: string | null;
  story_title_es: string | null;
  story_content: string | null;
  story_content_en: string | null;
  story_content_es: string | null;
  story_video_url: string | null;

  artwork_images: ArtworkImage[];
  artwork_story_images: ArtworkStoryImage[];
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

function isValidHttpUrl(value: string) {
  return /^https?:\/\/.+/i.test(value);
}

function parseYearValue(value: string): number | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const parsedValue = Number(trimmedValue);

  if (
    Number.isNaN(parsedValue) ||
    !Number.isFinite(parsedValue) ||
    !Number.isInteger(parsedValue) ||
    parsedValue <= 0
  ) {
    return null;
  }

  return parsedValue;
}

export default function ArtworkDetailManager({ artwork }: Props) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const storyFileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState(artwork.title);
  const [titleEn, setTitleEn] = useState(artwork.title_en ?? "");
  const [titleEs, setTitleEs] = useState(artwork.title_es ?? "");

  const [slug, setSlug] = useState(artwork.slug);

  const [category, setCategory] = useState(artwork.category ?? "");
  const [categoryEn, setCategoryEn] = useState(artwork.category_en ?? "");
  const [categoryEs, setCategoryEs] = useState(artwork.category_es ?? "");

  const [year, setYear] = useState(artwork.year?.toString() ?? "");

  const [subtitle, setSubtitle] = useState(artwork.subtitle ?? "");
  const [subtitleEn, setSubtitleEn] = useState(artwork.subtitle_en ?? "");
  const [subtitleEs, setSubtitleEs] = useState(artwork.subtitle_es ?? "");

  const [description, setDescription] = useState(artwork.description ?? "");
  const [descriptionEn, setDescriptionEn] = useState(
    artwork.description_en ?? ""
  );
  const [descriptionEs, setDescriptionEs] = useState(
    artwork.description_es ?? ""
  );

  const [dimensions, setDimensions] = useState(artwork.dimensions ?? "");
  const [price, setPrice] = useState(artwork.price ?? "");

  const [materials, setMaterials] = useState(artwork.materials ?? "");
  const [materialsEn, setMaterialsEn] = useState(artwork.materials_en ?? "");
  const [materialsEs, setMaterialsEs] = useState(artwork.materials_es ?? "");

  const [availability, setAvailability] = useState(artwork.availability ?? "");
  const [availabilityEn, setAvailabilityEn] = useState(
    artwork.availability_en ?? ""
  );
  const [availabilityEs, setAvailabilityEs] = useState(
    artwork.availability_es ?? ""
  );

  const [etsyUrl, setEtsyUrl] = useState(artwork.etsy_url ?? "");
  const [isFeatured, setIsFeatured] = useState(Boolean(artwork.is_featured));

  const [storyTitle, setStoryTitle] = useState(artwork.story_title ?? "");
  const [storyTitleEn, setStoryTitleEn] = useState(artwork.story_title_en ?? "");
  const [storyTitleEs, setStoryTitleEs] = useState(artwork.story_title_es ?? "");
  const [storyContent, setStoryContent] = useState(artwork.story_content ?? "");
  const [storyContentEn, setStoryContentEn] = useState(artwork.story_content_en ?? "");
  const [storyContentEs, setStoryContentEs] = useState(artwork.story_content_es ?? "");
  const [storyVideoUrl, setStoryVideoUrl] = useState(artwork.story_video_url ?? "");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedStoryFiles, setSelectedStoryFiles] = useState<File[]>([]);

  const [isSavingArtwork, setIsSavingArtwork] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingStory, setIsUploadingStory] = useState(false);
  const [processingImageId, setProcessingImageId] = useState<string | null>(null);
  const [processingStoryImageId, setProcessingStoryImageId] = useState<string | null>(null);
  const [isDeletingArtwork, setIsDeletingArtwork] = useState(false);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeLang, setActiveLang] = useState<"fr" | "en" | "es">("fr");

  const sortedImages = useMemo(() => {
    return [...artwork.artwork_images].sort((a, b) => {
      if (a.is_cover !== b.is_cover) {
        return Number(b.is_cover) - Number(a.is_cover);
      }

      const posA = a.position ?? 9999;
      const posB = b.position ?? 9999;

      if (posA !== posB) {
        return posA - posB;
      }

      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  }, [artwork.artwork_images]);

  const coverImage = useMemo(() => {
    return (
      sortedImages.find((image) => image.is_cover) ?? sortedImages[0] ?? null
    );
  }, [sortedImages]);

  const imageCount = artwork.artwork_images.length;

  const isBusy =
    isSavingArtwork ||
    isUploading ||
    isUploadingStory ||
    isDeletingArtwork ||
    Boolean(processingImageId) ||
    Boolean(processingStoryImageId) ||
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

  function clearSelectedStoryFiles() {
    setSelectedStoryFiles([]);

    if (storyFileInputRef.current) {
      storyFileInputRef.current.value = "";
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
    const trimmedTitleEn = titleEn.trim();
    const trimmedTitleEs = titleEs.trim();

    const trimmedSlug = normalizeSlug(slug);

    const trimmedCategory = category.trim();
    const trimmedCategoryEn = categoryEn.trim();
    const trimmedCategoryEs = categoryEs.trim();

    const trimmedSubtitle = subtitle.trim();
    const trimmedSubtitleEn = subtitleEn.trim();
    const trimmedSubtitleEs = subtitleEs.trim();

    const trimmedDescription = description.trim();
    const trimmedDescriptionEn = descriptionEn.trim();
    const trimmedDescriptionEs = descriptionEs.trim();

    const trimmedDimensions = dimensions.trim();
    const trimmedPrice = price.trim();

    const trimmedMaterials = materials.trim();
    const trimmedMaterialsEn = materialsEn.trim();
    const trimmedMaterialsEs = materialsEs.trim();

    const trimmedAvailability = availability.trim();
    const trimmedAvailabilityEn = availabilityEn.trim();
    const trimmedAvailabilityEs = availabilityEs.trim();

    const trimmedEtsyUrl = etsyUrl.trim();
    const trimmedYear = year.trim();

    const parsedYear = parseYearValue(trimmedYear);

    if (!trimmedTitle) {
      setErrorMessage("Le titre français est requis.");
      return;
    }

    if (!trimmedSlug) {
      setErrorMessage("Le slug est requis.");
      return;
    }

    if (trimmedYear && parsedYear === null) {
      setErrorMessage("L’année doit être un nombre valide.");
      return;
    }

    if (trimmedEtsyUrl && !isValidHttpUrl(trimmedEtsyUrl)) {
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
          title_en: trimmedTitleEn || null,
          title_es: trimmedTitleEs || null,

          slug: trimmedSlug,

          category: trimmedCategory || null,
          category_en: trimmedCategoryEn || null,
          category_es: trimmedCategoryEs || null,

          year: parsedYear,

          subtitle: trimmedSubtitle || null,
          subtitle_en: trimmedSubtitleEn || null,
          subtitle_es: trimmedSubtitleEs || null,

          description: trimmedDescription || null,
          description_en: trimmedDescriptionEn || null,
          description_es: trimmedDescriptionEs || null,

          dimensions: trimmedDimensions || null,
          price: trimmedPrice || null,

          materials: trimmedMaterials || null,
          materials_en: trimmedMaterialsEn || null,
          materials_es: trimmedMaterialsEs || null,

          availability: trimmedAvailability || null,
          availability_en: trimmedAvailabilityEn || null,
          availability_es: trimmedAvailabilityEs || null,

          etsy_url: trimmedEtsyUrl || null,
          is_featured: isFeatured,

          story_title: storyTitle.trim() || null,
          story_title_en: storyTitleEn.trim() || null,
          story_title_es: storyTitleEs.trim() || null,
          story_content: storyContent.trim() || null,
          story_content_en: storyContentEn.trim() || null,
          story_content_es: storyContentEs.trim() || null,
          story_video_url: storyVideoUrl.trim() || null,
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

    if (!confirmed) {
      return;
    }

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

    if (!confirmed) {
      return;
    }

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

  async function handleUploadStoryImages(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    if (selectedStoryFiles.length === 0) {
      setErrorMessage("Sélectionne au moins une image.");
      return;
    }

    try {
      setIsUploadingStory(true);

      const formData = new FormData();
      selectedStoryFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(`/api/admin/artworks/${artwork.id}/story-images`, {
        method: "POST",
        body: formData,
      });

      await parseApiResponse(response, "Impossible d'ajouter les images d'atelier.");

      clearSelectedStoryFiles();
      setFeedback("Images d'atelier ajoutées avec succès.");
      refreshPage();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Une erreur est survenue pendant l'upload."));
    } finally {
      setIsUploadingStory(false);
    }
  }

  async function handleDeleteStoryImage(imageId: string) {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cette image d'atelier ?");
    if (!confirmed) return;

    resetMessages();

    try {
      setProcessingStoryImageId(imageId);

      const response = await fetch(
        `/api/admin/artworks/${artwork.id}/story-images/${imageId}`,
        { method: "DELETE" }
      );

      await parseApiResponse(response, "Impossible de supprimer l'image.");

      setFeedback("Image supprimée avec succès.");
      refreshPage();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Une erreur est survenue."));
    } finally {
      setProcessingStoryImageId(null);
    }
  }

  const inputCls = "w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60";
  const labelCls = "text-xs font-medium uppercase tracking-[0.1em] text-neutral-500";

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/admin/artworks"
              className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition hover:text-neutral-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Galerie admin
            </Link>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 md:text-3xl">
              {title.trim() || artwork.title}
            </h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-white px-2.5 py-1 text-xs text-neutral-500 ring-1 ring-black/5">
                {slug || artwork.slug}
              </span>
              {isFeatured ? (
                <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-medium text-neutral-900 ring-1 ring-amber-300/70">
                  Featured
                </span>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={handleDeleteArtwork}
            disabled={isBusy}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeletingArtwork ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Supprimer l’œuvre
          </button>
        </div>

        {/* Feedback */}
        {(feedback || errorMessage) ? (
          <div className="mb-5 space-y-2">
            {feedback ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</div>
            ) : null}
            {errorMessage ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
            ) : null}
          </div>
        ) : null}

        {/* Two-column layout */}
        <div className="grid gap-5 lg:grid-cols-[3fr_2fr]">

          {/* ── LEFT: Form ── */}
          <form onSubmit={handleSaveArtwork} className="space-y-4">

            {/* General info */}
            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <p className={`mb-4 ${labelCls}`}>Informations générales</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className={labelCls}>Titre (FR) *</label>
                  <input value={title} onChange={(e) => handleTitleChange(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Titre de l’œuvre" />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Slug</label>
                  <input value={slug} onChange={(e) => setSlug(normalizeSlug(e.target.value))} disabled={isBusy} className={inputCls} placeholder="slug-de-l-oeuvre" />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Année</label>
                  <input type="number" inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} disabled={isBusy} className={inputCls} placeholder="2025" />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Dimensions</label>
                  <input value={dimensions} onChange={(e) => setDimensions(e.target.value)} disabled={isBusy} className={inputCls} placeholder="50 × 70 cm" />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Prix</label>
                  <input value={price} onChange={(e) => setPrice(e.target.value)} disabled={isBusy} className={inputCls} placeholder="2 000 €" />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>URL Etsy</label>
                  <input type="url" value={etsyUrl} onChange={(e) => setEtsyUrl(e.target.value)} disabled={isBusy} className={inputCls} placeholder="https://etsy.com/…" />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                    <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} disabled={isBusy} className="h-4 w-4 rounded border-neutral-300" />
                    <span className="text-sm text-neutral-700">Marquer comme œuvre mise en avant</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Multilingual content with tabs */}
            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <p className={`mb-4 ${labelCls}`}>Contenu multilingue</p>

              {/* Tab buttons */}
              <div className="mb-5 flex w-fit rounded-xl border border-neutral-200 bg-neutral-50 p-1 gap-1">
                {(["fr", "en", "es"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLang(lang)}
                    className={`rounded-lg px-5 py-1.5 text-sm font-medium transition ${
                      activeLang === lang
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-400 hover:text-neutral-700"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* FR */}
              {activeLang === "fr" ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className={labelCls}>Sous-titre</label>
                    <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Sculpture murale contemporaine" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className={labelCls}>Catégorie</label>
                      <input value={category} onChange={(e) => setCategory(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Sculpture murale" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelCls}>Disponibilité</label>
                      <input value={availability} onChange={(e) => setAvailability(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Disponible sur demande" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Matériaux</label>
                    <input value={materials} onChange={(e) => setMaterials(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Papier mâché, carton recyclé…" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} disabled={isBusy} className={inputCls} placeholder="Description de l’œuvre" />
                  </div>
                </div>
              ) : null}

              {/* EN */}
              {activeLang === "en" ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className={labelCls}>Title (EN)</label>
                    <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Artwork title" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Subtitle</label>
                    <input value={subtitleEn} onChange={(e) => setSubtitleEn(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Contemporary wall sculpture" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className={labelCls}>Category</label>
                      <input value={categoryEn} onChange={(e) => setCategoryEn(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Wall sculpture" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelCls}>Availability</label>
                      <input value={availabilityEn} onChange={(e) => setAvailabilityEn(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Available on request" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Materials</label>
                    <input value={materialsEn} onChange={(e) => setMaterialsEn(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Papier-mâché, recycled cardboard…" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Description</label>
                    <textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} rows={5} disabled={isBusy} className={inputCls} placeholder="Artwork description in English" />
                  </div>
                </div>
              ) : null}

              {/* ES */}
              {activeLang === "es" ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className={labelCls}>Título (ES)</label>
                    <input value={titleEs} onChange={(e) => setTitleEs(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Título de la obra" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Subtítulo</label>
                    <input value={subtitleEs} onChange={(e) => setSubtitleEs(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Escultura mural contemporánea" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className={labelCls}>Categoría</label>
                      <input value={categoryEs} onChange={(e) => setCategoryEs(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Escultura mural" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelCls}>Disponibilidad</label>
                      <input value={availabilityEs} onChange={(e) => setAvailabilityEs(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Disponible por encargo" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Materiales</label>
                    <input value={materialsEs} onChange={(e) => setMaterialsEs(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Papel maché, cartón reciclado…" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Descripción</label>
                    <textarea value={descriptionEs} onChange={(e) => setDescriptionEs(e.target.value)} rows={5} disabled={isBusy} className={inputCls} placeholder="Descripción de la obra en español" />
                  </div>
                </div>
              ) : null}
            </div>

            {/* Atelier / Story section */}
            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <p className={`mb-1 ${labelCls}`}>Atelier — histoire de la pièce</p>
              <p className="mb-4 text-xs text-neutral-400">Si ces champs sont vides, la section n'apparaît pas sur le site.</p>

              {/* Tab buttons for story */}
              <div className="mb-5 flex w-fit rounded-xl border border-neutral-200 bg-neutral-50 p-1 gap-1">
                {(["fr", "en", "es"] as const).map((lang) => (
                  <button
                    key={`story-${lang}`}
                    type="button"
                    onClick={() => setActiveLang(lang)}
                    className={`rounded-lg px-5 py-1.5 text-sm font-medium transition ${
                      activeLang === lang
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-400 hover:text-neutral-700"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {activeLang === "fr" ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className={labelCls}>Titre de la section (FR)</label>
                    <input value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} disabled={isBusy} className={inputCls} placeholder="Dans l'atelier" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Texte de l'histoire (FR)</label>
                    <textarea value={storyContent} onChange={(e) => setStoryContent(e.target.value)} rows={6} disabled={isBusy} className={inputCls} placeholder="Raconte comment cette pièce a été créée…" />
                  </div>
                </div>
              ) : null}

              {activeLang === "en" ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className={labelCls}>Section title (EN)</label>
                    <input value={storyTitleEn} onChange={(e) => setStoryTitleEn(e.target.value)} disabled={isBusy} className={inputCls} placeholder="In the studio" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Story text (EN)</label>
                    <textarea value={storyContentEn} onChange={(e) => setStoryContentEn(e.target.value)} rows={6} disabled={isBusy} className={inputCls} placeholder="Tell how this piece was created…" />
                  </div>
                </div>
              ) : null}

              {activeLang === "es" ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className={labelCls}>Título de la sección (ES)</label>
                    <input value={storyTitleEs} onChange={(e) => setStoryTitleEs(e.target.value)} disabled={isBusy} className={inputCls} placeholder="En el atelier" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Texto de la historia (ES)</label>
                    <textarea value={storyContentEs} onChange={(e) => setStoryContentEs(e.target.value)} rows={6} disabled={isBusy} className={inputCls} placeholder="Cuenta cómo se creó esta pieza…" />
                  </div>
                </div>
              ) : null}

              <div className="mt-4 space-y-1.5">
                <label className={labelCls}>URL vidéo (YouTube ou Vimeo)</label>
                <input type="url" value={storyVideoUrl} onChange={(e) => setStoryVideoUrl(e.target.value)} disabled={isBusy} className={inputCls} placeholder="https://www.youtube.com/watch?v=…" />
              </div>
            </div>

            {/* Save button */}
            <button
              type="submit"
              disabled={isBusy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingArtwork ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Enregistrer les modifications
            </button>
          </form>

          {/* ── RIGHT: Images ── */}
          <div className="space-y-4 lg:sticky lg:top-6 lg:h-fit">

            {/* Thumbnail grid */}
            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className={labelCls}>Images</p>
                <span className="rounded-full bg-[#f6efe5] px-2.5 py-1 text-xs font-medium text-neutral-600">
                  {imageCount} image{imageCount > 1 ? "s" : ""}
                </span>
              </div>

              {imageCount === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-10 text-center text-sm text-neutral-400">
                  Aucune image pour cette œuvre
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {sortedImages.map((image) => {
                    const isProcessing = processingImageId === image.id;
                    return (
                      <div
                        key={image.id}
                        className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100"
                      >
                        <Image
                          src={image.image_url}
                          alt={image.alt_text || title || artwork.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 33vw, 20vw"
                        />

                        {/* Cover badge */}
                        {image.is_cover ? (
                          <div className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-amber-400/95 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-900 shadow">
                            <Star className="h-2.5 w-2.5 fill-current" />
                            Cover
                          </div>
                        ) : null}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/55 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          {!image.is_cover ? (
                            <button
                              type="button"
                              onClick={() => handleSetCover(image.id)}
                              disabled={isBusy}
                              className="inline-flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1.5 text-[11px] font-medium text-neutral-900 transition hover:bg-white disabled:opacity-50"
                            >
                              <Star className="h-3 w-3" />
                              Définir cover
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(image.id)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-500/90 px-2.5 py-1.5 text-[11px] font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            Supprimer
                          </button>
                        </div>

                        {/* Processing spinner */}
                        {isProcessing ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                            <Loader2 className="h-5 w-5 animate-spin text-neutral-700" />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Upload form */}
            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <p className={`mb-4 ${labelCls}`}>Ajouter des images</p>
              <form onSubmit={handleUploadImages} className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  disabled={isBusy}
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
                  className="block w-full rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-3 py-3 text-sm text-neutral-700 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                />
                {selectedFiles.length > 0 ? (
                  <p className="text-xs text-neutral-500">
                    {selectedFiles.length} fichier{selectedFiles.length > 1 ? "s" : ""} sélectionné{selectedFiles.length > 1 ? "s" : ""}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={isBusy || selectedFiles.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Ajouter les images
                </button>
              </form>
            </div>

            {/* Story images grid */}
            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className={labelCls}>Images d'atelier</p>
                <span className="rounded-full bg-[#f6efe5] px-2.5 py-1 text-xs font-medium text-neutral-600">
                  {artwork.artwork_story_images.length} image{artwork.artwork_story_images.length > 1 ? "s" : ""}
                </span>
              </div>

              {artwork.artwork_story_images.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-8 text-center text-sm text-neutral-400">
                  Aucune image d'atelier
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {artwork.artwork_story_images.map((image) => {
                    const isProcessing = processingStoryImageId === image.id;
                    return (
                      <div
                        key={image.id}
                        className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100"
                      >
                        <Image
                          src={image.image_url}
                          alt={image.alt_text || title || artwork.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 33vw, 20vw"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => handleDeleteStoryImage(image.id)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-500/90 px-2.5 py-1.5 text-[11px] font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            Supprimer
                          </button>
                        </div>

                        {isProcessing ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                            <Loader2 className="h-5 w-5 animate-spin text-neutral-700" />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Story image upload form */}
            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <p className={`mb-4 ${labelCls}`}>Ajouter des images d'atelier</p>
              <form onSubmit={handleUploadStoryImages} className="space-y-3">
                <input
                  ref={storyFileInputRef}
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  disabled={isBusy}
                  onChange={(e) => setSelectedStoryFiles(Array.from(e.target.files ?? []))}
                  className="block w-full rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-3 py-3 text-sm text-neutral-700 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                />
                {selectedStoryFiles.length > 0 ? (
                  <p className="text-xs text-neutral-500">
                    {selectedStoryFiles.length} fichier{selectedStoryFiles.length > 1 ? "s" : ""} sélectionné{selectedStoryFiles.length > 1 ? "s" : ""}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={isBusy || selectedStoryFiles.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploadingStory ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Ajouter les images d'atelier
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}