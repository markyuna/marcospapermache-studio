// src/components/admin/AnalyticsSelfExclusion.tsx
// Any browser used for the admin is excluded from the public-site analytics by
// default, unless it was explicitly re-included from the Analytics page ("0").
"use client";

import { useEffect } from "react";
import { IGNORE_STORAGE_KEY } from "@/lib/analytics/shared";

export default function AnalyticsSelfExclusion() {
  useEffect(() => {
    try {
      if (window.localStorage.getItem(IGNORE_STORAGE_KEY) === null) {
        window.localStorage.setItem(IGNORE_STORAGE_KEY, "1");
      }
    } catch {
      // storage blocked: nothing to do
    }
  }, []);

  return null;
}
