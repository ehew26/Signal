import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase clients for the Lumé store — entirely optional.
 *
 * The storefront runs fully from the seed catalog (src/lib/products.ts) with no
 * database. Set these envs to enable the live catalog + order persistence:
 *
 *   NEXT_PUBLIC_SUPABASE_URL          project URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY     publishable anon key (safe in the client)
 *   SUPABASE_SERVICE_ROLE_KEY         secret — server-only, for writes
 *
 * When unset, getSupabase() returns null and every caller falls back to the
 * seed data, so the site always works.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Public client (anon role), or null when Supabase isn't configured. */
export function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

/**
 * Privileged client (service role). Returns null when the secret isn't set, so
 * callers can gracefully fall back. Server-only — never import into client code.
 */
export function getServiceSupabase(): SupabaseClient | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key || !SUPABASE_URL) return null;
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
}
