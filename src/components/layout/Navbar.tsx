"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";

const navLinks = [
  { href: "/", key: "home", width: "min-w-[90px]" },
  { href: "/about", key: "about", width: "min-w-[96px]" },
  { href: "/sculptures", key: "sculptures", width: "min-w-[110px]" },
  { href: "/creations-sur-mesure", key: "custom", width: "min-w-[138px]" },
  { href: "/experience-ia", key: "ai", width: "min-w-[118px]" },
  { href: "/contact", key: "contact", width: "min-w-[98px]" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Navbar");

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((prev) => !prev);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="navbar sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-2xl transition-all duration-500 supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-6 lg:px-8 xl:px-10">
        <Link
          href="/"
          onClick={closeMenu}
          className="group relative flex shrink-0 items-center"
          aria-label="Marcos Papermache"
        >
          <div className="relative h-20 w-36 sm:h-24 sm:w-44 lg:h-24 lg:w-48 xl:h-28 xl:w-56">
            <Image
              src="/logo.png"
              alt="Marcos Papermache"
              fill
              priority
              className="object-contain object-left transition duration-300 group-hover:scale-[1.02]"
            />
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-end lg:flex">
          <nav className="flex flex-1 items-center justify-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "group relative flex h-16 max-w-[150px] items-center justify-center px-3 text-center text-[15px] font-medium leading-tight tracking-[0.01em] transition-colors duration-300",
                    link.width,
                    isActive
                      ? "text-neutral-950"
                      : "text-neutral-700 hover:text-neutral-950"
                  )}
                >
                  <span className="line-clamp-2">{t(link.key)}</span>

                  <span
                    className={clsx(
                      "absolute bottom-1 left-1/2 h-[2px] w-[calc(100%-1.5rem)] -translate-x-1/2 origin-center rounded-full bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200 transition-transform duration-300",
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-4 shrink-0">
            <LocaleSwitcher />
          </div>
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-900 shadow-sm transition hover:bg-orange-50 lg:hidden"
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
        </nav>
      </div>
    </header>
  );
}