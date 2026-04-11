"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { Container } from "./container";

export function SiteHeader() {
  const t = useTranslations("Navbar");

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-2xl">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ff6a00]/15 bg-gradient-to-br from-[#fff4ea] to-[#f3e8dc] shadow-sm">
            <Sparkles className="h-4 w-4 text-[#ff6a00]" />
          </div>

          <div className="leading-tight">
            <p className="text-sm uppercase tracking-[0.28em] text-[#9a6b47]">
              Marcos
            </p>
            <p className="text-sm font-medium text-[#1a1a1a]">
              Papermache Studio
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm text-[#5f5348] transition hover:text-[#ff6a00]"
          >
            {t("home")}
          </Link>

          <Link
            href="/about"
            className="text-sm text-[#5f5348] transition hover:text-[#ff6a00]"
          >
            {t("about")}
          </Link>

          <Link
            href="/sculptures"
            className="text-sm text-[#5f5348] transition hover:text-[#ff6a00]"
          >
            {t("sculptures")}
          </Link>

          <Link
            href="/creations-sur-mesure"
            className="text-sm text-[#5f5348] transition hover:text-[#ff6a00]"
          >
            {t("custom")}
          </Link>

          <Link
            href="/create"
            className="text-sm text-[#5f5348] transition hover:text-[#ff6a00]"
          >
            {t("ai")}
          </Link>

          <Link
            href="/contact"
            className="text-sm text-[#5f5348] transition hover:text-[#ff6a00]"
          >
            {t("contact")}
          </Link>
        </nav>

      </Container>
    </header>
  );
}