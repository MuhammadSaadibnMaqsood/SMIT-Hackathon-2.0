/**
 * Supabase Client
 * ===============
 * Used exclusively for Realtime Broadcast channels.
 * MongoDB remains the source of truth for all message data.
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client for use on the client side.
 * Uses NEXT_PUBLIC_ env vars so it works in browser code.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("⚠️  Supabase env vars missing — realtime disabled");
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(url, key, {
      realtime: {
        params: { eventsPerSecond: 10 },
      },
    });
  }

  return supabaseClient;
}

/**
 * Creates a fresh server-side Supabase client (no singleton caching).
 * Used in API routes for broadcasting events.
 */
export function createServerSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key);
}
