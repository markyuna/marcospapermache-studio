"use client";

import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

const TIMEOUT = 30 * 60 * 1000;

export default function AdminSessionGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (pathname === "/admin/login") return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      await supabase.auth.signOut();
      router.replace("/admin/login");
    }, TIMEOUT);
  }, [pathname, router]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [resetTimer]);

  useEffect(() => {
    const handleUnload = () => {
      supabase.auth.signOut();
    };

    window.addEventListener("beforeunload", handleUnload);

    return () =>
      window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return null;
}