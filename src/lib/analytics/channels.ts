// src/lib/analytics/channels.ts
// Turns (referrer, UTM tags, ad click id) into an acquisition channel. Pure
// functions: no I/O, safe to unit-test.
import type { Channel } from "@/lib/analytics/shared";

// Checked before search engines: gemini.google.com would otherwise be Google.
const AI_HOSTS = [
  "chatgpt.com",
  "chat.openai.com",
  "openai.com",
  "perplexity.ai",
  "claude.ai",
  "gemini.google.com",
  "bard.google.com",
  "copilot.microsoft.com",
  "you.com",
  "phind.com",
  "chat.mistral.ai",
  "deepseek.com",
  "chat.deepseek.com",
  "meta.ai",
  "grok.com",
];

const SEARCH_PATTERNS = [
  /(^|\.)google\.[a-z.]+$/,
  /(^|\.)bing\.com$/,
  /(^|\.)duckduckgo\.com$/,
  /(^|\.)search\.yahoo\.[a-z.]+$/,
  /(^|\.)yahoo\.[a-z.]+$/,
  /(^|\.)ecosia\.org$/,
  /(^|\.)qwant\.com$/,
  /(^|\.)yandex\.[a-z.]+$/,
  /(^|\.)baidu\.com$/,
  /(^|\.)search\.brave\.com$/,
  /(^|\.)startpage\.com$/,
  /(^|\.)lilo\.org$/,
  /(^|\.)naver\.com$/,
];

const SOCIAL_PATTERNS = [
  /(^|\.)facebook\.com$/,
  /(^|\.)fb\.me$/,
  /(^|\.)instagram\.com$/,
  /(^|\.)threads\.net$/,
  /(^|\.)t\.co$/,
  /(^|\.)twitter\.com$/,
  /(^|\.)x\.com$/,
  /(^|\.)linkedin\.com$/,
  /(^|\.)lnkd\.in$/,
  /(^|\.)pinterest\.[a-z.]+$/,
  /(^|\.)pin\.it$/,
  /(^|\.)tiktok\.com$/,
  /(^|\.)youtube\.com$/,
  /(^|\.)youtu\.be$/,
  /(^|\.)reddit\.com$/,
  /(^|\.)whatsapp\.com$/,
  /(^|\.)wa\.me$/,
  /(^|\.)snapchat\.com$/,
  /(^|\.)telegram\.org$/,
  /(^|\.)t\.me$/,
  /(^|\.)bsky\.app$/,
  /(^|\.)behance\.net$/,
  /(^|\.)etsy\.com$/,
];

const EMAIL_PATTERNS = [
  /(^|\.)mail\.google\.com$/,
  /(^|\.)outlook\.(live|office)\.com$/,
  /(^|\.)mail\.yahoo\.[a-z.]+$/,
  /(^|\.)webmail\./,
  /(^|\.)mail\.orange\.fr$/,
  /(^|\.)mail\.free\.fr$/,
  /(^|\.)laposte\.net$/,
  /(^|\.)mail\.proton\.me$/,
];

const SOURCE_ALIASES: Record<string, string> = {
  ig: "instagram.com",
  instagram: "instagram.com",
  fb: "facebook.com",
  facebook: "facebook.com",
  google: "google.com",
  bing: "bing.com",
  pinterest: "pinterest.com",
  tiktok: "tiktok.com",
  linkedin: "linkedin.com",
  youtube: "youtube.com",
  chatgpt: "chatgpt.com",
  "chatgpt.com": "chatgpt.com",
  perplexity: "perplexity.ai",
  newsletter: "newsletter",
};

/**
 * Normalizes a hostname for grouping: lowercase, without "www.", "m.",
 * "l." / "lm." (Facebook/Instagram link shims) or "out." prefixes.
 */
export function normalizeHost(host: string) {
  return host
    .toLowerCase()
    .replace(/\.$/, "")
    .replace(/^(www\d*|m|mobile|l|lm|out|amp)\./, "");
}

/**
 * Extracts the referring host, or null for no / internal / unreadable referrers.
 * Android apps send "android-app://com.google.android.gm/" — mapped to a
 * readable name.
 */
export function referrerHost(referrer: string | undefined, siteHost: string | null) {
  if (!referrer) return null;

  if (referrer.startsWith("android-app://")) {
    const app = referrer.slice("android-app://".length).split("/")[0] ?? "";
    if (app.includes("google.android.gm")) return "mail.google.com";
    if (app.includes("googlequicksearchbox")) return "google.com";
    if (app.includes("instagram")) return "instagram.com";
    if (app.includes("facebook")) return "facebook.com";
    if (app.includes("linkedin")) return "linkedin.com";
    if (app.includes("pinterest")) return "pinterest.com";
    return app || null;
  }

  let url: URL;
  try {
    url = new URL(referrer);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  const host = normalizeHost(url.hostname);
  if (!host) return null;
  if (siteHost && host === normalizeHost(siteHost)) return null;

  return host;
}

function matches(host: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(host));
}

function isAiHost(host: string) {
  return AI_HOSTS.some((ai) => host === ai || host.endsWith(`.${ai}`));
}

export function classifyChannel(input: {
  host: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  adClick?: string | null;
}): Channel {
  const medium = (input.utmMedium ?? "").toLowerCase();
  const rawSource = (input.utmSource ?? "").toLowerCase().trim();
  const source = SOURCE_ALIASES[rawSource] ?? rawSource;
  const host = input.host;

  if (input.adClick || /^(cpc|ppc|paid|paidsocial|paid_social|cpm|display|ads?|retargeting)$/.test(medium)) {
    return "paid";
  }

  if (/^(e-?mail|newsletter|mailing)$/.test(medium) || source === "newsletter") {
    return "email";
  }

  for (const candidate of [host, source || null]) {
    if (!candidate) continue;
    if (isAiHost(candidate)) return "ai";
    if (matches(candidate, EMAIL_PATTERNS)) return "email";
    if (matches(candidate, SEARCH_PATTERNS)) return medium === "organic" || !medium ? "organic_search" : "campaign";
    if (matches(candidate, SOCIAL_PATTERNS)) return "social";
  }

  if (/^(social|social-network|social_network|sm)$/.test(medium)) return "social";
  if (medium === "organic") return "organic_search";
  if (medium === "referral") return "referral";

  if (rawSource || medium) return "campaign";
  if (host) return "referral";

  return "direct";
}
