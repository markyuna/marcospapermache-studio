import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import slugify from "slugify";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const get = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value.trim() : "";
    };

    const title = get("title");
    const description = get("description");
    const category = get("category");
    const dimensions = get("dimensions");
    const year = Number(get("year")) || null;

    const files = formData.getAll("images") as File[];

    if (!title || files.length === 0) {
      return NextResponse.json(
        { error: "Titre et images requis." },
        { status: 400 }
      );
    }

    const slug = slugify(title, { lower: true, strict: true });

    // 1. Crear artwork
    const { data: artwork, error: artworkError } = await supabaseAdmin
      .from("artworks")
      .insert({
        title,
        slug,
        description,
        category,
        dimensions,
        year,
      })
      .select()
      .single();

    if (artworkError) {
      throw new Error(artworkError.message);
    }

    const uploadedImages = [];

    // 2. Subir imágenes
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const filePath = `${slug}/${Date.now()}-${i}-${file.name}`;

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
        position: i,
        is_cover: i === 0,
      });
    }

    // 3. Guardar imágenes en DB
    const { error: imagesError } = await supabaseAdmin
      .from("artwork_images")
      .insert(uploadedImages);

    if (imagesError) {
      throw new Error(imagesError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erreur inconnue" },
      { status: 500 }
    );
  }
}