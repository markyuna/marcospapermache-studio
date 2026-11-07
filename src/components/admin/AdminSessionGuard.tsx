// src/components/admin/AdminSessionGuard.tsx
"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import { SESSION_IDLE_TIMEOUT_MINUTES } from "@/lib/session-activity";

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

  const handleKeepAlive = useCallback(async () => {
    try {
      const response = await fetch("/api/session/touch", { method: "POST" });
      // Server says the session is idle (e.g. the machine slept past the timeout).
      if (response.status === 401) await handleInactivityTimeout();
    } catch {
      // Offline — the next activity will retry.
    }
  }, [handleInactivityTimeout]);

  useInactivityLogout({
    timeoutMinutes: SESSION_IDLE_TIMEOUT_MINUTES,
    onLogout: handleInactivityTimeout,
    onKeepAlive: handleKeepAlive,
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
