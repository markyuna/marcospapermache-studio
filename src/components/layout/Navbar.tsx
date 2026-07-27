// src/components/layout/Navbar.tsx

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { Space_Grotesk } from "next/font/google";

import { Link, usePathname } from "@/i18n/navigation";
import AccountMenu from "@/components/layout/AccountMenu";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import frMessages from "@/messages/fr.json";
import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const navLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/sculptures", key: "sculptures" },
  { href: "/creations-sur-mesure", key: "custom" },
  { href: "/create", key: "ai" },
] as const;

// Every locale's label for each nav link, stacked (not just the active one)
// so each link's box always reserves the width of its longest translation —
// otherwise the pill's total width (and everything anchored to it) shifts
// when switching between FR/EN/ES.
const NAV_LABELS_BY_LOCALE = {
  fr: frMessages.Navbar,
  en: enMessages.Navbar,
  es: esMessages.Navbar,
} as const;

const LOCALES = Object.keys(NAV_LABELS_BY_LOCALE) as (keyof typeof NAV_LABELS_BY_LOCALE)[];

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
  const [scrolled, setScrolled] = useState(false);
  const [taglineWidth, setTaglineWidth] = useState<number | null>(null);
  const marcosRef = useRef<HTMLSpanElement | null>(null);

  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const locale = useLocale() as keyof typeof NAV_LABELS_BY_LOCALE;

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
      if (window.innerWidth >= 1024) setOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const measureTaglineWidth = () => {
      if (marcosRef.current) {
        setTaglineWidth(marcosRef.current.offsetWidth);
      }
    };

    measureTaglineWidth();
    window.addEventListener("resize", measureTaglineWidth);

    // Re-measure once the serif fallback stack has actually settled, since
    // system fonts can swap after first paint and shift the word's width.
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(measureTaglineWidth).catch(() => {});
    }

    return () => window.removeEventListener("resize", measureTaglineWidth);
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

      setScrolled(currentScrollY > 30);

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

      setIsHidden(delta > 0);
      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [open, isLightboxOpen]);

  return (
    <header
      className={clsx(
        "navbar navbar-surface sticky top-0 z-50 w-full transition-all duration-500",
        scrolled && "navbar-surface--scrolled",
        isLightboxOpen || isHidden
          ? "pointer-events-none -translate-y-full opacity-0"
          : "translate-y-0 opacity-100"
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:py-4">
        <Link
          href="/"
          onClick={handleNavigation}
          className="group relative z-10 -ml-1 flex shrink-0 items-center gap-2.5 sm:-ml-2 sm:gap-3"
          aria-label="Marcos Papermache — Paper mâché studio"
        >
          <span
            className="relative h-12 w-auto shrink-0 transition duration-700 ease-out group-hover:scale-[1.03] sm:h-14 lg:h-16"
            style={{ aspectRatio: "1 / 1" }}
          >
            <Image
              src="/logo-mark.png"
              alt=""
              fill
              priority
              unoptimized
              sizes="64px"
              className="object-contain drop-shadow-[0_3px_6px_rgba(24,21,18,0.22)]"
            />
          </span>

          <span
            aria-hidden="true"
            className="hidden h-8 w-px shrink-0 bg-brand-gold/45 lg:block"
          />

          <span className="flex flex-col items-center justify-center">
            <span
              ref={marcosRef}
              className="hidden font-serif text-[1.15rem] font-medium leading-none tracking-[0.16em] text-[#181512] sm:text-[1.35rem] md:block lg:text-2xl"
            >
              MARCOS
            </span>

            <span
              className="mt-2.5 hidden items-center justify-center gap-1.5 lg:flex"
              style={taglineWidth ? { width: taglineWidth } : undefined}
            >
              <span aria-hidden="true" className="h-px min-w-1.5 flex-1 bg-brand-gold/60" />
              <span
                className={clsx(
                  space.className,
                  "shrink-0 whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.22em] text-neutral-500"
                )}
              >
                PAPER MÂCHÉ STUDIO
              </span>
              <span aria-hidden="true" className="h-px min-w-1.5 flex-1 bg-brand-gold/60" />
            </span>
          </span>
        </Link>

        <nav
          className={clsx(
            space.className,
            "group/nav relative hidden h-16 shrink-0 items-center gap-6 overflow-hidden rounded-full border border-black/10 bg-white/55 px-9 shadow-[0_24px_80px_rgba(20,20,20,0.075)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/42 lg:ml-8 lg:flex xl:ml-8 xl:gap-8"
          )}
        >
          <div className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-b from-white/85 via-white/35 to-[#f5eadc]/35" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white/90 to-transparent" />
          <div className="pointer-events-none absolute -left-24 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[#d9a15e]/10 blur-2xl transition-transform duration-700 group-hover/nav:translate-x-20" />

          {navLinks.map((link) => {
            const isActive = isActiveLink(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavigation}
                className={clsx(
                  "group relative z-10 flex h-full items-center text-[13px] font-medium uppercase tracking-[0.18em] transition-all duration-300",
                  isActive
                    ? "text-neutral-950"
                    : "text-neutral-600 hover:-translate-y-px hover:text-neutral-950"
                )}
              >
                <span className="relative grid">
                  {LOCALES.map((loc) => (
                    <span
                      key={loc}
                      style={{ gridRowStart: 1, gridColumnStart: 1 }}
                      className={clsx(
                        "whitespace-nowrap",
                        loc === locale ? "visible" : "invisible"
                      )}
                    >
                      {NAV_LABELS_BY_LOCALE[loc][link.key]}
                    </span>
                  ))}
                </span>

                <span
                  className={clsx(
                    "absolute bottom-[15px] left-1/2 h-px w-full -translate-x-1/2 origin-center rounded-full bg-linear-to-r from-transparent via-[#c88a45] to-transparent transition-all duration-500",
                    isActive
                      ? "scale-x-100 opacity-100"
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                  )}
                />

                <span
                  className={clsx(
                    "absolute bottom-[13px] left-1/2 h-3 w-12 -translate-x-1/2 rounded-full bg-[#d99a50]/20 blur-md transition-all duration-500",
                    isActive
                      ? "scale-100 opacity-100"
                      : "scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-70"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div aria-hidden="true" className="hidden lg:block lg:flex-1" />

        <div className="relative hidden shrink-0 items-center gap-3 lg:flex">
          <LocaleSwitcher />
          <AccountMenu onNavigate={closeMenu} />
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/80 text-neutral-950 shadow-[0_14px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl transition hover:bg-[#f8f1e8] lg:hidden"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          aria-expanded={open}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      <div
        className={clsx(
          "mx-auto w-full max-w-6xl overflow-hidden px-4 transition-all duration-300 sm:px-6 lg:hidden",
          open ? "max-h-[620px] pb-4 opacity-100" : "max-h-0 pb-0 opacity-0"
        )}
      >
        <nav
          className={clsx(
            space.className,
            "relative overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/90 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-white/30 to-[#f5eadc]/35" />

          <div className="relative z-10 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavigation}
                  className={clsx(
                    "group flex items-center justify-between rounded-2xl px-4 py-3 text-[14px] font-medium uppercase tracking-[0.16em] transition",
                    isActive
                      ? "bg-[#f8f1e8] text-neutral-950"
                      : "text-neutral-700 hover:bg-[#f8f1e8] hover:text-neutral-950"
                  )}
                >
                  <span>{t(link.key)}</span>

                  <span
                    className={clsx(
                      "h-px w-8 rounded-full bg-linear-to-r from-[#b77b42] to-[#f4d7a1] transition",
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="relative z-10 mt-3 flex items-center justify-between gap-3 border-t border-black/10 pt-3">
            <LocaleSwitcher mobile onChange={closeMenu} />
            <AccountMenu onNavigate={closeMenu} />
          </div>
        </nav>
      </div>
    </header>
  );
}