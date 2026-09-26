// src/app/[locale]/mon-compte/layout.tsx
import type { ReactNode } from "react";
import AccountSessionGuard from "@/components/account/AccountSessionGuard";

export default function MonCompteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <AccountSessionGuard />
      {children}
    </>
  );
}
