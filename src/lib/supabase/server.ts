// src/lib/supabase/server.ts
import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function getEnvVar(
  name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called during a Server Component render, where cookies are
          // read-only. Safe to ignore here because the actual session
          // write happens in the Route Handler (/auth/callback) and in
          // supabase.auth.signOut()/signInWithPassword() on the client.
        }
      },
    },
  });
}