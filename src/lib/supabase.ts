import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase clients for Vertex AI.
 *
 * The project URL and the *publishable* (anon) key are public by design — they
 * are meant to ship in client code — so we provide them as hardcoded fallbacks
 * to keep the deployment zero-config. Real access is controlled by Row Level
 * Security: anon can INSERT leads (never SELECT them) and SELECT demo
 * clients/projects.
 *
 * The service-role key is a SECRET and is never hardcoded. When present (via
 * env), it unlocks privileged server reads (e.g. listing leads); when absent,
 * callers fall back to mock data.
 */

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://neuaiogsdvhpwmnrtxgl.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_XZYBV7BaH8kJH1EfQ9kYnA_LTCZzfwE";

/** Public client (anon role). Safe everywhere. */
export function getSupabase(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

/**
 * Privileged client (service role). Returns null when the secret isn't
 * configured, so callers can gracefully fall back.
 */
export function getServiceSupabase(): SupabaseClient | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
}
