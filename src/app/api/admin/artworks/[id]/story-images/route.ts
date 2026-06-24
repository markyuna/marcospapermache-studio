// src/app/api/admin/artworks/[id]/story-images/route.ts

import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function sanitizeFileName(fileName: string): string {
  const cleaned = fileName.trim().replace(/\s+/g, "-").replace(/[^\w.-]/g, "");
  return cleaned || `image-${Date.now()}`;
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id: artworkId } = await context.params;

    if (!artworkId?.trim()) {
      return NextResponse.json({ error: "ID de l'œuvre invalide." }, { status: 400 });
    }

    const formData = await request.formData();
    const files = formData
      .getAll("images")
      .filter((file): file is File => file instanceof File && file.size > 0);

    if (files.length === 0) {
      return NextResponse.json({ error: "Aucune image fournie." }, { status: 400 });
    }

    const { data: artwork, error: artworkError } = await supabaseAdmin
      .from("artworks")
      .select("id, slug")
      .eq("id", artworkId)
      .maybeSingle();

    if (artworkError || !artwork) {
      return NextResponse.json({ error: "Œuvre introuvable." }, { status: 404 });
    }

    const { data: existingImages } = await supabaseAdmin
      .from("artwork_story_images")
      .select("position")
      .eq("artwork_id", artworkId)
      .order("position", { ascending: false })
      .limit(1);

    const highestPosition = existingImages?.[0]?.position ?? -1;
    const uploadBatchTimestamp = Date.now();

    const uploadedImages: {
      artwork_id: string;
      storage_path: string;
      image_url: string;
      position: number;
    }[] = [];
    const uploadedPaths: string[] = [];

    try {
      for (const [index, file] of files.entries()) {
        const safeFileName = sanitizeFileName(file.name);
        const position = highestPosition + 1 + index;
        const filePath = `${artwork.slug}/story/${uploadBatchTimestamp}-${position}-${safeFileName}`;

        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabaseAdmin.storage
          .from("artworks")
          .upload(filePath, fileBuffer, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || undefined,
          });

        if (uploadError) throw new Error(uploadError.message);

        uploadedPaths.push(filePath);

        const { data: publicUrlData } = supabaseAdmin.storage
          .from("artworks")
          .getPublicUrl(filePath);

        uploadedImages.push({
          artwork_id: artworkId,
          storage_path: filePath,
          image_url: publicUrlData.publicUrl,
          position,
        });
      }

      const { data: insertedImages, error: insertError } = await supabaseAdmin
        .from("artwork_story_images")
        .insert(uploadedImages)
        .select("*");

      if (insertError) throw new Error(insertError.message);

      revalidateTag("artworks", {});
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
    console.error("POST /api/admin/artworks/[id]/story-images error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}
