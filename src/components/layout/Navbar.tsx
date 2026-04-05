"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/sculptures", label: "Sculptures" },
  { href: "/creations-sur-mesure", label: "Créations sur mesure" },
  { href: "/experience-ia", label: "Expérience IA" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:h-26 lg:px-10">
        <Link href="/" className="group flex items-center">
            <div className="relative h-24 w-44 sm:h-28 sm:w-52 lg:h-32 lg:w-60">
                <Image
                src="/logo.png"
                alt="Marcos Papermache"
                fill
                priority
                className="object-contain object-left transition duration-300 group-hover:scale-[1.03]"
                />
            </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex xl:gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "group relative text-[15px] font-medium tracking-[0.01em] transition",
                  isActive
                    ? "text-black"
                    : "text-neutral-700 hover:text-black"
                )}
              >
                {link.label}
                <span
                  className={clsx(
                    "absolute -bottom-2 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-orange-400 to-amber-300 transition-transform duration-300",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            );
          })}

          <Link
            href="/contact"
            className="rounded-full bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200 px-6 py-3 text-sm font-semibold text-black shadow-md transition-all duration-300 hover:scale-[1.04] hover:shadow-lg"
          >
            Commander
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm transition hover:bg-neutral-50 lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={clsx(
          "overflow-hidden border-t border-black/5 bg-white/95 backdrop-blur-xl transition-all duration-300 lg:hidden",
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="mx-auto flex w-full max-w-7xl flex-col px-5 py-5 sm:px-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-neutral-700 transition hover:bg-orange-50 hover:text-black"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200 px-6 py-3 text-base font-semibold text-black shadow-md"
          >
            Commander
          </Link>
        </nav>
      </div>
    </header>
  );
}