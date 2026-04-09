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
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";

    const category = normalizeOptionalString(body?.category);
    const description = normalizeOptionalString(body?.description);
    const subtitle = normalizeOptionalString(body?.subtitle);
    const dimensions = normalizeOptionalString(body?.dimensions);
    const price = normalizeOptionalString(body?.price);
    const materials = normalizeOptionalString(body?.materials);
    const availability = normalizeOptionalString(body?.availability);
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

    const { error } = await supabaseAdmin
      .from("artworks")
      .update({
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
      })
      .eq("id", id);

    if (error) {
      console.error("Erreur update artwork:", error);
      return NextResponse.json(
        { error: "Impossible de mettre à jour l’œuvre." },
        { status: 500 }
      );
    }

    revalidatePath("/admin/artworks");
    revalidatePath(`/admin/artworks/${id}`);
    revalidatePath("/sculptures");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/artworks/[id] error:", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/artworks/[id] error:", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}