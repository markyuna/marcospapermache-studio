// src/app/api/admin/artworks/route.tsx
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const getString = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value.trim() : "";
    };

    const title = getString("title");
    const subtitle = getString("subtitle") || null;
    const description = getString("description") || null;
    const category = getString("category") || null;
    const dimensions = getString("dimensions") || null;
    const price = getString("price") || null;
    const materials = getString("materials") || null;
    const availability = getString("availability") || null;
    const etsy_url = getString("etsy_url") || null;
    const is_featured = formData.get("is_featured") === "true";

    const rawYear = getString("year");
    const parsedYear = rawYear ? Number(rawYear) : null;
    const year =
      typeof parsedYear === "number" && Number.isFinite(parsedYear)
        ? parsedYear
        : null;

    if (!title) {
      return NextResponse.json(
        { error: "Le titre est requis." },
        { status: 400 }
      );
    }

    const slug = slugify(title);

    if (!slug) {
      return NextResponse.json(
        { error: "Impossible de générer un slug valide." },
        { status: 400 }
      );
    }

    const files = formData
      .getAll("images")
      .filter((file): file is File => file instanceof File && file.size > 0);

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Au moins une image est requise." },
        { status: 400 }
      );
    }

    const { data: existingArtwork, error: slugCheckError } = await supabaseAdmin
      .from("artworks")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (slugCheckError) {
      console.error("Erreur vérification slug:", slugCheckError);
      return NextResponse.json(
        { error: "Impossible de vérifier le slug." },
        { status: 500 }
      );
    }

    if (existingArtwork) {
      return NextResponse.json(
        { error: "Une œuvre avec ce slug existe déjà." },
        { status: 409 }
      );
    }

    const { data: artwork, error: artworkError } = await supabaseAdmin
      .from("artworks")
      .insert({
        title,
        slug,
        subtitle,
        description,
        category,
        year,
        dimensions,
        price,
        materials,
        availability,
        etsy_url,
        is_featured,
      })
      .select("id, slug")
      .single();

    if (artworkError || !artwork) {
      console.error("Erreur création artwork:", artworkError);
      return NextResponse.json(
        { error: "Impossible de créer l’œuvre." },
        { status: 500 }
      );
    }

    const uploadedImages: {
      artwork_id: number;
      image_url: string;
      storage_path: string;
      is_cover: boolean;
      position: number;
    }[] = [];

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeTitle = slugify(title);
      const fileName = `${Date.now()}-${index}.${extension}`;
      const storagePath = `${safeTitle}/${fileName}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabaseAdmin.storage
        .from("artworks")
        .upload(storagePath, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        console.error("Erreur upload image:", uploadError);
        return NextResponse.json(
          { error: "Impossible de téléverser une image." },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("artworks")
        .getPublicUrl(storagePath);

      uploadedImages.push({
        artwork_id: artwork.id,
        image_url: publicUrlData.publicUrl,
        storage_path: storagePath,
        is_cover: index === 0,
        position: index,
      });
    }

    const { error: imagesInsertError } = await supabaseAdmin
      .from("artwork_images")
      .insert(uploadedImages);

    if (imagesInsertError) {
      console.error("Erreur insertion artwork_images:", imagesInsertError);
      return NextResponse.json(
        { error: "L’œuvre a été créée, mais pas les images." },
        { status: 500 }
      );
    }

    revalidatePath("/admin/artworks");
    revalidatePath("/sculptures");
    revalidatePath(`/sculptures/${artwork.slug}`);

    return NextResponse.redirect(new URL("/admin/artworks", request.url), {
      status: 303,
    });
  } catch (error) {
    console.error("POST /api/admin/artworks error:", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}