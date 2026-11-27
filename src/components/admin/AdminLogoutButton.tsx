// src/components/admin/AdminLogoutButton.tsx
"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut({ scope: "local" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
    >
      <LogOut className="h-4 w-4" aria-hidden />
      {/* Icon only on the narrowest phones; the label stays for screen readers. */}
      <span className="max-[359px]:sr-only">Déconnexion</span>
    </button>
  );
}