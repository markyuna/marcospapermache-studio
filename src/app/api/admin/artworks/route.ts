//src/app/api/admin/artworks/route.ts
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

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = getString(formData, "title");
    const title_en = getString(formData, "title_en") || null;
    const title_es = getString(formData, "title_es") || null;

    const subtitle = getString(formData, "subtitle") || null;
    const subtitle_en = getString(formData, "subtitle_en") || null;
    const subtitle_es = getString(formData, "subtitle_es") || null;

    const description = getString(formData, "description") || null;
    const description_en = getString(formData, "description_en") || null;
    const description_es = getString(formData, "description_es") || null;

    const category = getString(formData, "category") || null;
    const category_en = getString(formData, "category_en") || null;
    const category_es = getString(formData, "category_es") || null;

    const dimensions = getString(formData, "dimensions") || null;
    const price = getString(formData, "price") || null;

    const materials = getString(formData, "materials") || null;
    const materials_en = getString(formData, "materials_en") || null;
    const materials_es = getString(formData, "materials_es") || null;

    const availability = getString(formData, "availability") || null;
    const availability_en = getString(formData, "availability_en") || null;
    const availability_es = getString(formData, "availability_es") || null;

    const etsy_url = getString(formData, "etsy_url") || null;
    const is_featured = formData.get("is_featured") === "true";

    const rawYear = getString(formData, "year");
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
        title_en,
        title_es,
        slug,
        subtitle,
        subtitle_en,
        subtitle_es,
        description,
        description_en,
        description_es,
        category,
        category_en,
        category_es,
        year,
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
      artwork_id: string;
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

        await supabaseAdmin.from("artworks").delete().eq("id", artwork.id);

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

      const pathsToDelete = uploadedImages.map((image) => image.storage_path);

      if (pathsToDelete.length > 0) {
        await supabaseAdmin.storage.from("artworks").remove(pathsToDelete);
      }

      await supabaseAdmin.from("artworks").delete().eq("id", artwork.id);

      return NextResponse.json(
        { error: "L’œuvre a été créée, mais pas les images." },
        { status: 500 }
      );
    }

    revalidatePath("/admin/artworks");
    revalidatePath("/sculptures");
    revalidatePath("/fr/sculptures");
    revalidatePath("/en/sculptures");
    revalidatePath("/es/sculptures");
    revalidatePath(`/fr/sculptures/${artwork.slug}`);
    revalidatePath(`/en/sculptures/${artwork.slug}`);
    revalidatePath(`/es/sculptures/${artwork.slug}`);

    return NextResponse.redirect(new URL("/admin/artworks", request.url), {
      status: 303,
    });
  } catch (error) {
    console.error("POST /api/admin/artworks error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}