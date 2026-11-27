// src/lib/analytics/shared.ts
// Shared between the browser tracker, the collect endpoint and the dashboard.
// No server-only imports here.
import { z } from "zod";

export const COLLECT_ENDPOINT = "/api/analytics/collect";

// localStorage flag set from the admin so the owner's own visits are not
// counted. "1" = ignore this browser, "0" = explicitly count it.
export const IGNORE_STORAGE_KEY = "mp_analytics_ignore";

// A visit ends after 30 minutes without any hit (same rule as GA / Plausible).
export const SESSION_TIMEOUT_MINUTES = 30;

// Longest engaged time accepted for a single page view (30 min).
export const MAX_PAGE_DURATION_MS = 30 * 60 * 1000;

/**
 * Catalog of the custom events the site sends. The dashboard shows them with
 * these labels; any other snake_case name is still accepted and shown raw.
 */
export const EVENT_CATALOG = {
  commande_submitted: { label: "Commande envoyée", conversion: true },
  image_generated: { label: "Image IA générée", conversion: true },
  generation_blocked: { label: "Génération bloquée (compte / crédits)", conversion: false },
  checkout_started: { label: "Paiement Stripe lancé", conversion: true },
  quiz_started: { label: "Quiz commencé", conversion: false },
  quiz_completed: { label: "Quiz terminé", conversion: false },
  quiz_saved: { label: "Résultat du quiz enregistré", conversion: false },
  quiz_image_generated: { label: "Image du quiz générée", conversion: true },
  signup: { label: "Création de compte", conversion: true },
  login: { label: "Connexion", conversion: false },
  cta_click: { label: "Clic sur un bouton (CTA)", conversion: false },
  outbound_click: { label: "Clic vers un site externe", conversion: false },
  email_click: { label: "Clic sur l’adresse e-mail", conversion: true },
  phone_click: { label: "Clic sur le téléphone", conversion: false },
  file_download: { label: "Téléchargement de fichier", conversion: false },
} as const satisfies Record<string, { label: string; conversion: boolean }>;

export type KnownEventName = keyof typeof EVENT_CATALOG;

export function eventLabel(name: string) {
  return (EVENT_CATALOG as Record<string, { label: string }>)[name]?.label ?? name;
}

export type EventProps = Record<string, string | number | boolean>;

// ---------------------------------------------------------------------------
// Wire format (kept short: it is sent on every page view)
// ---------------------------------------------------------------------------

const pathSchema = z
  .string()
  .max(512)
  .regex(/^\/[^\s]*$/, "path must start with /");

const shortText = (max: number) => z.string().trim().max(max).optional();

const propsSchema = z
  .record(
    z.string().regex(/^[a-z][a-z0-9_]{0,31}$/),
    z.union([z.string().max(200), z.number().finite(), z.boolean()])
  )
  .refine((value) => Object.keys(value).length <= 10, "too many props")
  .optional();

export const collectPayloadSchema = z.discriminatedUnion("t", [
  // Page view
  z.object({
    t: z.literal("pageview"),
    pid: z.uuid(),
    p: pathSchema,
    r: z.string().max(1024).optional(), // document.referrer
    w: z.number().int().min(0).max(20000).optional(), // screen width
    l: shortText(16), // navigator.language
    utm: z
      .object({
        source: shortText(120),
        medium: shortText(120),
        campaign: shortText(120),
        term: shortText(120),
        content: shortText(120),
      })
      .optional(),
    // Ad click id present in the URL (gclid, fbclid, …) → paid traffic
    ad: z.enum(["google", "meta", "microsoft", "tiktok", "linkedin"]).optional(),
  }),
  // Custom event
  z.object({
    t: z.literal("event"),
    n: z.string().regex(/^[a-z][a-z0-9_]{0,63}$/),
    p: pathSchema,
    pid: z.uuid().optional(),
    props: propsSchema,
  }),
  // Leaving a page: engaged time and how far down it was read
  z.object({
    t: z.literal("leave"),
    pid: z.uuid(),
    d: z.number().int().min(0).max(MAX_PAGE_DURATION_MS * 4),
    s: z.number().int().min(0).max(100),
  }),
]);

export type CollectPayload = z.infer<typeof collectPayloadSchema>;

// ---------------------------------------------------------------------------
// Acquisition channels
// ---------------------------------------------------------------------------

export const CHANNELS = {
  direct: "Accès direct",
  organic_search: "Recherche naturelle",
  ai: "Assistants IA",
  social: "Réseaux sociaux",
  paid: "Publicité payante",
  email: "E-mail / newsletter",
  referral: "Sites référents",
  campaign: "Autres campagnes",
} as const;

export type Channel = keyof typeof CHANNELS;

export function channelLabel(channel: string) {
  return (CHANNELS as Record<string, string>)[channel] ?? channel;
}

// Locale prefix used by every public page ("/fr/…", "/en", …).
export const SITE_LOCALES = ["fr", "en", "es"] as const;
