"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import clsx from "clsx";

import { usePathname, useRouter } from "@/i18n/navigation";

const locales = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
] as const;

type Locale = (typeof locales)[number]["code"];

type LocaleSwitcherProps = {
  mobile?: boolean;
  onChange?: () => void;
};

export default function LocaleSwitcher({
  mobile = false,
  onChange,
}: LocaleSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");
  const [isPending, startTransition] = useTransition();

  const activeIndex = locales.findIndex((l) => l.code === locale);

  const handleChangeLocale = (nextLocale: Locale) => {
    if (nextLocale === locale || isPending) return;

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
      onChange?.();
    });
  };

  return (
    <div
      className={clsx(
        "relative flex items-center rounded-full border border-black/10 bg-white/70 backdrop-blur-md",
        mobile ? "mt-4 w-fit p-[2px]" : "p-[1.5px]"
      )}
      role="group"
      aria-label={t("label")}
    >
      <div
        className="absolute top-[1.5px] bottom-[1.5px] rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-[#ff7a18] via-[#ff9a3c] to-[#ffd28a]"
        style={{
          width: "33.333%",
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {locales.map((item) => {
        const isActive = locale === item.code;

        return (
          <button
            key={item.code}
            type="button"
            onClick={() => handleChangeLocale(item.code)}
            disabled={isPending}
            className={clsx(
              "relative z-10 px-2 py-[5px] text-[10px] font-medium tracking-[0.12em] transition-colors duration-300",
              isActive
                ? "text-white"
                : "text-neutral-500 hover:text-neutral-900"
            )}
            aria-pressed={isActive}
            aria-label={t("switchTo", { locale: item.label })}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}