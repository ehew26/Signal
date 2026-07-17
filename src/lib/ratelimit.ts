import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting for the store's public API routes (checkout, products).
 *
 * Uses Upstash Redis (sliding window) when UPSTASH_REDIS_REST_URL /
 * UPSTASH_REDIS_REST_TOKEN are set. With no Redis configured, `limit()`
 * always allows the request — so routes keep working unprotected until
 * Upstash is connected, rather than breaking.
 */

export type RateLimitConfig = { requests: number; window: `${number} ${"s" | "m" | "h" | "d"}` };

const limiters = new Map<string, Ratelimit>();

function getLimiter(name: string, config: RateLimitConfig): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  const cached = limiters.get(name);
  if (cached) return cached;

  const limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    prefix: `lume/${name}`,
  });
  limiters.set(name, limiter);
  return limiter;
}

/** Extracts the client IP from standard proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export type RateLimitResult = { success: true } | { success: false; retryAfterSeconds: number };

/** Redis outages must fail open fast, not hang the request behind a slow/dead connection. */
const REDIS_CHECK_TIMEOUT_MS = 1500;

function timeout(ms: number): Promise<"timeout"> {
  return new Promise((resolve) => setTimeout(() => resolve("timeout"), ms));
}

/**
 * Checks the rate limit for a given route + client IP. Always succeeds when
 * Upstash isn't configured, or if the check errors or is slower than
 * REDIS_CHECK_TIMEOUT_MS (see module docs) — never blocks a legitimate route.
 */
export async function checkRateLimit(
  routeName: string,
  ip: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const limiter = getLimiter(routeName, config);
  if (!limiter) return { success: true };

  try {
    // Swallow a late rejection from the loser of the race so it doesn't
    // surface as an unhandled promise rejection after we've already
    // returned (the request itself is not held open — see the timeout()).
    const limitPromise = limiter.limit(ip).catch((err) => {
      console.error(`[ratelimit:${routeName}] deferred check failed:`, err);
      return "timeout" as const;
    });
    const result = await Promise.race([limitPromise, timeout(REDIS_CHECK_TIMEOUT_MS)]);
    if (result === "timeout") {
      console.error(`[ratelimit:${routeName}] check timed out, allowing request`);
      return { success: true };
    }
    if (result.success) return { success: true };
    return {
      success: false,
      retryAfterSeconds: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
    };
  } catch (err) {
    // Fail open — a Redis outage shouldn't take down lead capture or checkout.
    console.error(`[ratelimit:${routeName}] check failed, allowing request:`, err);
    return { success: true };
  }
}

/** Standard 429 response for a rate-limited request. */
export function tooManyRequests(retryAfterSeconds: number) {
  return new Response(
    JSON.stringify({ ok: false, error: "Too many requests. Please try again shortly." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}
