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

export type ArtworkDetail = {
  id: string;
  artwork_id: string;
  content: string;
  position: number;
  created_at: string;
};

export type Artwork = {
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
  images: ArtworkImage[];
  details: ArtworkDetail[];
};