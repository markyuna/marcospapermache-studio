// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import { sanitizeReturnTo } from "@/lib/return-to";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // `next` comes from the URL: only same-site paths are followed, otherwise
  // `${origin}${next}` could be turned into a redirect to another host.
  const next = sanitizeReturnTo(
    searchParams.get("next"),
    `/${routing.defaultLocale}/mon-compte`
  );

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/${routing.defaultLocale}/connexion`);
}
