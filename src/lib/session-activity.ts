// src/lib/session-activity.ts
// Shared by the proxy (edge) and server code, so it must stay free of
// server-only imports.

export const SESSION_IDLE_TIMEOUT_MINUTES = 15;
export const SESSION_IDLE_TIMEOUT_MS = SESSION_IDLE_TIMEOUT_MINUTES * 60 * 1000;

export const ACTIVITY_COOKIE_NAME = "mp-last-activity";

// Avoid emitting a Set-Cookie on every single request.
export const ACTIVITY_COOKIE_REFRESH_MS = 60 * 1000;

// Supabase stores the session as `sb-<ref>-auth-token`, split into
// `.0`, `.1`, … chunks when it is large.
const SUPABASE_AUTH_COOKIE = /^sb-.+-auth-token(\.\d+)?$/;

export function isSupabaseAuthCookie(name: string) {
  return SUPABASE_AUTH_COOKIE.test(name);
}

export function parseActivityTimestamp(value: string | undefined) {
  if (!value) return null;

  const timestamp = Number(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

// A missing/garbled cookie is not idle: it just means the session is new and
// the proxy has not stamped it yet.
export function isSessionIdle(value: string | undefined, now = Date.now()) {
  const last = parseActivityTimestamp(value);
  if (last === null) return false;

  return now - last > SESSION_IDLE_TIMEOUT_MS;
}
