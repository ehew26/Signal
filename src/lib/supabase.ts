import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase clients for Vertex AI.
 *
 * The project URL and the *publishable* (anon) key are public by design — they
 * are meant to ship in client code — so they are hardcoded here to keep the
 * deployment zero-config. Access is controlled by Row Level Security: anon can
 * INSERT validated leads (never SELECT them) and SELECT demo clients/projects.
 *
 * IMPORTANT: we intentionally do NOT read the generic NEXT_PUBLIC_SUPABASE_*
 * env vars, because this Vercel project still carries stale values from a
 * previous app that would point us at the wrong database. Overrides use the
 * VERTEX_-prefixed names so they can never collide.
 */

export const SUPABASE_URL =
  process.env.VERTEX_SUPABASE_URL ?? "https://neuaiogsdvhpwmnrtxgl.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.VERTEX_SUPABASE_ANON_KEY ??
  "sb_publishable_XZYBV7BaH8kJH1EfQ9kYnA_LTCZzfwE";

/** Public client (anon role). Safe everywhere. */
export function getSupabase(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

/**
 * Privileged client (service role). Returns null when the secret isn't
 * configured, so callers can gracefully fall back. Uses a VERTEX_-prefixed
 * name to avoid colliding with any stale service-role key on the project.
 */
export function getServiceSupabase(): SupabaseClient | null {
  const key = process.env.VERTEX_SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
}
