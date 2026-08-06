-- Free-generation allowance on user_credits.
-- The `user_credits` table was created outside of prisma/migrations, so this
-- change ships as a standalone script: run it in the Supabase SQL editor (or
-- `psql "$DATABASE_URL" -f prisma/sql/20260806_add_free_generations.sql`),
-- then `npx prisma generate`.

ALTER TABLE "user_credits"
  ADD COLUMN IF NOT EXISTS "images_generated" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "payment_status" TEXT NOT NULL DEFAULT 'free';

-- Existing accounts that already bought a pack keep their paid status.
UPDATE "user_credits"
SET "payment_status" = 'paid'
WHERE "paid_credits" > 0 AND "payment_status" = 'free';

-- Backfill the counter from images already generated, capped at the free
-- allowance so nobody is retroactively charged for pre-existing generations.
UPDATE "user_credits" uc
SET "images_generated" = LEAST(
  (SELECT COUNT(*) FROM "ai_images" ai WHERE ai."supabase_user_id" = uc."supabase_user_id"),
  2
)
WHERE uc."images_generated" = 0;
