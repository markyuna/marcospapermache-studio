"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LogoutButton() {
  const t = useTranslations("AccountPage.dashboard");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e1d2c4] bg-white px-4 py-2 text-sm font-medium text-[#181512] transition duration-300 hover:bg-[#f8f4ef] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" />
      {t("logout")}
    </button>
  );
}
