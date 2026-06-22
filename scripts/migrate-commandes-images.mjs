/**
 * One-time migration: moves base64 image_url values in commandes table
 * to Supabase Storage and replaces them with public URLs.
 *
 * Run with:
 *   node --env-file=.env scripts/migrate-commandes-images.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function parseDataUrl(dataUrl) {
  const commaIdx = dataUrl.indexOf(",");
  if (commaIdx === -1) return null;

  const header = dataUrl.slice(0, commaIdx);
  const base64Data = dataUrl.slice(commaIdx + 1);
  const mimeType = header.split(":")[1]?.split(";")[0] ?? "image/png";
  const ext = mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "png";

  return { mimeType, ext, base64Data };
}

async function uploadImage(dataUrl, id) {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) throw new Error("Could not parse data URL");

  const { mimeType, ext, base64Data } = parsed;
  const fileName = `migrated-${id}.${ext}`;
  const buffer = Buffer.from(base64Data, "base64");

  const { error } = await supabase.storage
    .from("commandes")
    .upload(fileName, buffer, { contentType: mimeType, upsert: true });

  if (error) throw new Error(`Storage upload: ${error.message}`);

  const { data } = supabase.storage.from("commandes").getPublicUrl(fileName);
  return data.publicUrl;
}

async function main() {
  // Step 1: fetch only IDs to avoid timeout on the large base64 data
  console.log("Fetching IDs with base64 image_url...\n");

  const { data: idRows, error: idError } = await supabase
    .from("commandes")
    .select("id")
    .like("image_url", "data:%")
    .order("id");

  if (idError) {
    console.error("Fetch error:", idError.message);
    process.exit(1);
  }

  const ids = idRows.map((r) => r.id);
  console.log(`${ids.length} rows to migrate: ${ids.join(", ")}\n`);

  let success = 0;
  let failed = 0;

  // Step 2: process each row individually
  for (const id of ids) {
    process.stdout.write(`  Row ${id} → fetching... `);

    const { data: row, error: rowError } = await supabase
      .from("commandes")
      .select("id, image_url")
      .eq("id", id)
      .single();

    if (rowError || !row?.image_url) {
      console.log(`✗  fetch failed: ${rowError?.message ?? "no data"}`);
      failed++;
      continue;
    }

    const sizeMb = (row.image_url.length / 1024 / 1024).toFixed(1);
    process.stdout.write(`${sizeMb}MB → uploading... `);

    try {
      const url = await uploadImage(row.image_url, id);

      const { error: updateError } = await supabase
        .from("commandes")
        .update({ image_url: url })
        .eq("id", id);

      if (updateError) throw new Error(`DB update: ${updateError.message}`);

      console.log(`✓  ${url.split("/").pop()}`);
      success++;
    } catch (err) {
      console.log(`✗  ${err.message}`);
      failed++;
    }
  }

  console.log(`\n${success} migrated, ${failed} failed.`);
}

main().catch(console.error);
