// src/components/layout/LocaleSwitcher.tsx
"use client";

import { useLocale } from "next-intl";
import clsx from "clsx";

import { usePathname, useRouter } from "@/i18n/navigation";

const locales = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
] as const;

type Locale = (typeof locales)[number]["code"];

export default function LocaleSwitcher({
  mobile = false,
  onChange,
}: {
  mobile?: boolean;
  onChange?: () => void;
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChangeLocale = (nextLocale: Locale) => {
    router.replace(pathname, { locale: nextLocale });
    onChange?.();
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-1 rounded-full border border-black/10 bg-white/80 backdrop-blur-xl",
        mobile ? "mt-4 w-fit px-2 py-2" : "px-2 py-1.5"
      )}
    >
      {locales.map((item) => {
        const isActive = locale === item.code;

        return (
          <button
            key={item.code}
            type="button"
            onClick={() => handleChangeLocale(item.code)}
            className={clsx(
              "rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.08em] transition-all duration-300",
              isActive
                ? "bg-neutral-950 text-white shadow-sm"
                : "text-neutral-600 hover:bg-orange-50 hover:text-neutral-950"
            )}
            aria-pressed={isActive}
            aria-label={`Changer la langue vers ${item.label}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}