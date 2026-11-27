// src/lib/analytics/track.ts
// Browser-side API of the first-party analytics. `track()` can be called from
// any client component; the AnalyticsTracker (mounted in the locale layout)
// handles page views, engagement and automatic click tracking.
import {
  COLLECT_ENDPOINT,
  IGNORE_STORAGE_KEY,
  type CollectPayload,
  type EventProps,
  type KnownEventName,
} from "@/lib/analytics/shared";

type PageState = { pid: string; path: string } | null;

let currentPage: PageState = null;

export function setCurrentPage(page: PageState) {
  currentPage = page;
}

export function getCurrentPage() {
  return currentPage;
}

export function isTrackingIgnored() {
  try {
    return window.localStorage.getItem(IGNORE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // RFC 4122 v4 fallback for non-secure contexts
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function send(payload: CollectPayload) {
  if (typeof window === "undefined" || isTrackingIgnored()) return;

  const body = JSON.stringify(payload);

  try {
    if (navigator.sendBeacon?.(COLLECT_ENDPOINT, new Blob([body], { type: "application/json" }))) {
      return;
    }
  } catch {
    // fall through to fetch
  }

  void fetch(COLLECT_ENDPOINT, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    credentials: "omit",
  }).catch(() => {});
}

/**
 * Sends a custom event attached to the current page view.
 *   track("commande_submitted", { with_image: true })
 */
export function track(name: KnownEventName | (string & {}), props?: EventProps) {
  if (typeof window === "undefined") return;

  const path = currentPage?.path ?? window.location.pathname;

  send({
    t: "event",
    n: name,
    p: path,
    pid: currentPage?.pid,
    props,
  });
}
