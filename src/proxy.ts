// src/proxy.ts
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { isOAuthCode, isPkceVerifierCookie } from "@/lib/auth-redirect";
import {
  ACTIVITY_COOKIE_NAME,
  ACTIVITY_COOKIE_REFRESH_MS,
  isSessionIdle,
  isSupabaseAuthCookie,
  parseActivityTimestamp,
} from "@/lib/session-activity";

const handleI18nRouting = createMiddleware(routing);

// Only public pages are locale-routed; admin, API and auth routes are not.
function isLocalized(pathname: string) {
  return !/^\/(api|admin|auth)(\/|$)/.test(pathname);
}

function isPrefetch(request: NextRequest) {
  return (
    request.headers.has("next-router-prefetch") ||
    request.headers.get("purpose") === "prefetch"
  );
}

// Server-side idle timeout. The activity cookie is stamped on every real
// request; once it is older than the timeout the Supabase session cookies are
// dropped. getAuthenticatedUser() applies the same check to the incoming
// cookie, because the deletions below only reach the browser's next request.
function applySessionActivity(request: NextRequest, response: NextResponse) {
  const hasSession = request.cookies
    .getAll()
    .some(({ name }) => isSupabaseAuthCookie(name));
  const activity = request.cookies.get(ACTIVITY_COOKIE_NAME)?.value;

  if (!hasSession) {
    if (activity !== undefined) response.cookies.delete(ACTIVITY_COOKIE_NAME);
    return response;
  }

  if (isSessionIdle(activity)) {
    request.cookies
      .getAll()
      .filter(({ name }) => isSupabaseAuthCookie(name))
      .forEach(({ name }) => response.cookies.delete(name));
    response.cookies.delete(ACTIVITY_COOKIE_NAME);
    return response;
  }

  const now = Date.now();
  const last = parseActivityTimestamp(activity);
  const stale = last === null || now - last > ACTIVITY_COOKIE_REFRESH_MS;

  if (stale && !isPrefetch(request)) {
    response.cookies.set(ACTIVITY_COOKIE_NAME, String(now), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  return response;
}

// Safety net for an OAuth/email-confirmation code that lands on the wrong page
// (Supabase falls back to its Site URL when the redirect URL is not allowed).
// Only while this browser holds the PKCE verifier, i.e. a flow it started, and
// never for the callback itself or the API, so it cannot loop: the callback's
// destination is stripped of `code`, and the verifier is gone after the exchange.
function redirectStrayAuthCode(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (request.method !== "GET") return null;
  if (pathname === "/auth/callback" || /^\/api(\/|$)/.test(pathname)) return null;

  const code = searchParams.get("code");
  if (!isOAuthCode(code)) return null;

  const hasVerifier = request.cookies
    .getAll()
    .some(({ name }) => isPkceVerifierCookie(name));
  if (!hasVerifier) return null;

  const target = request.nextUrl.clone();
  target.pathname = "/auth/callback";
  target.search = `?code=${encodeURIComponent(code)}`;

  return NextResponse.redirect(target);
}

export default function proxy(request: NextRequest) {
  const stray = redirectStrayAuthCode(request);
  if (stray) return stray;

  const response = isLocalized(request.nextUrl.pathname)
    ? handleI18nRouting(request)
    : NextResponse.next();

  return applySessionActivity(request, response);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
