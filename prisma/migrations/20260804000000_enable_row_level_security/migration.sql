-- Enable Row-Level Security on every table in the `public` schema.
--
-- All application access to these tables goes through either the Supabase
-- service-role client (`supabaseAdmin` in src/lib/supabase.ts, which
-- bypasses RLS by design) or Prisma over `DATABASE_URL` (connects as the
-- table owner, also unaffected by RLS without FORCE ROW LEVEL SECURITY).
-- No policies are added here: nothing in the codebase queries these tables
-- with the anon/authenticated key, so enabling RLS with zero policies
-- closes the "Table publicly accessible" advisor finding without changing
-- any existing behavior.
--
-- IF EXISTS is used because some of these tables were created directly in
-- Supabase rather than through a Prisma migration in this repo (see the
-- note in prisma/schema.prisma).

ALTER TABLE IF EXISTS "public"."Artwork" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."AIImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."Order" ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS "public"."ai_images" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."user_credits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."user_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."processed_stripe_events" ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS "public"."commandes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."artworks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."artwork_images" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."artwork_story_images" ENABLE ROW LEVEL SECURITY;
