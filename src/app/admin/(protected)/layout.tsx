// src/app/admin/(protected)/layout.tsx
import type { ReactNode } from "react";
import { requireAdminPageAccess } from "@/lib/admin-auth";
import AdminSessionGuard from "@/components/admin/AdminSessionGuard";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t0 = Date.now();
  await requireAdminPageAccess();
  console.log(`[admin layout] auth: ${Date.now() - t0}ms`);

  return (
    <>
      <AdminSessionGuard />
      <AdminNav />
      {children}
    </>
  );
}