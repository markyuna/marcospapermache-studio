// src/app/auth/callback/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import {
  readCookieValue,
  resolveReturnTo,
  RETURN_TO_COOKIE,
} from "@/lib/auth-redirect";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Where to go afterwards. The cookie (set right before OAuth / sign-up) and
  // ?next= are both untrusted: resolveReturnTo only lets same-site paths
  // through, otherwise `${origin}${next}` could redirect to another host.
  const next = resolveReturnTo({
    cookieValue: readCookieValue(request.headers.get("cookie"), RETURN_TO_COOKIE),
    nextParam: searchParams.get("next"),
    fallback: `/${routing.defaultLocale}/mon-compte`,
  });

  // Single use, whatever the outcome.
  (await cookies()).delete(RETURN_TO_COOKIE);

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/${routing.defaultLocale}/connexion`);
}
