// src/lib/artworks.ts
import { supabaseAdmin } from "@/lib/supabase";
import type { Artwork } from "@/types/artwork";

type ArtworkRow = {
  id: string;
  slug: string;

  title: string;
  title_en: string | null;
  title_es: string | null;

  subtitle: string | null;
  subtitle_en: string | null;
  subtitle_es: string | null;

  description: string | null;
  description_en: string | null;
  description_es: string | null;

  category: string | null;
  category_en: string | null;
  category_es: string | null;

  materials: string | null;
  materials_en: string | null;
  materials_es: string | null;

  dimensions: string | null;
  year: number | null;
  price: string | null;

  availability: string | null;
  availability_en: string | null;
  availability_es: string | null;

  etsy_url: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;

  images:
    | {
        id: string;
        artwork_id: string;
        storage_path: string;
        image_url: string;
        alt_text: string | null;
        position: number;
        is_cover: boolean;
        created_at: string;
      }[]
    | null;
};

function normalizeArtwork(row: ArtworkRow): Artwork {
  return {
    ...row,
    images: (row.images ?? []).sort((a, b) => {
      if (a.is_cover !== b.is_cover) {
        return Number(b.is_cover) - Number(a.is_cover);
      }

      return a.position - b.position;
    }),
  };
}

const artworkSelect = `
  id,
  slug,
  title,
  title_en,
  title_es,
  subtitle,
  subtitle_en,
  subtitle_es,
  description,
  description_en,
  description_es,
  category,
  category_en,
  category_es,
  materials,
  materials_en,
  materials_es,
  dimensions,
  year,
  price,
  availability,
  availability_en,
  availability_es,
  etsy_url,
  is_featured,
  created_at,
  updated_at,
  images:artwork_images(
    id,
    artwork_id,
    storage_path,
    image_url,
    alt_text,
    position,
    is_cover,
    created_at
  )
`;

export async function getArtworks(): Promise<Artwork[]> {
  const { data, error } = await supabaseAdmin
    .from("artworks")
    .select(artworkSelect)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Erreur lors du chargement des œuvres : ${error.message}`);
  }

  return ((data ?? []) as ArtworkRow[]).map(normalizeArtwork);
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const { data, error } = await supabaseAdmin
    .from("artworks")
    .select(artworkSelect)
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw new Error(`Erreur lors du chargement de l'œuvre : ${error.message}`);
  }

  return normalizeArtwork(data as ArtworkRow);
}

export async function getArtworksBySlugs(slugs: string[]): Promise<Artwork[]> {
  if (slugs.length === 0) {
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from("artworks")
    .select(artworkSelect)
    .in("slug", slugs);

  if (error) {
    throw new Error(
      `Erreur lors du chargement des œuvres sélectionnées : ${error.message}`
    );
  }

  const artworks = ((data ?? []) as ArtworkRow[]).map(normalizeArtwork);

  const orderMap = new Map(slugs.map((slug, index) => [slug, index]));

  return artworks.sort((a, b) => {
    const aIndex = orderMap.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = orderMap.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  });
}