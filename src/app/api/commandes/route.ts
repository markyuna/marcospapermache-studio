import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { resend, getResendFromEmail, getResendToEmail } from "@/lib/resend";
import { AdminNotificationEmail } from "@/emails/AdminNotificationEmail";
import { ClientConfirmationEmail } from "@/emails/ClientConfirmationEmail";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const getFormValue = (value: FormDataEntryValue | null) =>
      typeof value === "string" ? value.trim() : "";

    const getOptionalFormValue = (value: FormDataEntryValue | null) =>
      typeof value === "string" ? value.trim() || null : null;

    const name = getFormValue(formData.get("name"));
    const email = getFormValue(formData.get("email"));
    const projectType = getOptionalFormValue(formData.get("projectType"));
    const dimensions = getOptionalFormValue(formData.get("dimensions"));
    const budget = getOptionalFormValue(formData.get("budget"));
    const message = getFormValue(formData.get("message"));
    const imageUrl = getOptionalFormValue(formData.get("imageUrl"));

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Les champs nom, email et message sont obligatoires." },
        { status: 400 }
      );
    }

    let fileUrl: string | null = null;

    const file = formData.get("file");
    if (file && file instanceof File && file.size > 0) {
      const fileExt = file.name.split(".").pop() || "bin";
      const safeFileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${fileExt}`;

      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabaseAdmin.storage
        .from("commandes")
        .upload(safeFileName, fileBuffer, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return NextResponse.json(
          { error: "Erreur lors de l’envoi du fichier." },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("commandes")
        .getPublicUrl(safeFileName);

      fileUrl = publicUrlData.publicUrl;
    }

    const { data: insertedCommande, error: insertError } = await supabaseAdmin
      .from("commandes")
      .insert([
        {
          name,
          email,
          project_type: projectType,
          dimensions,
          budget,
          message,
          image_url: imageUrl,
          file_url: fileUrl,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Erreur lors de l’enregistrement de la demande." },
        { status: 500 }
      );
    }

    const from = getResendFromEmail();
    const adminTo = getResendToEmail();

    const adminEmailResult = await resend.emails.send({
      from,
      to: adminTo,
      subject: `Nouvelle demande sur mesure - ${name}`,
      react: AdminNotificationEmail({
        name,
        email,
        projectType,
        dimensions,
        budget,
        message,
        imageUrl,
        fileUrl,
      }),
    });

    if (adminEmailResult.error) {
      console.error("Resend admin email error:", adminEmailResult.error);
    }

    const clientEmailResult = await resend.emails.send({
      from,
      to: email,
      subject: "Nous avons bien reçu votre demande",
      react: ClientConfirmationEmail({
        name,
        projectType,
        dimensions,
        budget,
        message,
      }),
    });

    if (clientEmailResult.error) {
      console.error("Resend client email error:", clientEmailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: "Demande envoyée avec succès.",
      commande: insertedCommande,
      emails: {
        adminSent: !adminEmailResult.error,
        clientSent: !clientEmailResult.error,
      },
    });
  } catch (error) {
    console.error("API route error:", error);

    return NextResponse.json(
      { error: "Une erreur inattendue est survenue." },
      { status: 500 }
    );
  }
}