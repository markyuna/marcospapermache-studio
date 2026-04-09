import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

type RouteContext = {
  params: Promise<{
    id: string;
    imageId: string;
  }>;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Erreur inconnue";
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id, imageId } = await context.params;

    const artworkId = Number(id);
    const numericImageId = Number(imageId);

    if (!Number.isInteger(artworkId) || artworkId <= 0) {
      return NextResponse.json(
        { error: "ID de l’œuvre invalide." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(numericImageId) || numericImageId <= 0) {
      return NextResponse.json(
        { error: "ID de l’image invalide." },
        { status: 400 }
      );
    }

    // 1. Verificar que la imagen pertenece a la obra
    const { data: image, error: imageError } = await supabaseAdmin
      .from("artwork_images")
      .select("id, artwork_id")
      .eq("id", numericImageId)
      .eq("artwork_id", artworkId)
      .single();

    if (imageError || !image) {
      return NextResponse.json(
        { error: "Image introuvable pour cette œuvre." },
        { status: 404 }
      );
    }

    // 2. Resetear todas las imágenes de esa obra
    const { error: resetError } = await supabaseAdmin
      .from("artwork_images")
      .update({ is_cover: false })
      .eq("artwork_id", artworkId);

    if (resetError) {
      throw new Error(resetError.message);
    }

    // 3. Definir la nueva cover
    const { error: coverError } = await supabaseAdmin
      .from("artwork_images")
      .update({ is_cover: true })
      .eq("id", numericImageId)
      .eq("artwork_id", artworkId);

    if (coverError) {
      throw new Error(coverError.message);
    }

    return NextResponse.json({
      success: true,
      coverImageId: numericImageId,
    });
  } catch (error: unknown) {
    console.error(
      "PATCH /api/admin/artworks/[id]/images/[imageId]/cover error:",
      error
    );

    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}