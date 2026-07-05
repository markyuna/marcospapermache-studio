"use client";

import { useEffect } from "react";

/**
 * The root layout (src/app/layout.tsx) hardcodes <html lang="fr"> since it
 * sits outside the [locale] segment and has no access to the active locale.
 * This syncs it client-side so browser-native controls (file input button,
 * spellcheck, date pickers, etc.) match the current locale.
 */
export default function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
