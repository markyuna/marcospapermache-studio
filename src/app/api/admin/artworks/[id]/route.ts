// src/app/api/admin/artworks/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function normalizeOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const title_en = normalizeOptionalString(body?.title_en);
    const title_es = normalizeOptionalString(body?.title_es);

    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";

    const subtitle = normalizeOptionalString(body?.subtitle);
    const subtitle_en = normalizeOptionalString(body?.subtitle_en);
    const subtitle_es = normalizeOptionalString(body?.subtitle_es);

    const description = normalizeOptionalString(body?.description);
    const description_en = normalizeOptionalString(body?.description_en);
    const description_es = normalizeOptionalString(body?.description_es);

    const category = normalizeOptionalString(body?.category);
    const category_en = normalizeOptionalString(body?.category_en);
    const category_es = normalizeOptionalString(body?.category_es);

    const dimensions = normalizeOptionalString(body?.dimensions);
    const price = normalizeOptionalString(body?.price);

    const materials = normalizeOptionalString(body?.materials);
    const materials_en = normalizeOptionalString(body?.materials_en);
    const materials_es = normalizeOptionalString(body?.materials_es);

    const availability = normalizeOptionalString(body?.availability);
    const availability_en = normalizeOptionalString(body?.availability_en);
    const availability_es = normalizeOptionalString(body?.availability_es);

    const etsy_url = normalizeOptionalString(body?.etsy_url);

    const parsedYear =
      typeof body?.year === "number"
        ? body.year
        : typeof body?.year === "string" && body.year.trim()
          ? Number(body.year)
          : null;

    const year =
      typeof parsedYear === "number" && Number.isFinite(parsedYear)
        ? parsedYear
        : null;

    const is_featured =
      typeof body?.is_featured === "boolean" ? body.is_featured : false;

    if (!title) {
      return NextResponse.json(
        { error: "Le titre est requis." },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Le slug est requis." },
        { status: 400 }
      );
    }

    const { data: existingArtwork, error: slugCheckError } = await supabaseAdmin
      .from("artworks")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
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
        { error: "Une autre œuvre utilise déjà ce slug." },
        { status: 409 }
      );
    }

    const { error: updateArtworkError } = await supabaseAdmin
      .from("artworks")
      .update({
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
      .eq("id", id);

    if (updateArtworkError) {
      console.error("Erreur update artwork:", updateArtworkError);
      return NextResponse.json(
        { error: "Impossible de mettre à jour l’œuvre." },
        { status: 500 }
      );
    }

    revalidatePath("/admin/artworks");
    revalidatePath(`/admin/artworks/${id}`);
    revalidatePath("/sculptures");
    revalidatePath("/fr/sculptures");
    revalidatePath("/en/sculptures");
    revalidatePath("/es/sculptures");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/artworks/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const { data: artwork, error: artworkError } = await supabaseAdmin
      .from("artworks")
      .select("slug")
      .eq("id", id)
      .maybeSingle();

    if (artworkError) {
      console.error("Erreur récupération artwork:", artworkError);
      return NextResponse.json(
        { error: "Impossible de récupérer l’œuvre." },
        { status: 500 }
      );
    }

    const artworkSlug = artwork?.slug ?? null;

    const { data: images, error: imagesError } = await supabaseAdmin
      .from("artwork_images")
      .select("storage_path")
      .eq("artwork_id", id);

    if (imagesError) {
      console.error("Erreur récupération images artwork:", imagesError);
      return NextResponse.json(
        { error: "Impossible de récupérer les images." },
        { status: 500 }
      );
    }

    const pathsToDelete =
      images
        ?.map((img) => img.storage_path)
        .filter((path): path is string => Boolean(path)) ?? [];

    if (pathsToDelete.length > 0) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("artworks")
        .remove(pathsToDelete);

      if (storageError) {
        console.error("Erreur suppression fichiers artwork:", storageError);
      }
    }

    const { error: deleteImagesError } = await supabaseAdmin
      .from("artwork_images")
      .delete()
      .eq("artwork_id", id);

    if (deleteImagesError) {
      console.error("Erreur suppression images:", deleteImagesError);
      return NextResponse.json(
        { error: "Impossible de supprimer les images." },
        { status: 500 }
      );
    }

    const { error: deleteArtworkError } = await supabaseAdmin
      .from("artworks")
      .delete()
      .eq("id", id);

    if (deleteArtworkError) {
      console.error("Erreur suppression artwork:", deleteArtworkError);
      return NextResponse.json(
        { error: "Impossible de supprimer l’œuvre." },
        { status: 500 }
      );
    }

    revalidatePath("/admin/artworks");
    revalidatePath("/sculptures");
    revalidatePath("/fr/sculptures");
    revalidatePath("/en/sculptures");
    revalidatePath("/es/sculptures");

    if (artworkSlug) {
      revalidatePath(`/fr/sculptures/${artworkSlug}`);
      revalidatePath(`/en/sculptures/${artworkSlug}`);
      revalidatePath(`/es/sculptures/${artworkSlug}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/artworks/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}