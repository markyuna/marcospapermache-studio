"use client";

import { useState } from "react";

export default function CreateArtworkForm() {
  const [activeLang, setActiveLang] = useState<"fr" | "en" | "es">("fr");

  const inputCls =
    "w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-neutral-400";
  const labelCls =
    "text-xs font-medium uppercase tracking-[0.1em] text-neutral-500";

  return (
    <form
      action="/api/admin/artworks"
      method="POST"
      encType="multipart/form-data"
      className="space-y-4"
    >
      {/* General info */}
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <p className={`mb-4 ${labelCls}`}>Informations générales</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="title" className={labelCls}>
              Titre (FR) *
            </label>
            <input
              id="title"
              name="title"
              required
              className={inputCls}
              placeholder="Ex. Fusion des Consciences"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="year" className={labelCls}>
              Année
            </label>
            <input
              id="year"
              name="year"
              type="number"
              inputMode="numeric"
              className={inputCls}
              placeholder="2026"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="dimensions" className={labelCls}>
              Dimensions
            </label>
            <input
              id="dimensions"
              name="dimensions"
              className={inputCls}
              placeholder="50 × 70 cm"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="price" className={labelCls}>
              Prix
            </label>
            <input
              id="price"
              name="price"
              className={inputCls}
              placeholder="2 000 €"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="etsy_url" className={labelCls}>
              URL Etsy
            </label>
            <input
              id="etsy_url"
              name="etsy_url"
              type="url"
              className={inputCls}
              placeholder="https://etsy.com/…"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              <input
                type="checkbox"
                name="is_featured"
                value="true"
                className="h-4 w-4 rounded border-neutral-300"
              />
              <span className="text-sm text-neutral-700">
                Marquer comme œuvre mise en avant
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Multilingual tabs */}
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <p className={`mb-4 ${labelCls}`}>Contenu multilingue</p>

        <div className="mb-5 flex w-fit gap-1 rounded-xl border border-neutral-200 bg-neutral-50 p-1">
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

        {/* FR — always in DOM */}
        <div className={activeLang === "fr" ? "space-y-3" : "hidden"}>
          <div className="space-y-1.5">
            <label htmlFor="subtitle" className={labelCls}>
              Sous-titre
            </label>
            <input
              id="subtitle"
              name="subtitle"
              className={inputCls}
              placeholder="Sculpture murale contemporaine"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="category" className={labelCls}>
                Catégorie
              </label>
              <input
                id="category"
                name="category"
                className={inputCls}
                placeholder="Sculpture murale"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="availability" className={labelCls}>
                Disponibilité
              </label>
              <input
                id="availability"
                name="availability"
                className={inputCls}
                placeholder="Disponible sur demande"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="materials" className={labelCls}>
              Matériaux
            </label>
            <input
              id="materials"
              name="materials"
              className={inputCls}
              placeholder="Papier mâché, carton recyclé…"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="description" className={labelCls}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className={inputCls}
              placeholder="Description de l'œuvre"
            />
          </div>
        </div>

        {/* EN — always in DOM */}
        <div className={activeLang === "en" ? "space-y-3" : "hidden"}>
          <div className="space-y-1.5">
            <label htmlFor="title_en" className={labelCls}>
              Title (EN)
            </label>
            <input
              id="title_en"
              name="title_en"
              className={inputCls}
              placeholder="Ex. Fusion of Consciousness"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="subtitle_en" className={labelCls}>
              Subtitle
            </label>
            <input
              id="subtitle_en"
              name="subtitle_en"
              className={inputCls}
              placeholder="Contemporary wall sculpture"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="category_en" className={labelCls}>
                Category
              </label>
              <input
                id="category_en"
                name="category_en"
                className={inputCls}
                placeholder="Wall sculpture"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="availability_en" className={labelCls}>
                Availability
              </label>
              <input
                id="availability_en"
                name="availability_en"
                className={inputCls}
                placeholder="Available on request"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="materials_en" className={labelCls}>
              Materials
            </label>
            <input
              id="materials_en"
              name="materials_en"
              className={inputCls}
              placeholder="Papier-mâché, recycled cardboard…"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="description_en" className={labelCls}>
              Description
            </label>
            <textarea
              id="description_en"
              name="description_en"
              rows={4}
              className={inputCls}
              placeholder="Artwork description in English"
            />
          </div>
        </div>

        {/* ES — always in DOM */}
        <div className={activeLang === "es" ? "space-y-3" : "hidden"}>
          <div className="space-y-1.5">
            <label htmlFor="title_es" className={labelCls}>
              Título (ES)
            </label>
            <input
              id="title_es"
              name="title_es"
              className={inputCls}
              placeholder="Ej. Fusión de las Conciencias"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="subtitle_es" className={labelCls}>
              Subtítulo
            </label>
            <input
              id="subtitle_es"
              name="subtitle_es"
              className={inputCls}
              placeholder="Escultura mural contemporánea"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="category_es" className={labelCls}>
                Categoría
              </label>
              <input
                id="category_es"
                name="category_es"
                className={inputCls}
                placeholder="Escultura mural"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="availability_es" className={labelCls}>
                Disponibilidad
              </label>
              <input
                id="availability_es"
                name="availability_es"
                className={inputCls}
                placeholder="Disponible por encargo"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="materials_es" className={labelCls}>
              Materiales
            </label>
            <input
              id="materials_es"
              name="materials_es"
              className={inputCls}
              placeholder="Papel maché, cartón reciclado…"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="description_es" className={labelCls}>
              Descripción
            </label>
            <textarea
              id="description_es"
              name="description_es"
              rows={4}
              className={inputCls}
              placeholder="Descripción de la obra en español"
            />
          </div>
        </div>
      </div>

      {/* Image upload */}
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <label htmlFor="images" className={`mb-3 block ${labelCls}`}>
          Images *
        </label>
        <input
          id="images"
          type="file"
          name="images"
          multiple
          required
          accept="image/*"
          className="block w-full rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-3 py-3 text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-neutral-800"
        />
        <p className="mt-2 text-xs text-neutral-400">
          Plusieurs fichiers acceptés.
        </p>
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-xl bg-neutral-950 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
      >
        Ajouter l&apos;œuvre
      </button>
    </form>
  );
}
