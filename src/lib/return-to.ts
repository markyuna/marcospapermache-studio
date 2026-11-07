// src/lib/return-to.ts
// Post-login "where to go back to" values travel through the URL, so they are
// untrusted input. Only same-site paths survive; everything else falls back.

// /create carries up to 500 prompt characters; with accents each one
// percent-encodes to 6 characters, so the longest realistic URL is ~3.2k.
export const MAX_RETURN_TO_LENGTH = 4096;

// Throwaway base used only to check that a value resolves to the same origin.
const PROBE_ORIGIN = "http://return-to.invalid";

export function sanitizeReturnTo(
  value: string | null | undefined,
  fallback: string
): string {
  if (!value || value.length > MAX_RETURN_TO_LENGTH) return fallback;

  // Must be an absolute path on this site: not "//host", not "/\host", not a
  // scheme, no backslashes (browsers treat them as slashes) or control chars.
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return fallback;

  let parsed: URL;
  try {
    parsed = new URL(value, PROBE_ORIGIN);
  } catch {
    return fallback;
  }

  if (parsed.origin !== PROBE_ORIGIN) return fallback;

  // Never bounce a user into the API or back into the auth endpoints.
  if (/^\/(api|auth)(\/|$)/.test(parsed.pathname)) return fallback;

  return `${parsed.pathname}${parsed.search}`;
}
