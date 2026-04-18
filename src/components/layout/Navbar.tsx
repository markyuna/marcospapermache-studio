"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Space_Grotesk } from "next/font/google";

import { Link, usePathname } from "@/i18n/navigation";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const navLinks = [
  { href: "/", key: "home", width: "min-w-[94px]" },
  { href: "/about", key: "about", width: "min-w-[100px]" },
  { href: "/sculptures", key: "sculptures", width: "min-w-[120px]" },
  { href: "/creations-sur-mesure", key: "custom", width: "min-w-[158px]" },
  { href: "/create", key: "ai", width: "min-w-[118px]" },
  { href: "/contact", key: "contact", width: "min-w-[102px]" },
] as const;

function getLightboxOpenState() {
  if (typeof document === "undefined") return false;

  return (
    document.body.dataset.lightboxOpen === "true" ||
    document.documentElement.dataset.lightboxOpen === "true"
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(getLightboxOpenState);
  const [isHidden, setIsHidden] = useState(false);

  const pathname = usePathname();
  const t = useTranslations("Navbar");

  const lastScrollY = useRef(0);

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((prev) => !prev);

  const handleNavigation = () => {
    setOpen(false);
    setIsHidden(false);
    lastScrollY.current = 0;
  };

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
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
    const observer = new MutationObserver(() => {
      setIsLightboxOpen(getLightboxOpenState());
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-lightbox-open"],
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-lightbox-open"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isLightboxOpen) return;

    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isLightboxOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (open || isLightboxOpen) {
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY <= 16) {
        setIsHidden(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollY.current;
      const threshold = 8;

      if (Math.abs(delta) < threshold) return;

      if (delta > 0) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open, isLightboxOpen]);

  return (
    <header
      className={clsx(
        "navbar sticky top-0 z-50 w-full border-b border-black/5 bg-white/65 backdrop-blur-xl transition-all duration-500 supports-[backdrop-filter]:bg-white/45",
        isLightboxOpen || isHidden
          ? "pointer-events-none -translate-y-full opacity-0"
          : "translate-y-0 opacity-100"
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8 xl:px-10">
        <Link
          href="/"
          onClick={handleNavigation}
          className="group relative flex shrink-0 items-center"
          aria-label="Marcos Papermache"
        >
          <div className="relative h-24 w-44 sm:h-28 sm:w-52 lg:h-32 lg:w-60 xl:h-36 xl:w-72">
            <Image
              src="/logo.png"
              alt="Marcos Papermache"
              fill
              priority
              className="object-contain object-left transition duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-end lg:flex">
          <nav
            className={clsx(
              space.className,
              "flex flex-1 items-center justify-center gap-2 xl:gap-2.5"
            )}
          >
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavigation}
                  className={clsx(
                    "group relative flex h-[68px] max-w-[180px] items-center justify-center px-4 text-center text-[18px] font-stretch-expanded leading-none tracking-tight transition-all duration-300",
                    link.width,
                    isActive
                      ? "text-neutral-950"
                      : "text-neutral-600 hover:text-neutral-900"
                  )}
                >
                  <span className="line-clamp-1 whitespace-nowrap">
                    {t(link.key)}
                  </span>

                  <span
                    className={clsx(
                      "absolute bottom-[10px] left-1/2 h-[2px] w-[calc(100%-2.1rem)] -translate-x-1/2 origin-center rounded-full bg-gradient-to-r from-[#ff7a18] via-[#ffb347] to-[#ffd28a] transition-transform duration-300",
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-5 shrink-0">
            <LocaleSwitcher />
          </div>
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/85 text-neutral-900 shadow-sm transition hover:bg-[#f8f1e8] lg:hidden"
          aria-label={open ? t("closeMenu") : t("openMenu")}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={clsx(
          "overflow-hidden border-t border-black/5 bg-white/90 backdrop-blur-xl transition-all duration-300 lg:hidden",
          open ? "max-h-[560px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav
          className={clsx(
            space.className,
            "mx-auto flex w-full max-w-7xl flex-col px-5 py-5 sm:px-6"
          )}
        >
          {navLinks.map((link) => {
            const isActive = isActiveLink(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavigation}
                className={clsx(
                  "rounded-2xl px-4 py-3 text-[18px] font-medium tracking-[0.06em] transition",
                  isActive
                    ? "bg-[#f8f1e8] text-neutral-950"
                    : "text-neutral-700 hover:bg-[#f8f1e8] hover:text-neutral-950"
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