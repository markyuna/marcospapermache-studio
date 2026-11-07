// src/components/account/AccountSessionGuard.tsx
"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase/client";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import { SESSION_IDLE_TIMEOUT_MINUTES } from "@/lib/session-activity";

const LOGIN_PATH = "/connexion";
const PROTECTED_PREFIX = "/mon-compte";

// Mounted in the locale layout, so it runs on every public page — it must do
// nothing for visitors who are not signed in.
export default function AccountSessionGuard() {
  const pathname = usePathname();
  const locale = useLocale();
  const selfInitiatedSignOutRef = useRef(false);

  const handleInactivityTimeout = useCallback(async () => {
    if (pathname === LOGIN_PATH) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    selfInitiatedSignOutRef.current = true;
    await supabase.auth.signOut();

    window.location.href = `/${locale}${LOGIN_PATH}?reason=inactivity`;
  }, [pathname, locale]);

  const handleKeepAlive = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const response = await fetch("/api/session/touch", { method: "POST" });
      // The server already considers the session idle (e.g. the laptop slept
      // past the timeout) — end it here too.
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

      if (selfInitiatedSignOutRef.current) {
        selfInitiatedSignOutRef.current = false;
        return;
      }

      // Signed out in another tab. Only protected pages need to leave; public
      // pages stay put (the logout button navigates by itself).
      if (!pathname.startsWith(PROTECTED_PREFIX)) return;

      window.location.href = `/${locale}${LOGIN_PATH}`;
    });

    return () => data.subscription.unsubscribe();
  }, [pathname, locale]);

  return null;
}
