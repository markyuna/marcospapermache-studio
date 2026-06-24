// src/app/api/admin/artworks/[id]/story-images/[imageId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

type RouteContext = {
  params: Promise<{ id: string; imageId: string }>;
};

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id: artworkId, imageId } = await context.params;

    const { data: image, error: fetchError } = await supabaseAdmin
      .from("artwork_story_images")
      .select("id, storage_path")
      .eq("id", imageId)
      .eq("artwork_id", artworkId)
      .single();

    if (fetchError || !image) {
      return NextResponse.json({ error: "Image introuvable." }, { status: 404 });
    }

    if (image.storage_path) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("artworks")
        .remove([image.storage_path]);

      if (storageError) {
        console.error("Erreur suppression storage:", storageError);
      }
    }

    const { error: deleteError } = await supabaseAdmin
      .from("artwork_story_images")
      .delete()
      .eq("id", imageId)
      .eq("artwork_id", artworkId);

    if (deleteError) {
      return NextResponse.json({ error: "Impossible de supprimer l'image." }, { status: 500 });
    }

    revalidateTag("artworks", {});
    revalidatePath("/admin/artworks");
    revalidatePath(`/admin/artworks/${artworkId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE story-image route error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
