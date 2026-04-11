export type ArtworkImage = {
  id: string;
  artwork_id: string;
  storage_path: string;
  image_url: string;
  alt_text: string | null;
  position: number;
  is_cover: boolean;
  created_at: string;
};

export type Artwork = {
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

  images: ArtworkImage[];
};