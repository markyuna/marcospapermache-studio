// src/hooks/useInactivityLogout.ts
"use client";

import { useCallback, useEffect, useRef } from "react";

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;

type UseInactivityLogoutOptions = {
  timeoutMinutes: number;
  onLogout: () => void;
  storageKey: string;
};

export function useInactivityLogout({
  timeoutMinutes,
  onLogout,
  storageKey,
}: UseInactivityLogoutOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onLogoutRef = useRef(onLogout);
  const lastSeenValueRef = useRef<string | null>(null);

  useEffect(() => {
    onLogoutRef.current = onLogout;
  }, [onLogout]);

  const scheduleTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onLogoutRef.current();
    }, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function broadcastActivity() {
      scheduleTimeout();

      try {
        const value = String(Date.now());
        lastSeenValueRef.current = value;
        window.localStorage.setItem(storageKey, value);
      } catch {
        // localStorage unavailable (private mode, quota, etc.) — the local
        // timer still works, only cross-tab sync is skipped.
      }
    }

    function handleStorage(event: StorageEvent) {
      if (event.key !== storageKey) return;
      if (event.newValue === null) return;
      if (event.newValue === lastSeenValueRef.current) return;

      // Another tab recorded activity — reset our timer only, don't
      // re-broadcast, or every tab would keep echoing the others forever.
      lastSeenValueRef.current = event.newValue;
      scheduleTimeout();
    }

    ACTIVITY_EVENTS.forEach((eventName) =>
      window.addEventListener(eventName, broadcastActivity)
    );
    window.addEventListener("storage", handleStorage);

    scheduleTimeout();

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) =>
        window.removeEventListener(eventName, broadcastActivity)
      );
      window.removeEventListener("storage", handleStorage);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [scheduleTimeout, storageKey]);
}
