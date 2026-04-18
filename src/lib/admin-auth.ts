// src/lib/admin-auth.ts
import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getAllowedAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function getAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function requireAdmin() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      ok: false as const,
      status: 401,
      error: "Non authentifié.",
    };
  }

  const email = user.email?.toLowerCase();
  const allowedEmails = getAllowedAdminEmails();

  if (!email || !allowedEmails.includes(email)) {
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