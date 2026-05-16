// src/components/analytics/ClarityInit.tsx

"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export default function ClarityInit() {
  useEffect(() => {
    if (!projectId) {
      console.warn("Microsoft Clarity project ID is missing.");
      return;
    }

    Clarity.init(projectId);

    if (process.env.NODE_ENV === "production") {
      console.log("Microsoft Clarity initialized.");
    }
  }, []);

  return null;
}