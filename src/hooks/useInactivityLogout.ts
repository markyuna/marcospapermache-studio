// src/hooks/useInactivityLogout.ts
"use client";

import { useCallback, useEffect, useRef } from "react";

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;

// mousemove/scroll fire dozens of times per second; resetting the timer and
// writing to localStorage that often is wasted work.
const ACTIVITY_THROTTLE_MS = 1000;

type UseInactivityLogoutOptions = {
  timeoutMinutes: number;
  onLogout: () => void;
  storageKey: string;
  // Called at most once per keepAliveIntervalMs while the user is active, to
  // renew the server-side activity cookie.
  onKeepAlive?: () => void;
  keepAliveIntervalMs?: number;
};

export function useInactivityLogout({
  timeoutMinutes,
  onLogout,
  storageKey,
  onKeepAlive,
  keepAliveIntervalMs = 5 * 60 * 1000,
}: UseInactivityLogoutOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onLogoutRef = useRef(onLogout);
  const onKeepAliveRef = useRef(onKeepAlive);
  const lastSeenValueRef = useRef<string | null>(null);
  const lastHandledRef = useRef(0);
  const lastKeepAliveRef = useRef(0);

  useEffect(() => {
    onLogoutRef.current = onLogout;
    onKeepAliveRef.current = onKeepAlive;
  }, [onLogout, onKeepAlive]);

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
      const now = Date.now();
      if (now - lastHandledRef.current < ACTIVITY_THROTTLE_MS) return;
      lastHandledRef.current = now;

      scheduleTimeout();

      if (
        onKeepAliveRef.current &&
        now - lastKeepAliveRef.current >= keepAliveIntervalMs
      ) {
        lastKeepAliveRef.current = now;
        onKeepAliveRef.current();
      }

      try {
        const value = String(now);
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

    // Timers are throttled in background tabs and frozen while the machine
    // sleeps, so on return compare against the last recorded activity instead
    // of trusting the timer.
    function handleVisibility() {
      if (document.visibilityState !== "visible") return;

      try {
        const stored = window.localStorage.getItem(storageKey);
        const last = stored ? Number(stored) : NaN;

        if (
          Number.isFinite(last) &&
          Date.now() - last > timeoutMinutes * 60 * 1000
        ) {
          onLogoutRef.current();
        }
      } catch {
        // localStorage unavailable — fall back to the timer alone.
      }
    }

    ACTIVITY_EVENTS.forEach((eventName) =>
      window.addEventListener(eventName, broadcastActivity, { passive: true })
    );
    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibility);

    // Loading the page counts as activity; it also replaces a stale stamp
    // left by an earlier session, which handleVisibility would misread.
    try {
      const value = String(Date.now());
      lastSeenValueRef.current = value;
      window.localStorage.setItem(storageKey, value);
    } catch {
      // see broadcastActivity
    }

    scheduleTimeout();

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) =>
        window.removeEventListener(eventName, broadcastActivity)
      );
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [scheduleTimeout, storageKey, keepAliveIntervalMs, timeoutMinutes]);
}
