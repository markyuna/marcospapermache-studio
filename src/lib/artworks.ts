import { supabaseAdmin } from "@/lib/supabase";
import type { Artwork } from "@/types/artwork";

type ArtworkRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  category: string | null;
  materials: string | null;
  dimensions: string | null;
  year: number | null;
  availability: string | null;
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
  details:
    | {
        id: string;
        artwork_id: string;
        content: string;
        position: number;
        created_at: string;
      }[]
    | null;
};

function normalizeArtwork(row: ArtworkRow): Artwork {
  return {
    ...row,
    images: (row.images ?? []).sort((a, b) => a.position - b.position),
    details: (row.details ?? []).sort((a, b) => a.position - b.position),
  };
}

export async function getArtworks(): Promise<Artwork[]> {
  const { data, error } = await supabaseAdmin
    .from("artworks")
    .select(`
      id,
      slug,
      title,
      subtitle,
      description,
      category,
      materials,
      dimensions,
      year,
      availability,
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
      ),
      details:artwork_details(
        id,
        artwork_id,
        content,
        position,
        created_at
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Erreur lors du chargement des œuvres : ${error.message}`);
  }

  return ((data ?? []) as ArtworkRow[]).map(normalizeArtwork);
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const { data, error } = await supabaseAdmin
    .from("artworks")
    .select(`
      id,
      slug,
      title,
      subtitle,
      description,
      category,
      materials,
      dimensions,
      year,
      availability,
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
      ),
      details:artwork_details(
        id,
        artwork_id,
        content,
        position,
        created_at
      )
    `)
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