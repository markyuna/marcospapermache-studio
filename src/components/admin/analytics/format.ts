// src/components/admin/analytics/format.ts
// Display helpers shared by the analytics dashboard (server and client).
import { channelLabel } from "@/lib/analytics/shared";

export const NONE = "__none";

const numberFormat = new Intl.NumberFormat("fr-FR");
const compactFormat = new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 });

export function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "—";
  return Math.abs(value) >= 10000 ? compactFormat.format(value) : numberFormat.format(Math.round(value));
}

export function formatDecimal(value: number, digits = 1) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

export function formatPercent(ratio: number, digits = 0) {
  if (!Number.isFinite(ratio)) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(ratio);
}

export function formatDuration(ms: number | null | undefined) {
  if (ms === null || ms === undefined || !Number.isFinite(ms) || ms <= 0) return "0 s";
  const total = Math.round(ms / 1000);
  if (total < 60) return `${total} s`;
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  if (minutes < 60) return seconds ? `${minutes} min ${seconds} s` : `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours} h ${minutes % 60} min`;
}

/** Signed relative change, or null when there is no base to compare to. */
export function relativeChange(current: number, previous: number) {
  if (!Number.isFinite(previous) || previous === 0) return current === 0 ? 0 : null;
  return (current - previous) / previous;
}

let regionNames: Intl.DisplayNames | null = null;
let languageNames: Intl.DisplayNames | null = null;

export function countryName(code: string) {
  if (code === NONE) return "Inconnu";
  try {
    regionNames ??= new Intl.DisplayNames(["fr"], { type: "region" });
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

export function countryFlag(code: string) {
  if (!/^[A-Z]{2}$/.test(code)) return "🌐";
  return String.fromCodePoint(...[...code].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65));
}

export function languageName(code: string) {
  if (code === NONE) return "Inconnue";
  try {
    languageNames ??= new Intl.DisplayNames(["fr"], { type: "language" });
    const name = languageNames.of(code) ?? code;
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return code;
  }
}

const DEVICE_LABELS: Record<string, string> = {
  desktop: "Ordinateur",
  mobile: "Mobile",
  tablet: "Tablette",
  other: "Autre (TV, console…)",
};

const LOCALE_LABELS: Record<string, string> = {
  fr: "Français (/fr)",
  en: "Anglais (/en)",
  es: "Espagnol (/es)",
};

export type DimensionKey =
  | "page"
  | "entry"
  | "exit"
  | "channel"
  | "referrer"
  | "source"
  | "medium"
  | "campaign"
  | "country"
  | "region"
  | "city"
  | "device"
  | "browser"
  | "os"
  | "locale"
  | "language"
  | "event";

/** Human label for a dimension value. */
export function dimensionLabel(key: DimensionKey | string, value: string) {
  switch (key) {
    case "channel":
      return channelLabel(value);
    case "country":
      return `${countryFlag(value)}  ${countryName(value)}`;
    case "device":
      return DEVICE_LABELS[value] ?? value;
    case "locale":
      return value === NONE ? "Hors pages localisées" : (LOCALE_LABELS[value] ?? value);
    case "language":
      return languageName(value);
    case "referrer":
      return value === NONE ? "Aucun (accès direct)" : value;
    case "source":
    case "medium":
    case "campaign":
      return value === NONE ? "(non renseigné)" : value;
    default:
      return value === NONE ? "Inconnu" : value;
  }
}

/** URL of the dashboard with one more filter applied. */
export const DASHBOARD_PATH = "/admin/analytics";

export function withParam(query: string, key: string, value: string | null) {
  const params = new URLSearchParams(query);
  if (value === null) params.delete(key);
  else params.set(key, value);
  const text = params.toString();
  return text ? `${DASHBOARD_PATH}?${text}` : DASHBOARD_PATH;
}
