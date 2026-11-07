-- quiz_results: a visitor's saved quiz outcome (and its generated image).
--
-- NOT EXECUTED. Review it, then run it in the Supabase SQL editor (or via
-- `apply_migration`) and afterwards add the matching model to prisma/schema.prisma
-- and run `npx prisma generate`. Idempotent: safe to run twice.
--
-- Access model (same as the rest of this project: RLS on, all writes server-side):
--   * The browser never writes here. Profile, config and image_path are always
--     recomputed / set by the server from the answers code, never trusted from the
--     client, so there are NO insert/update/delete policies and the API roles
--     have those privileges revoked.
--   * Server code reaches the table through Prisma / the service role, which
--     bypass RLS.

create table if not exists public.quiz_results (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,

  -- Answers code (encodeAnswers): digits and '-' only, validated server-side.
  code               text not null check (code ~ '^[0-9-]{1,32}$'),
  -- Snapshots computed by the server at save time, so the account view stays
  -- stable if the quiz weights change later.
  profile            text not null check (char_length(profile) between 1 and 40),
  config             jsonb not null,
  locale             text not null default 'fr' check (locale in ('fr', 'en', 'es')),

  -- Which of the 6 profile prompts was used for the image (p1..p6).
  prompt_key         text check (prompt_key ~ '^p[0-9]{1,2}$'),

  -- Object path inside the private `quiz-images` bucket, never a URL (URLs are
  -- signed on demand and expire). Always '<user_id>/<file>' — enforced below.
  image_path         text,
  image_generated_at timestamptz,

  -- In-flight marker so two simultaneous "generate" calls cannot both spend a
  -- credit on the same result. Stale after 90 s (see the API; maxDuration is 60 s).
  generating_since   timestamptz,

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  unique (user_id, code),
  constraint quiz_results_image_path_owner
    check (image_path is null or image_path like user_id::text || '/%')
);

create index if not exists quiz_results_user_created_idx
  on public.quiz_results (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Triggers: updated_at, and a hard cap of 20 saved results per user.
-- ---------------------------------------------------------------------------

create or replace function public.quiz_results_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists quiz_results_touch_updated_at on public.quiz_results;
create trigger quiz_results_touch_updated_at
  before update on public.quiz_results
  for each row execute function public.quiz_results_touch_updated_at();

create or replace function public.quiz_results_enforce_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- Serialise inserts per user (transaction-level lock: safe behind the
  -- transaction pooler), otherwise two parallel inserts could both pass the count.
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));

  -- An upsert of a code that already exists is an update, not a new result.
  if exists (
    select 1 from public.quiz_results
    where user_id = new.user_id and code = new.code
  ) then
    return new;
  end if;

  if (select count(*) from public.quiz_results where user_id = new.user_id) >= 20 then
    raise exception 'quiz_results_limit_reached' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists quiz_results_enforce_limit on public.quiz_results;
create trigger quiz_results_enforce_limit
  before insert on public.quiz_results
  for each row execute function public.quiz_results_enforce_limit();

-- ---------------------------------------------------------------------------
-- Row level security: read-own only. No client-side writes.
-- ---------------------------------------------------------------------------

alter table public.quiz_results enable row level security;

drop policy if exists "quiz_results_select_own" on public.quiz_results;
create policy "quiz_results_select_own" on public.quiz_results
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- Supabase grants API roles full table privileges by default; take the writes
-- (and everything for anon) away so RLS is not the only line of defence.
revoke all on public.quiz_results from anon;
revoke insert, update, delete, truncate, references, trigger
  on public.quiz_results from authenticated;

-- ---------------------------------------------------------------------------
-- Private bucket for the generated images (the existing `commandes` bucket is
-- public, so it cannot be used). No policies on storage.objects on purpose:
-- API roles get no access; the server reads/writes with the service role and
-- hands the owner short-lived signed URLs.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('quiz-images', 'quiz-images', false, 5242880, array['image/webp'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Prisma equivalent (add to prisma/schema.prisma; the table is created by this
-- script, not by `prisma migrate`, like user_credits):
--
-- model QuizResult {
--   id               String    @id @default(uuid()) @db.Uuid
--   userId           String    @map("user_id") @db.Uuid
--   code             String
--   profile          String
--   config           Json
--   locale           String    @default("fr")
--   promptKey        String?   @map("prompt_key")
--   imagePath        String?   @map("image_path")
--   imageGeneratedAt DateTime? @map("image_generated_at") @db.Timestamptz(6)
--   generatingSince  DateTime? @map("generating_since") @db.Timestamptz(6)
--   createdAt        DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
--   updatedAt        DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz(6)
--
--   @@unique([userId, code])
--   @@index([userId, createdAt(sort: Desc)])
--   @@map("quiz_results")
-- }
-- ---------------------------------------------------------------------------
