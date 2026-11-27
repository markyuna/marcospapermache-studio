-- First-party, cookieless audience measurement (replaces Microsoft Clarity).
--
-- NOT EXECUTED. Review it, then run it in the Supabase SQL editor (or via
-- `apply_migration`). The matching models are already in prisma/schema.prisma
-- (AnalyticsSession, AnalyticsEvent). Idempotent: safe to run twice.
--
-- Privacy model (CNIL "mesure d'audience exemptée de consentement"):
--   * Nothing is stored on the visitor's device: no cookie, no localStorage id.
--   * The IP address and the raw user agent are never stored. A visitor is a
--     SHA-256 hash of (secret salt, UTC day, IP, user agent), so the same person
--     cannot be linked from one day to the next, nor across sites.
--   * Rows older than 13 months are deleted (see analytics_purge below).
--
-- Access model (same as the rest of this project): RLS on with no policies and
-- the API roles' privileges revoked. Only server code (Prisma / service role)
-- reads and writes these tables.

-- ---------------------------------------------------------------------------
-- Sessions: one row per visit (30 min of inactivity ends it). Everything that
-- is constant for a visit — acquisition, geography, device — lives here.
-- ---------------------------------------------------------------------------

create table if not exists public.analytics_sessions (
  id            uuid primary key default gen_random_uuid(),
  visitor_id    text not null check (char_length(visitor_id) = 32),
  started_at    timestamptz not null default now(),
  last_seen_at  timestamptz not null default now(),

  entry_path    text not null check (char_length(entry_path) <= 512),
  exit_path     text not null check (char_length(exit_path) <= 512),
  pageviews     integer not null default 0 check (pageviews >= 0),
  events        integer not null default 0 check (events >= 0),
  -- Engaged (visible-tab) time summed over the visit's pages.
  duration_ms   integer not null default 0 check (duration_ms >= 0),

  -- Acquisition (taken from the first hit of the visit)
  channel       text not null default 'direct',
  referrer      text check (char_length(referrer) <= 512),
  referrer_host text check (char_length(referrer_host) <= 255),
  utm_source    text check (char_length(utm_source) <= 120),
  utm_medium    text check (char_length(utm_medium) <= 120),
  utm_campaign  text check (char_length(utm_campaign) <= 120),
  utm_term      text check (char_length(utm_term) <= 120),
  utm_content   text check (char_length(utm_content) <= 120),

  -- Geography (Vercel edge headers; no IP is kept)
  country       text check (char_length(country) <= 2),
  region        text check (char_length(region) <= 64),
  city          text check (char_length(city) <= 120),

  -- Technology
  device        text not null default 'desktop',
  browser       text check (char_length(browser) <= 64),
  os            text check (char_length(os) <= 64),
  screen_width  integer check (screen_width between 0 and 20000),

  -- Language: the site locale (fr/en/es) and the browser's preferred language
  locale        text check (char_length(locale) <= 8),
  language      text check (char_length(language) <= 16)
);

create index if not exists analytics_sessions_started_idx
  on public.analytics_sessions (started_at desc);
create index if not exists analytics_sessions_visitor_seen_idx
  on public.analytics_sessions (visitor_id, last_seen_at desc);
create index if not exists analytics_sessions_last_seen_idx
  on public.analytics_sessions (last_seen_at desc);

-- ---------------------------------------------------------------------------
-- Events: page views and custom events (order sent, image generated, …).
-- A page view's duration / scroll depth are updated when the visitor leaves it.
-- ---------------------------------------------------------------------------

create table if not exists public.analytics_events (
  id           bigint generated always as identity primary key,
  session_id   uuid not null references public.analytics_sessions(id) on delete cascade,
  created_at   timestamptz not null default now(),

  type         text not null check (type in ('pageview', 'event')),
  -- 'pageview' for page views, the event name otherwise (snake_case).
  name         text not null check (name ~ '^[a-z][a-z0-9_]{0,63}$'),
  path         text not null check (char_length(path) <= 512),
  -- Random id generated in the browser for each page view; links the
  -- "leave" beacon (duration, scroll) and the events fired on that page.
  pageview_id  uuid,

  duration_ms  integer check (duration_ms between 0 and 1800000),
  scroll_depth smallint check (scroll_depth between 0 and 100),
  props        jsonb
);

create index if not exists analytics_events_created_idx
  on public.analytics_events (created_at desc);
create index if not exists analytics_events_session_idx
  on public.analytics_events (session_id, created_at);
create index if not exists analytics_events_type_name_created_idx
  on public.analytics_events (type, name, created_at desc);
create unique index if not exists analytics_events_pageview_uidx
  on public.analytics_events (pageview_id) where type = 'pageview';

-- ---------------------------------------------------------------------------
-- Retention: 13 months. Called opportunistically by the collect endpoint; can
-- also be scheduled with pg_cron:  select cron.schedule('analytics-purge',
-- '17 3 * * *', 'select public.analytics_purge()');
-- ---------------------------------------------------------------------------

create or replace function public.analytics_purge()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted integer;
begin
  delete from public.analytics_sessions
  where started_at < now() - interval '13 months';
  get diagnostics deleted = row_count;
  return deleted;
end;
$$;

-- ---------------------------------------------------------------------------
-- Lock down: server-side access only.
-- ---------------------------------------------------------------------------

alter table public.analytics_sessions enable row level security;
alter table public.analytics_events   enable row level security;

revoke all on public.analytics_sessions from anon, authenticated;
revoke all on public.analytics_events   from anon, authenticated;
revoke all on function public.analytics_purge() from public, anon, authenticated;
