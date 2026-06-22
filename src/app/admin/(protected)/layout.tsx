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
  await requireAdminPageAccess();

  return (
    <>
      <AdminSessionGuard />
      <AdminNav />
      {children}
    </>
  );
}