// src/lib/admin-auth.ts
import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
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