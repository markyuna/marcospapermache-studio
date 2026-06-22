// src/components/admin/AdminLogoutButton.tsx
"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut({ scope: "local" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
    >
      Déconnexion
    </button>
  );
}