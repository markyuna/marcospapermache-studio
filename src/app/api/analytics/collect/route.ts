// src/app/api/analytics/collect/route.ts
// Public beacon endpoint for the first-party analytics (see
// src/components/analytics/AnalyticsTracker.tsx). Always answers 204 quickly;
// the database write happens after the response is sent.
import { after, type NextRequest } from "next/server";
import { collect, isCollectionEnabled, readRequestContext } from "@/lib/analytics/collect";
import { collectPayloadSchema } from "@/lib/analytics/shared";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4096;

function noContent() {
  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}

function isSameSite(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // sendBeacon from older browsers may omit it

  try {
    const originHost = new URL(origin).host;
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return originHost === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isCollectionEnabled() || !isSameSite(request)) return noContent();

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return noContent();

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return noContent();
  }
  if (!raw || raw.length > MAX_BODY_BYTES) return noContent();

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return noContent();
  }

  const parsed = collectPayloadSchema.safeParse(json);
  if (!parsed.success) return noContent();

  const ctx = readRequestContext(request.headers);
  if (ctx.isBot) return noContent();

  after(async () => {
    try {
      await collect(parsed.data, ctx);
    } catch (error) {
      console.error("[ANALYTICS] collect failed", error);
    }
  });

  return noContent();
}
