"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="relative mt-24 border-t border-neutral-200/60 bg-gradient-to-b from-[#fffaf5] to-[#fff3e8]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,140,60,0.12),transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Branding */}
          <div className="max-w-sm">
            <h2 className="text-lg font-semibold tracking-tight">
              Marcos Papermache
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              {t("description")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
              {t("navigation")}
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-neutral-700">
              <li>
                <Link href="/" className="transition hover:text-orange-500">
                  {t("links.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/sculptures"
                  className="transition hover:text-orange-500"
                >
                  {t("links.sculptures")}
                </Link>
              </li>
              <li>
                <Link
                  href="/creations-sur-mesure"
                  className="transition hover:text-orange-500"
                >
                  {t("links.custom")}
                </Link>
              </li>
              <li>
                <Link
                  href="/create"
                  className="transition hover:text-orange-500"
                >
                  {t("links.ai")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-orange-500"
                >
                  {t("links.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
              {t("contact")}
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-neutral-700">
              <li>
                <a
                  href="mailto:contact@marcospapermache.com"
                  className="transition hover:text-orange-500"
                  aria-label="Email Marcos Papermache"
                >
                  contact@marcospapermache.com
                </a>
              </li>

              <li>
                <a
                  href="https://www.instagram.com/marcospapermache"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-orange-500"
                  aria-label="Instagram Marcos Papermache"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200/60 pt-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Marcos Papermache — {t("rights")}
        </div>
      </div>
    </footer>
  );
}