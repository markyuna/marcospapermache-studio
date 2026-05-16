// src/components/layout/Footer.tsx
"use client";

import { motion } from "framer-motion";
import {
  Mail,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import { RiInstagramLine } from "react-icons/ri";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/sculptures", key: "sculptures" },
  { href: "/creations-sur-mesure", key: "custom" },
  { href: "/create", key: "ai" },
  { href: "/contact", key: "contact" },
] as const;

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="relative mt-28 overflow-hidden border-t border-[#eadfce]/70 bg-[#f8f3ea] text-neutral-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(181,134,80,0.18),transparent_34%),radial-gradient(circle_at_80%_90%,rgba(255,119,53,0.13),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#b89668]/70 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8"
      >
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr_0.85fr] lg:gap-16">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#d9c6aa]/80 bg-white/45 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-[#8b6a42] shadow-sm backdrop-blur"
            >
              <Sparkles size={14} />
              Handmade sculpture
            </motion.div>

            <h2 className="mt-6 max-w-lg text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl lg:text-5xl">
              Marcos{" "}
              <span className="bg-gradient-to-r from-[#9a6a34] via-[#d59b5b] to-[#7b4d25] bg-clip-text text-transparent">
                Papermache
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-neutral-600 sm:text-base">
              {t("description")}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              {t("navigation")}
            </h3>

            <ul className="mt-5 grid gap-3 text-sm text-neutral-700">
              {navLinks.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * index, duration: 0.45 }}
                >
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 transition hover:text-[#a56b32]"
                  >
                    <span className="h-px w-0 bg-[#a56b32] transition-all duration-300 group-hover:w-5" />
                    {t(`links.${item.key}`)}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              {t("contact")}
            </h3>

            <div className="mt-5 space-y-3">
              <a
                href="mailto:contact@marcospapermache.com"
                aria-label="Email Marcos Papermache"
                className="group flex items-center justify-between rounded-2xl border border-[#e3d5c1]/80 bg-white/45 px-4 py-4 text-sm text-neutral-700 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#c7a36f]/70 hover:bg-white/70 hover:text-neutral-950"
              >
                <span className="flex items-center gap-3">
                  <Mail size={17} className="text-[#a56b32]" />
                  contact@marcospapermache.com
                </span>
                <ArrowUpRight
                  size={16}
                  className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              <a
                href="https://www.instagram.com/marcospapermache"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Marcos Papermache"
                className="group flex items-center justify-between rounded-2xl border border-[#e3d5c1]/80 bg-white/45 px-4 py-4 text-sm text-neutral-700 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#c7a36f]/70 hover:bg-white/70 hover:text-neutral-950"
              >
                <span className="flex items-center gap-3">
                  <RiInstagramLine size={17} className="text-[#a56b32]" />
                  Instagram
                </span>
                <ArrowUpRight
                  size={16}
                  className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[#e1d3bf]/80 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Marcos Papermache — {t("rights")}
          </p>

          <p className="text-neutral-400">
            Papier-mâché sculptures · Paris
          </p>
        </div>
      </motion.div>
    </footer>
  );
}