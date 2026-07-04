import "server-only";
import { redirect } from "next/navigation";

import { getAuthenticatedUser } from "@/lib/admin-auth";

export async function requireUserPageAccess(locale: string) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(`/${locale}/connexion`);
  }

  return user;
}
