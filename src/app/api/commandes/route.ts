import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// 🔹 helpers
function getRequired(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || !value.trim()) return "";
  return value.trim();
}

function getOptional(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // 🔹 fields
    const name = getRequired(formData.get("name"));
    const email = getRequired(formData.get("email"));
    const message = getRequired(formData.get("message"));

    const projectType = getOptional(formData.get("projectType"));
    const dimensions = getOptional(formData.get("dimensions"));
    const budget = getOptional(formData.get("budget"));

    const file = formData.get("image") as File | null;

    // 🔹 validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Champs requis manquants." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Email invalide." },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;

    // 🔹 image upload
    if (file && file.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Format d’image non supporté." },
          { status: 400 }
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image trop lourde (max 5MB)." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
      const filePath = `references/${fileName}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("commandes")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);

        return NextResponse.json(
          { error: "Erreur upload image." },
          { status: 500 }
        );
      }

      const { data } = supabaseAdmin.storage
        .from("commandes")
        .getPublicUrl(filePath);

      imageUrl = data.publicUrl;
    }

    // 🔹 insert DB
    const { data, error } = await supabaseAdmin
      .from("commandes")
      .insert({
        name,
        email,
        project_type: projectType,
        dimensions,
        budget,
        message,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (error) {
      console.error("DB error:", error);

      return NextResponse.json(
        { error: "Erreur base de données." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        commande: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API crash:", error);

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}