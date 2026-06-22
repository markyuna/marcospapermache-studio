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
    <div className="sticky top-0 z-40 border-b border-neutral-200 bg-[#f8f5ef]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">

        {/* Brand */}
        <Link
          href="/admin/artworks"
          className="text-sm font-semibold text-neutral-900 transition hover:text-neutral-600"
        >
          Marcos Papermache
        </Link>

        {/* Nav links */}
        <nav aria-label="Navigation administration" className="flex items-center gap-1">
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
                  "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition",
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
