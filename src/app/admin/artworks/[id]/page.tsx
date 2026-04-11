import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import ArtworkDetailManager from "@/components/admin/ArtworkDetailManager";

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
  artwork_images: ArtworkImage[];
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getArtworkById(id: string): Promise<Artwork | null> {
  const { data, error } = await supabaseAdmin
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
      description,
      description_en,
      description_es,
      subtitle,
      subtitle_en,
      subtitle_es,
      dimensions,
      price,
      materials,
      materials_en,
      materials_es,
      availability,
      availability_en,
      availability_es,
      etsy_url,
      is_featured,
      created_at,
      artwork_images (
        id,
        artwork_id,
        storage_path,
        image_url,
        alt_text,
        position,
        is_cover,
        created_at
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur getArtworkById:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  const artwork = data as Artwork;

  artwork.artwork_images =
    artwork.artwork_images?.sort((a, b) => {
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
    }) ?? [];

  return artwork;
}

export default async function AdminArtworkDetailPage({ params }: PageProps) {
  const { id } = await params;
  const artwork = await getArtworkById(id);

  if (!artwork) {
    notFound();
  }

  return <ArtworkDetailManager artwork={artwork} />;
}