"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { Container } from "./container";

export function SiteFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-black/5 bg-white/40 backdrop-blur-sm">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-[#1a1a1a]">
            Marcos Papermache
          </p>
          <p className="mt-1 max-w-md text-sm text-[#6f6257]">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-[#6f6257]">
          <Link href="/" className="transition hover:text-[#ff6a00]">
            {t("links.home")}
          </Link>

          <Link href="/sculptures" className="transition hover:text-[#ff6a00]">
            {t("links.sculptures")}
          </Link>

          <Link
            href="/creations-sur-mesure"
            className="transition hover:text-[#ff6a00]"
          >
            {t("links.custom")}
          </Link>

          <Link href="/contact" className="transition hover:text-[#ff6a00]">
            {t("links.contact")}
          </Link>
        </div>
      </Container>
    </footer>
  );
}