// src/lib/auth-redirect.ts
// Shared by the browser (OAuth / email-confirmation start), the auth callback
// route and the proxy, so it must stay free of server-only imports and never
// touch `window` at module level.
import { sanitizeReturnTo } from "@/lib/return-to";

export const RETURN_TO_COOKIE = "auth_return_to";
export const RETURN_TO_MAX_AGE_SECONDS = 10 * 60;

// Browsers silently drop cookies above ~4096 bytes, so a longer value falls
// back to the bare path instead of being lost.
const MAX_COOKIE_VALUE_LENGTH = 3500;

// Supabase (PKCE) keeps its code verifier in `sb-<ref>-auth-token-code-verifier`
// from the moment OAuth starts until the code is exchanged.
const PKCE_VERIFIER_COOKIE = /^sb-.+-auth-token-code-verifier$/;
const OAUTH_CODE = /^[A-Za-z0-9._~-]{1,256}$/;

const PROBE_ORIGIN = "http://return-to.invalid";

export function isPkceVerifierCookie(name: string) {
  return PKCE_VERIFIER_COOKIE.test(name);
}

export function isOAuthCode(value: string | null): value is string {
  return value !== null && OAUTH_CODE.test(value);
}

export function readCookieValue(header: string | null, name: string) {
  if (!header) return null;

  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    if (part.slice(0, separator).trim() !== name) continue;

    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return null;
    }
  }

  return null;
}

// The final destination is never allowed to carry `code`: together with the
// proxy's safety net that makes a callback -> page -> callback loop impossible.
function stripOAuthCode(path: string) {
  const url = new URL(path, PROBE_ORIGIN);
  url.searchParams.delete("code");
  return `${url.pathname}${url.search}`;
}

// Cookie first (it is the freshest intent and carries the full query), then the
// legacy ?next=, then the fallback. Both candidates are untrusted input.
export function resolveReturnTo({
  cookieValue,
  nextParam,
  fallback,
}: {
  cookieValue: string | null;
  nextParam: string | null;
  fallback: string;
}) {
  const candidate =
    sanitizeReturnTo(cookieValue, "") || sanitizeReturnTo(nextParam, fallback);

  return stripOAuthCode(candidate);
}

// --- Browser only (call from event handlers, never during render) ---

// One source of truth for "which origin do we send the user back to": the one
// the visitor is actually on, so the PKCE cookie and the callback share a host.
export function getSiteOrigin() {
  return window.location.origin;
}

// No query on purpose: it matches any Redirect URLs entry in Supabase, and the
// destination travels in a cookie instead.
export function getAuthCallbackUrl() {
  return `${getSiteOrigin()}/auth/callback`;
}

export function saveReturnTo(returnTo?: string) {
  const { pathname, search, protocol } = window.location;

  let value = sanitizeReturnTo(returnTo ?? `${pathname}${search}`, pathname);
  if (encodeURIComponent(value).length > MAX_COOKIE_VALUE_LENGTH) {
    value = pathname;
  }

  const secure = protocol === "https:" ? "; Secure" : "";

  document.cookie =
    `${RETURN_TO_COOKIE}=${encodeURIComponent(value)}` +
    `; Max-Age=${RETURN_TO_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
}
