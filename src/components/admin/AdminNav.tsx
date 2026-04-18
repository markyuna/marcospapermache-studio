// src/components/admin/AdminNav.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import clsx from "clsx";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const links = [
  {
    href: "/admin/artworks",
    label: "Œuvres",
  },
  {
    href: "/admin/commandes",
    label: "Commandes",
  },
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
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">
              Admin
            </p>
            <h1 className="mt-1 text-xl font-semibold text-neutral-900">
              Marcos Papermache
            </h1>
          </div>

          <nav
            aria-label="Navigation administration"
            className="flex flex-wrap gap-2 sm:ml-6"
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
                    "inline-flex min-h-[40px] items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "border border-black bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                      : "border border-neutral-300 bg-white text-neutral-800 hover:border-neutral-900 hover:bg-neutral-50 hover:text-neutral-900"
                  )}
                >
                  <span className={clsx(isActive ? "text-white" : "text-inherit")}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <AdminLogoutButton />
      </div>
    </div>
  );
}