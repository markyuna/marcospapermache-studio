// src/components/account/AccountSessionGuard.tsx
"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase/client";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";

const TIMEOUT_MINUTES = 15;
const LOGIN_PATH = "/connexion";

export default function AccountSessionGuard() {
  const pathname = usePathname();
  const selfInitiatedSignOutRef = useRef(false);

  const handleInactivityTimeout = useCallback(async () => {
    if (pathname === LOGIN_PATH) return;

    selfInitiatedSignOutRef.current = true;
    await supabase.auth.signOut();

    window.location.href = `${LOGIN_PATH}?reason=inactivity`;
  }, [pathname]);

  useInactivityLogout({
    timeoutMinutes: TIMEOUT_MINUTES,
    onLogout: handleInactivityTimeout,
    storageKey: "mp-last-activity",
  });

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_OUT") return;
      if (pathname === LOGIN_PATH) return;

      if (selfInitiatedSignOutRef.current) {
        selfInitiatedSignOutRef.current = false;
        return;
      }

      window.location.href = LOGIN_PATH;
    });

    return () => data.subscription.unsubscribe();
  }, [pathname]);

  return null;
}
