type RateLimitEntry = {
  count: number;
  windowStart: number;
};

const attempts = new Map<string, RateLimitEntry>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * Fixed-window in-memory rate limiter. Keyed by an arbitrary identifier
 * (e.g. client IP). State lives in process memory, so it resets on
 * restart and isn't shared across multiple server instances — acceptable
 * for a single-instance deployment (`next start`), not for horizontally
 * scaled/serverless hosting.
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const entry = attempts.get(identifier);

  if (!entry || now - entry.windowStart >= windowMs) {
    attempts.set(identifier, { count: 1, windowStart: now });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  const resetAt = entry.windowStart + windowMs;

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt };
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}
