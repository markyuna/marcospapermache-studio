import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import slugify from "slugify";

type ArtworkInsert = {
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  dimensions: string | null;
  year: number | null;
};

type UploadedImageInsert = {
  artwork_id: number | string;
  storage_path: string;
  image_url: string;
  position: number;
  is_cover: boolean;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Erreur inconnue";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const get = (key: string): string => {
      const value = formData.get(key);
      return typeof value === "string" ? value.trim() : "";
    };

    const title = get("title");
    const description = get("description") || null;
    const category = get("category") || null;
    const dimensions = get("dimensions") || null;

    const yearValue = get("year");
    const parsedYear = Number(yearValue);
    const year = yearValue && !Number.isNaN(parsedYear) ? parsedYear : null;

    const files = formData
      .getAll("images")
      .filter((file): file is File => file instanceof File && file.size > 0);

    if (!title || files.length === 0) {
      return NextResponse.json(
        { error: "Titre et images requis." },
        { status: 400 }
      );
    }

    const slug = slugify(title, { lower: true, strict: true });

    const artworkPayload: ArtworkInsert = {
      title,
      slug,
      description,
      category,
      dimensions,
      year,
    };

    const { data: artwork, error: artworkError } = await supabaseAdmin
      .from("artworks")
      .insert(artworkPayload)
      .select("id")
      .single();

    if (artworkError) {
      throw new Error(artworkError.message);
    }

    const uploadedImages: UploadedImageInsert[] = [];

    for (const [index, file] of files.entries()) {
      const safeFileName = file.name.replace(/\s+/g, "-");
      const filePath = `${slug}/${Date.now()}-${index}-${safeFileName}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("artworks")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("artworks")
        .getPublicUrl(filePath);

      uploadedImages.push({
        artwork_id: artwork.id,
        storage_path: filePath,
        image_url: publicUrlData.publicUrl,
        position: index,
        is_cover: index === 0,
      });
    }

    const { error: imagesError } = await supabaseAdmin
      .from("artwork_images")
      .insert(uploadedImages);

    if (imagesError) {
      throw new Error(imagesError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}