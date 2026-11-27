// src/components/analytics/AnalyticsTracker.tsx
// First-party, cookieless analytics for the public site (replaces Clarity).
//
// - one page view per route change (App Router client navigations included)
// - engaged time (visible tab only) and max scroll depth, sent on leave
// - automatic events: outbound links, mailto:, tel:, file downloads and any
//   element carrying data-analytics="label" (sent as cta_click)
//
// Nothing is written to cookies or storage. Admins can exclude their own
// browser from the dashboard (localStorage flag read in isTrackingIgnored).
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { newId, send, setCurrentPage, track } from "@/lib/analytics/track";

const DOWNLOAD_EXTENSIONS = /\.(pdf|zip|docx?|xlsx?|pptx?|csv|txt|rar|7z|mp4|mov|mp3|dmg|exe)$/i;

const AD_CLICK_IDS = [
  ["gclid", "google"],
  ["gbraid", "google"],
  ["wbraid", "google"],
  ["fbclid", "meta"],
  ["msclkid", "microsoft"],
  ["ttclid", "tiktok"],
  ["li_fat_id", "linkedin"],
] as const;

type Page = {
  pid: string;
  path: string;
  startedAt: number;
  engagedMs: number;
  visibleSince: number | null;
  maxScroll: number;
};

function scrollPercent() {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((window.scrollY / scrollable) * 100)));
}

function readUtm(search: URLSearchParams) {
  const utm = {
    source: search.get("utm_source") ?? search.get("ref") ?? undefined,
    medium: search.get("utm_medium") ?? undefined,
    campaign: search.get("utm_campaign") ?? undefined,
    term: search.get("utm_term") ?? undefined,
    content: search.get("utm_content") ?? undefined,
  };
  return Object.values(utm).some(Boolean) ? utm : undefined;
}

function readAdClick(search: URLSearchParams) {
  return AD_CLICK_IDS.find(([param]) => search.has(param))?.[1];
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const pageRef = useRef<Page | null>(null);
  const previousUrlRef = useRef<string | null>(null);

  // Page views + engagement
  useEffect(() => {
    if (!pathname) return;

    const now = performance.now();
    const previous = pageRef.current;

    // Same path re-run within a second (React StrictMode remount, fast
    // refresh): keep the page view that was just sent instead of a duplicate.
    const isRemount = previous !== null && previous.path === pathname && now - previous.startedAt < 1000;

    const page: Page = isRemount
      ? previous
      : {
          pid: newId(),
          path: pathname,
          startedAt: now,
          engagedMs: 0,
          visibleSince: document.visibilityState === "visible" ? now : null,
          maxScroll: scrollPercent(),
        };
    pageRef.current = page;
    setCurrentPage({ pid: page.pid, path: page.path });

    const search = new URLSearchParams(window.location.search);
    if (!isRemount) {
      send({
        t: "pageview",
        pid: page.pid,
        p: pathname,
        // First page: the real referrer. Client navigations: the previous page,
        // which the server recognizes as internal.
        r: (previousUrlRef.current ?? document.referrer) || undefined,
        w: window.screen?.width || undefined,
        l: navigator.language || undefined,
        utm: readUtm(search),
        ad: readAdClick(search),
      });
      previousUrlRef.current = window.location.href;
    }

    const flush = () => {
      if (page.visibleSince !== null) {
        page.engagedMs += performance.now() - page.visibleSince;
        page.visibleSince = document.visibilityState === "visible" ? performance.now() : null;
      }
      page.maxScroll = Math.max(page.maxScroll, scrollPercent());
      send({
        t: "leave",
        pid: page.pid,
        d: Math.round(page.engagedMs),
        s: page.maxScroll,
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        flush();
        page.visibleSince = null;
      } else if (page.visibleSince === null) {
        page.visibleSince = performance.now();
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        page.maxScroll = Math.max(page.maxScroll, scrollPercent());
        ticking = false;
      });
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("scroll", onScroll);
      // Route change inside the app: close the previous page view.
      flush();
    };
  }, [pathname]);

  // Automatic click tracking (delegated, capture phase so it runs before
  // client-side navigation)
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest) return;

      const tagged = target.closest<HTMLElement>("[data-analytics]");
      if (tagged?.dataset.analytics) {
        track("cta_click", { label: tagged.dataset.analytics.slice(0, 80) });
      }

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("mailto:")) {
        track("email_click");
        return;
      }
      if (href.startsWith("tel:")) {
        track("phone_click");
        return;
      }

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (DOWNLOAD_EXTENSIONS.test(url.pathname) || anchor.hasAttribute("download")) {
        track("file_download", { file: url.pathname.split("/").pop()?.slice(0, 120) ?? "" });
        return;
      }

      if ((url.protocol === "http:" || url.protocol === "https:") && url.host !== window.location.host) {
        track("outbound_click", {
          host: url.hostname.replace(/^www\./, ""),
          url: `${url.origin}${url.pathname}`.slice(0, 200),
        });
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
