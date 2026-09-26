// src/components/admin/AdminSessionGuard.tsx
"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";

const TIMEOUT_MINUTES = 15;
const LOGIN_PATH = "/admin/login";

export default function AdminSessionGuard() {
  const pathname = usePathname();
  const selfInitiatedSignOutRef = useRef(false);

  const handleInactivityTimeout = useCallback(async () => {
    if (pathname === LOGIN_PATH) return;

    selfInitiatedSignOutRef.current = true;
    await supabase.auth.signOut();

    const nextPath = encodeURIComponent(pathname);
    window.location.href = `${LOGIN_PATH}?next=${nextPath}&reason=inactivity`;
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
        // This tab already redirected itself (with the inactivity reason)
        // right after calling signOut() — don't overwrite that navigation.
        selfInitiatedSignOutRef.current = false;
        return;
      }

      // signOut() happened in another tab (manual logout or its own
      // inactivity timeout) — Supabase synced the session change here.
      window.location.href = LOGIN_PATH;
    });

    return () => data.subscription.unsubscribe();
  }, [pathname]);

  return null;
}
