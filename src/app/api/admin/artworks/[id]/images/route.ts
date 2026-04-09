// src/app/api/admin/artworks/[id]/images/route.ts


import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type ArtworkRow = {
  id: string;
  slug: string;
};

type ExistingArtworkImageRow = {
  id: string;
  position: number | null;
  is_cover: boolean;
};

type ArtworkImageInsert = {
  artwork_id: string;
  storage_path: string;
  image_url: string;
  position: number;
  is_cover: boolean;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Erreur inconnue";
}

function sanitizeFileName(fileName: string): string {
  const cleaned = fileName
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w.-]/g, "");

  return cleaned || `image-${Date.now()}`;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id: artworkId } = await context.params;

    if (!artworkId?.trim()) {
      return NextResponse.json(
        { error: "ID de l’œuvre invalide." },
        { status: 400 }
      );
    }

    const formData = await request.formData();

    const files = formData
      .getAll("images")
      .filter((file): file is File => file instanceof File && file.size > 0);

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Aucune image fournie." },
        { status: 400 }
      );
    }

    const { data: artwork, error: artworkError } = await supabaseAdmin
      .from("artworks")
      .select("id, slug")
      .eq("id", artworkId)
      .maybeSingle<ArtworkRow>();

    if (artworkError) {
      console.error("Erreur récupération artwork:", artworkError);
      return NextResponse.json(
        { error: "Impossible de récupérer l’œuvre." },
        { status: 500 }
      );
    }

    if (!artwork) {
      return NextResponse.json(
        { error: "Œuvre introuvable." },
        { status: 404 }
      );
    }

    const { data: existingImages, error: existingImagesError } =
      await supabaseAdmin
        .from("artwork_images")
        .select("id, position, is_cover")
        .eq("artwork_id", artworkId)
        .order("position", { ascending: true })
        .returns<ExistingArtworkImageRow[]>();

    if (existingImagesError) {
      throw new Error(existingImagesError.message);
    }

    const safePositions =
      existingImages?.map((image) => image.position ?? -1) ?? [];

    const highestPosition =
      safePositions.length > 0 ? Math.max(...safePositions) : -1;

    const startPosition = highestPosition + 1;
    const shouldSetFirstUploadedAsCover = !existingImages || existingImages.length === 0;
    const uploadBatchTimestamp = Date.now();

    const uploadedImages: ArtworkImageInsert[] = [];
    const uploadedPaths: string[] = [];

    try {
      for (const [index, file] of files.entries()) {
        const safeFileName = sanitizeFileName(file.name);
        const position = startPosition + index;
        const filePath = `${artwork.slug}/${uploadBatchTimestamp}-${position}-${safeFileName}`;

        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabaseAdmin.storage
          .from("artworks")
          .upload(filePath, fileBuffer, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || undefined,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        uploadedPaths.push(filePath);

        const { data: publicUrlData } = supabaseAdmin.storage
          .from("artworks")
          .getPublicUrl(filePath);

        uploadedImages.push({
          artwork_id: artworkId,
          storage_path: filePath,
          image_url: publicUrlData.publicUrl,
          position,
          is_cover: shouldSetFirstUploadedAsCover && index === 0,
        });
      }

      const { data: insertedImages, error: insertError } = await supabaseAdmin
        .from("artwork_images")
        .insert(uploadedImages)
        .select("*");

      if (insertError) {
        throw new Error(insertError.message);
      }

      revalidatePath("/admin/artworks");
      revalidatePath(`/admin/artworks/${artworkId}`);

      return NextResponse.json({
        success: true,
        added: uploadedImages.length,
        images: insertedImages ?? [],
      });
    } catch (innerError) {
      if (uploadedPaths.length > 0) {
        await supabaseAdmin.storage.from("artworks").remove(uploadedPaths);
      }

      throw innerError;
    }
  } catch (error: unknown) {
    console.error("POST /api/admin/artworks/[id]/images error:", error);

    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}