// src/lib/admin-auth.ts
import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACTIVITY_COOKIE_NAME, isSessionIdle } from "@/lib/session-activity";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getAllowedAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

// Single source of truth for admin status — reused by requireAdmin() and by
// any route/page that needs to branch behavior for admins without redirecting.
export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  return getAllowedAdminEmails().includes(email.toLowerCase());
}

// Deduplicates auth.getUser() within a single request render pass
export const getAuthenticatedUser = cache(async () => {
  // The proxy stamps this cookie on every request; an old stamp means the
  // session sat idle past the timeout, even if the Supabase token is valid.
  const cookieStore = await cookies();
  if (isSessionIdle(cookieStore.get(ACTIVITY_COOKIE_NAME)?.value)) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
});

export async function requireAdmin() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      ok: false as const,
      status: 401,
      error: "Non authentifié.",
    };
  }

  if (!isAdminEmail(user.email)) {
    return {
      ok: false as const,
      status: 403,
      error: "Accès interdit.",
    };
  }

  return {
    ok: true as const,
    user,
  };
}

export async function requireAdminPageAccess() {
  const auth = await requireAdmin();

  if (!auth.ok) {
    redirect("/admin/login");
  }

  return auth.user;
}