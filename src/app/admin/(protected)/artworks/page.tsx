import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

type ArtworkImageRow = {
  artwork_id: number;
  image_url: string;
  is_cover: boolean;
  position: number | null;
};

type ArtworkImage = {
  image_url: string;
  is_cover: boolean;
  position: number | null;
};

type Artwork = {
  id: number;
  title: string;
  title_en: string | null;
  title_es: string | null;
  slug: string;
  category: string | null;
  category_en: string | null;
  category_es: string | null;
  year: number | null;
  subtitle: string | null;
  subtitle_en: string | null;
  subtitle_es: string | null;
  materials: string | null;
  materials_en: string | null;
  materials_es: string | null;
  availability: string | null;
  availability_en: string | null;
  availability_es: string | null;
  etsy_url: string | null;
  price: string | null;
  is_featured: boolean | null;
  artwork_images: ArtworkImage[] | null;
};

async function getArtworks(): Promise<Artwork[]> {
  try {
    const { data: artworksData, error: artworksError } = await supabaseAdmin
      .from("artworks")
      .select(`
        id,
        title,
        title_en,
        title_es,
        slug,
        category,
        category_en,
        category_es,
        year,
        subtitle,
        subtitle_en,
        subtitle_es,
        materials,
        materials_en,
        materials_es,
        availability,
        availability_en,
        availability_es,
        etsy_url,
        price,
        is_featured,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (artworksError) {
      console.error("Error loading artworks table:", {
        message: artworksError.message,
        details: artworksError.details,
        hint: artworksError.hint,
        code: artworksError.code,
      });
      return [];
    }

    const artworks = (artworksData ?? []) as Omit<Artwork, "artwork_images">[];

    if (artworks.length === 0) {
      return [];
    }

    const artworkIds = artworks.map((artwork) => artwork.id);

    const { data: imagesData, error: imagesError } = await supabaseAdmin
      .from("artwork_images")
      .select(`
        artwork_id,
        image_url,
        is_cover,
        position
      `)
      .in("artwork_id", artworkIds)
      .order("position", { ascending: true });

    if (imagesError) {
      console.error("Error loading artwork_images table:", {
        message: imagesError.message,
        details: imagesError.details,
        hint: imagesError.hint,
        code: imagesError.code,
      });

      return artworks.map((artwork) => ({
        ...artwork,
        artwork_images: [],
      }));
    }

    const imagesByArtworkId = new Map<number, ArtworkImage[]>();

    for (const image of (imagesData ?? []) as ArtworkImageRow[]) {
      const current = imagesByArtworkId.get(image.artwork_id) ?? [];
      current.push({
        image_url: image.image_url,
        is_cover: image.is_cover,
        position: image.position,
      });
      imagesByArtworkId.set(image.artwork_id, current);
    }

    return artworks.map((artwork) => ({
      ...artwork,
      artwork_images: imagesByArtworkId.get(artwork.id) ?? [],
    }));
  } catch (error) {
    console.error("Unexpected error loading artworks:", error);
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function AdminArtworksPage() {
  const artworks = await getArtworks();

  return (
    <main className="min-h-screen bg-[#f8f5ef] p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-14">
        <section className="grid gap-10 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">
                Dashboard
              </p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                Ajouter une œuvre
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">
                Ajoute une nouvelle œuvre avec ses informations principales,
                ses contenus multilingues et une ou plusieurs images.
              </p>
            </div>

            <form
              action="/api/admin/artworks"
              method="POST"
              encType="multipart/form-data"
              className="space-y-5"
            >
              <div className="grid gap-5">
                <div className="rounded-3xl border border-neutral-200 bg-[#fcfaf7] p-5">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-neutral-900">
                      Français
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      Contenu principal utilisé comme base.
                    </p>
                  </div>

                  <div className="grid gap-5">
                    <div>
                      <label
                        htmlFor="title"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Titre
                      </label>
                      <input
                        id="title"
                        name="title"
                        required
                        placeholder="Ex. Fusion des Consciences"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subtitle"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Sous-titre
                      </label>
                      <input
                        id="subtitle"
                        name="subtitle"
                        placeholder="Ex. Sculpture murale contemporaine"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={5}
                        placeholder="Description de l’œuvre"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="category"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Catégorie
                      </label>
                      <input
                        id="category"
                        name="category"
                        placeholder="Ex. Sculpture murale"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="materials"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Matériaux
                      </label>
                      <input
                        id="materials"
                        name="materials"
                        placeholder="Ex. Papier mâché, carton recyclé, capsules Vertuo"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="availability"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Disponibilité
                      </label>
                      <input
                        id="availability"
                        name="availability"
                        placeholder="Ex. Disponible sur demande"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-neutral-200 bg-[#fcfaf7] p-5">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-neutral-900">
                      English
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      Optional. If empty, French content can be used as fallback.
                    </p>
                  </div>

                  <div className="grid gap-5">
                    <div>
                      <label
                        htmlFor="title_en"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Title
                      </label>
                      <input
                        id="title_en"
                        name="title_en"
                        placeholder="Ex. Fusion of Consciousness"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subtitle_en"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Subtitle
                      </label>
                      <input
                        id="subtitle_en"
                        name="subtitle_en"
                        placeholder="Ex. Contemporary wall sculpture"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description_en"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="description_en"
                        name="description_en"
                        rows={5}
                        placeholder="Artwork description in English"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="category_en"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Category
                      </label>
                      <input
                        id="category_en"
                        name="category_en"
                        placeholder="Ex. Wall sculpture"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="materials_en"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Materials
                      </label>
                      <input
                        id="materials_en"
                        name="materials_en"
                        placeholder="Ex. Papier-mâché, recycled cardboard, Vertuo capsules"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="availability_en"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Availability
                      </label>
                      <input
                        id="availability_en"
                        name="availability_en"
                        placeholder="Ex. Available on request"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-neutral-200 bg-[#fcfaf7] p-5">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-neutral-900">
                      Español
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      Opcional. Si queda vacío, luego puedes usar francés como base.
                    </p>
                  </div>

                  <div className="grid gap-5">
                    <div>
                      <label
                        htmlFor="title_es"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Título
                      </label>
                      <input
                        id="title_es"
                        name="title_es"
                        placeholder="Ej. Fusión de las Conciencias"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subtitle_es"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Subtítulo
                      </label>
                      <input
                        id="subtitle_es"
                        name="subtitle_es"
                        placeholder="Ej. Escultura mural contemporánea"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description_es"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Descripción
                      </label>
                      <textarea
                        id="description_es"
                        name="description_es"
                        rows={5}
                        placeholder="Descripción de la obra en español"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="category_es"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Categoría
                      </label>
                      <input
                        id="category_es"
                        name="category_es"
                        placeholder="Ej. Escultura mural"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="materials_es"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Materiales
                      </label>
                      <input
                        id="materials_es"
                        name="materials_es"
                        placeholder="Ej. Papel maché, cartón reciclado, cápsulas Vertuo"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="availability_es"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                      >
                        Disponibilidad
                      </label>
                      <input
                        id="availability_es"
                        name="availability_es"
                        placeholder="Ej. Disponible por encargo"
                        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="year"
                      className="mb-2 block text-sm font-medium text-neutral-700"
                    >
                      Année
                    </label>
                    <input
                      id="year"
                      name="year"
                      type="number"
                      placeholder="Ex. 2026"
                      inputMode="numeric"
                      className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="dimensions"
                      className="mb-2 block text-sm font-medium text-neutral-700"
                    >
                      Dimensions
                    </label>
                    <input
                      id="dimensions"
                      name="dimensions"
                      placeholder="Ex. 50 x 70 cm"
                      className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="price"
                      className="mb-2 block text-sm font-medium text-neutral-700"
                    >
                      Prix
                    </label>
                    <input
                      id="price"
                      name="price"
                      placeholder="Ex. 2000 €"
                      className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="etsy_url"
                      className="mb-2 block text-sm font-medium text-neutral-700"
                    >
                      URL Etsy
                    </label>
                    <input
                      id="etsy_url"
                      name="etsy_url"
                      type="url"
                      placeholder="https://markpaper.etsy.com/..."
                      className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-[#faf7f2] px-4 py-3">
                  <input
                    type="checkbox"
                    name="is_featured"
                    value="true"
                    className="h-4 w-4 rounded border-neutral-300"
                  />
                  <span className="text-sm font-medium text-neutral-700">
                    Marquer comme œuvre mise en avant
                  </span>
                </label>

                <div>
                  <label
                    htmlFor="images"
                    className="mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Images
                  </label>
                  <input
                    id="images"
                    type="file"
                    name="images"
                    multiple
                    required
                    accept="image/*"
                    className="w-full rounded-2xl border border-dashed border-neutral-300 bg-[#faf7f2] px-4 py-4 text-sm text-neutral-600 file:mr-4 file:rounded-xl file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
                  />
                  <p className="mt-2 text-xs text-neutral-500">
                    Tu peux sélectionner plusieurs images à la fois.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-black py-3.5 text-sm font-medium text-white transition hover:opacity-85"
              >
                Ajouter l’œuvre
              </button>
            </form>
          </div>

          <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">
              Bibliothèque
            </p>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
              Toutes les œuvres
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Gère tes œuvres existantes, leurs images et leurs informations
              de présentation.
            </p>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-neutral-200 bg-[#faf7f2] px-4 py-3">
              <span className="text-sm text-neutral-600">Total</span>
              <span className="text-sm font-semibold text-neutral-900">
                {artworks.length} œuvre{artworks.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {artworks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-12 text-center text-sm text-neutral-500">
                  Aucune œuvre enregistrée pour le moment.
                </div>
              ) : (
                artworks.map((artwork) => {
                  const sortedImages = [...(artwork.artwork_images ?? [])].sort(
                    (a, b) => (a.position ?? 9999) - (b.position ?? 9999)
                  );

                  const cover =
                    sortedImages.find((image) => image.is_cover) ??
                    sortedImages[0] ??
                    null;

                  return (
                    <article
                      key={artwork.id}
                      className="overflow-hidden rounded-2xl border border-neutral-200 bg-[#fffdf9] shadow-sm"
                    >
                      <div className="flex gap-4 p-4">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-neutral-100">
                          {cover ? (
                            <Image
                              src={cover.image_url}
                              alt={artwork.title}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-center text-xs text-neutral-400">
                              Aucune image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap gap-2">
                            <h3 className="text-base font-semibold text-neutral-900">
                              {artwork.title}
                            </h3>

                            {artwork.is_featured ? (
                              <span className="rounded-full bg-amber-500/90 px-2.5 py-1 text-[11px] font-medium text-white">
                                Featured
                              </span>
                            ) : null}
                          </div>

                          {artwork.subtitle ? (
                            <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                              {artwork.subtitle}
                            </p>
                          ) : null}

                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-[#f3eadb] px-2.5 py-1 text-neutral-700">
                              {artwork.category || "Sans catégorie"}
                            </span>

                            {artwork.year ? (
                              <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-neutral-600">
                                {artwork.year}
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Link
                              href={`/admin/artworks/${artwork.id}`}
                              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-3.5 py-2 text-sm font-medium text-white transition hover:opacity-85"
                            >
                              Gérer
                            </Link>

                            <Link
                              href={`/fr/sculptures/${artwork.slug}`}
                              className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-3.5 py-2 text-sm font-medium text-neutral-800 transition hover:border-black hover:text-black"
                            >
                              Voir la page
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Galerie des œuvres
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Accède rapidement à la gestion détaillée de chaque pièce.
            </p>
          </div>

          {artworks.length === 0 ? (
            <div className="rounded-[28px] border border-neutral-200 bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-medium text-neutral-900">
                Aucune œuvre pour le moment
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Commence par ajouter ta première œuvre avec le formulaire
                ci-dessus.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {artworks.map((artwork) => {
                const sortedImages = [...(artwork.artwork_images ?? [])].sort(
                  (a, b) => (a.position ?? 9999) - (b.position ?? 9999)
                );

                const cover =
                  sortedImages.find((image) => image.is_cover) ??
                  sortedImages[0] ??
                  null;

                return (
                  <article
                    key={artwork.id}
                    className="group overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] bg-neutral-100">
                      {cover ? (
                        <Image
                          src={cover.image_url}
                          alt={artwork.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.02]"
                          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                          Aucune image
                        </div>
                      )}

                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-800 backdrop-blur">
                          {artwork.category || "Sans catégorie"}
                        </span>

                        {artwork.year ? (
                          <span className="rounded-full bg-black/85 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                            {artwork.year}
                          </span>
                        ) : null}

                        {artwork.is_featured ? (
                          <span className="rounded-full bg-amber-500/90 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                            Featured
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-4 p-5">
                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900">
                          {artwork.title}
                        </h3>

                        {artwork.subtitle ? (
                          <p className="mt-1 text-sm text-neutral-500">
                            {artwork.subtitle}
                          </p>
                        ) : null}

                        {artwork.availability ? (
                          <p className="mt-2 text-sm text-neutral-600">
                            {artwork.availability}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/admin/artworks/${artwork.id}`}
                          className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-85"
                        >
                          Gérer
                        </Link>

                        <Link
                          href={`/fr/sculptures/${artwork.slug}`}
                          className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:border-black hover:text-black"
                        >
                          Voir la page
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}