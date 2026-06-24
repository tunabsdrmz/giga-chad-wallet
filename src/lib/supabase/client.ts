import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

/**
 * `true` when both Supabase env vars are present. Components and hooks
 * MUST check this before calling `getSupabase()` so the app keeps working
 * in pure-localStorage demo mode when no project has been wired up.
 */
export const isSupabaseConfigured: boolean = URL.length > 0 && ANON_KEY.length > 0;

let cached: SupabaseClient<Database> | null = null;

/**
 * Returns the shared browser Supabase client. Throws if called when
 * `isSupabaseConfigured` is false — guard your call sites.
 */
export function getSupabase(): SupabaseClient<Database> {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    );
  }
  if (!cached) {
    cached = createClient<Database>(URL, ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return cached;
}
