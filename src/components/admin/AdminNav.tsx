"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import clsx from "clsx";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const links = [
  { href: "/admin/artworks", label: "Œuvres" },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    for (const link of links) {
      router.prefetch(link.href);
    }
  }, [router]);

  return (
    <div className="sticky top-0 z-40 border-b border-neutral-200 bg-paper-base/95 backdrop-blur">
      {/* Phones: brand + logout on the first row, links on a full-width second row. */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 md:px-8">

        {/* Brand */}
        <Link
          href="/admin/artworks"
          className="shrink-0 text-sm font-semibold text-neutral-900 transition hover:text-neutral-600"
        >
          Marcos Papermache
        </Link>

        {/* Nav links */}
        <nav
          aria-label="Navigation administration"
          className="order-last flex w-full items-center gap-1 sm:order-none sm:w-auto"
        >
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "inline-flex flex-1 items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition sm:flex-none",
                  isActive
                    ? "bg-neutral-200 text-neutral-900"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <AdminLogoutButton />
      </div>
    </div>
  );
}
