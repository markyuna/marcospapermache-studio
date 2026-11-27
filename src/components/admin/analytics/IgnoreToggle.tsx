// src/components/admin/analytics/IgnoreToggle.tsx
// Lets the admin exclude (or re-include) their own browser from the stats.
"use client";

import { useSyncExternalStore } from "react";
import clsx from "clsx";
import { EyeOff, Eye } from "lucide-react";
import { IGNORE_STORAGE_KEY } from "@/lib/analytics/shared";

const listeners = new Set<() => void>();

function read() {
  try {
    return window.localStorage.getItem(IGNORE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export default function IgnoreToggle() {
  const ignored = useSyncExternalStore(subscribe, read, () => true);

  function toggle() {
    try {
      window.localStorage.setItem(IGNORE_STORAGE_KEY, ignored ? "0" : "1");
    } catch {
      // storage blocked: nothing to persist
    }
    listeners.forEach((listener) => listener());
  }

  const Icon = ignored ? EyeOff : Eye;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={ignored}
      title="Vos propres visites du site public faussent les statistiques : excluez ce navigateur."
      className={clsx(
        "inline-flex items-center gap-2 self-start rounded-xl border px-3 py-2 text-xs font-medium transition",
        ignored
          ? "border-[#0aac23]/30 bg-[#0aac23]/10 text-[#006c10]"
          : "border-[#b42318]/30 bg-[#b42318]/5 text-[#b42318]"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {ignored ? "Ce navigateur est exclu des stats" : "Ce navigateur est compté — l’exclure"}
    </button>
  );
}
