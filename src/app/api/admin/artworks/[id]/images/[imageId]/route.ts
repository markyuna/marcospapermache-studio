// src/app/api/admin/artworks/[id]/images/[imageId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

type RouteContext = {
  params: Promise<{
    id: string;
    imageId: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    const { id: artworkId, imageId } = await context.params;
    const body = await request.json();

    if (body?.action !== "set-cover") {
      return NextResponse.json(
        { error: "Action invalide." },
        { status: 400 }
      );
    }

    const { data: image, error: imageError } = await supabaseAdmin
      .from("artwork_images")
      .select("id, artwork_id")
      .eq("id", imageId)
      .eq("artwork_id", artworkId)
      .single();

    if (imageError || !image) {
      return NextResponse.json(
        { error: "Image introuvable pour cette œuvre." },
        { status: 404 }
      );
    }

    const { error: resetError } = await supabaseAdmin
      .from("artwork_images")
      .update({ is_cover: false })
      .eq("artwork_id", artworkId);

    if (resetError) {
      console.error("Erreur reset cover:", resetError);
      return NextResponse.json(
        { error: "Impossible de réinitialiser le cover." },
        { status: 500 }
      );
    }

    const { error: coverError } = await supabaseAdmin
      .from("artwork_images")
      .update({ is_cover: true })
      .eq("id", imageId)
      .eq("artwork_id", artworkId);

    if (coverError) {
      console.error("Erreur set cover:", coverError);
      return NextResponse.json(
        { error: "Impossible de définir le cover." },
        { status: 500 }
      );
    }

    revalidatePath("/admin/artworks");
    revalidatePath(`/admin/artworks/${artworkId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH image route error:", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    const { id: artworkId, imageId } = await context.params;

    const { data: image, error: fetchError } = await supabaseAdmin
      .from("artwork_images")
      .select("id, storage_path, is_cover")
      .eq("id", imageId)
      .eq("artwork_id", artworkId)
      .single();

    if (fetchError || !image) {
      console.error("Erreur récupération image:", fetchError);
      return NextResponse.json(
        { error: "Image introuvable." },
        { status: 404 }
      );
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
      .from("artwork_images")
      .delete()
      .eq("id", imageId)
      .eq("artwork_id", artworkId);

    if (deleteError) {
      console.error("Erreur suppression image DB:", deleteError);
      return NextResponse.json(
        { error: "Impossible de supprimer l’image." },
        { status: 500 }
      );
    }

    if (image.is_cover) {
      const { data: remainingImages, error: remainingError } =
        await supabaseAdmin
          .from("artwork_images")
          .select("id")
          .eq("artwork_id", artworkId)
          .order("position", { ascending: true })
          .order("created_at", { ascending: true })
          .limit(1);

      if (remainingError) {
        console.error("Erreur recherche nouvelle cover:", remainingError);
      } else if (remainingImages && remainingImages.length > 0) {
        const nextCoverId = remainingImages[0].id;

        const { error: nextCoverError } = await supabaseAdmin
          .from("artwork_images")
          .update({ is_cover: true })
          .eq("id", nextCoverId)
          .eq("artwork_id", artworkId);

        if (nextCoverError) {
          console.error("Erreur nouvelle cover:", nextCoverError);
        }
      }
    }

    revalidatePath("/admin/artworks");
    revalidatePath(`/admin/artworks/${artworkId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE image route error:", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}