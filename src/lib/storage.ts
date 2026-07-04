import { supabaseAdmin } from "@/lib/supabase";

export async function uploadBase64ImageToStorage(
  dataUrl: string,
): Promise<string> {
  const matches = dataUrl.match(
    /^data:([a-zA-Z0-9+/]+\/[a-zA-Z0-9+/]+);base64,(.+)$/,
  );

  if (!matches) {
    throw new Error("Invalid data URL");
  }

  const mimeType = matches[1];
  const ext = mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "png";
  const fileName = `ai-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(matches[2], "base64");

  const { error } = await supabaseAdmin.storage
    .from("commandes")
    .upload(fileName, buffer, { contentType: mimeType, upsert: false });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage.from("commandes").getPublicUrl(fileName);
  return data.publicUrl;
}
