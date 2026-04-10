// src/components/layout/Navbar.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/sculptures", key: "sculptures" },
  { href: "/creations-sur-mesure", key: "custom" },
  { href: "/create", key: "ai" },
  { href: "/contact", key: "contact" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Navbar");

  const closeMenu = () => setOpen(false);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="navbar sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-2xl transition-all duration-500 supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3 sm:px-6 lg:px-10">
        <Link
          href="/"
          onClick={closeMenu}
          className="group relative flex shrink-0 items-center"
          aria-label="Marcos Papermache - Home"
        >
          <div className="relative h-20 w-40 sm:h-24 sm:w-48 lg:h-28 lg:w-56">
            <Image
              src="/logo.png"
              alt="Marcos Papermache"
              fill
              priority
              className="object-contain object-left transition duration-300 group-hover:scale-[1.02]"
            />
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
          {navLinks.map((link) => {
            const isActive = isActiveLink(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={clsx(
                  "group relative inline-flex items-center text-[15px] font-medium tracking-[0.01em] transition-colors duration-300",
                  isActive
                    ? "text-neutral-950"
                    : "text-neutral-700 hover:text-neutral-950"
                )}
              >
                <span>{t(link.key)}</span>

                <span
                  className={clsx(
                    "absolute -bottom-2 left-0 h-[2px] w-full origin-left rounded-full bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200 transition-transform duration-300",
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            );
          })}

          <LocaleSwitcher />

          <Link
            href="/contact"
            onClick={closeMenu}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200 px-5 py-3 text-sm font-semibold text-neutral-950 shadow-[0_10px_30px_rgba(251,146,60,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(251,146,60,0.28)]"
          >
            {t("order")}
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-900 shadow-sm transition hover:bg-orange-50 lg:hidden"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={clsx(
          "overflow-hidden border-t border-black/5 bg-white/95 backdrop-blur-2xl transition-all duration-300 lg:hidden",
          open ? "max-h-[560px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="mx-auto flex w-full max-w-7xl flex-col px-5 py-5 sm:px-6">
          {navLinks.map((link) => {
            const isActive = isActiveLink(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={clsx(
                  "rounded-2xl px-4 py-3 text-base font-medium transition",
                  isActive
                    ? "bg-orange-50 text-neutral-950"
                    : "text-neutral-700 hover:bg-orange-50 hover:text-neutral-950"
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}

          <LocaleSwitcher mobile onChange={closeMenu} />

          <Link
            href="/contact"
            onClick={closeMenu}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200 px-6 py-3 text-base font-semibold text-neutral-950 shadow-[0_10px_30px_rgba(251,146,60,0.22)] transition-all duration-300 hover:-translate-y-0.5"
          >
            {t("order")}
          </Link>
        </nav>
      </div>
    </header>
  );
}