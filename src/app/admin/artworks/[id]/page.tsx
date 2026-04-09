// src/app/admin/artworks/[id]/page.tsx
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
      slug,
      category,
      year,
      description,
      subtitle,
      dimensions,
      price,
      materials,
      availability,
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
      const posA = a.position ?? 9999;
      const posB = b.position ?? 9999;

      if (posA !== posB) return posA - posB;
      if (a.is_cover && !b.is_cover) return -1;
      if (!a.is_cover && b.is_cover) return 1;

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