"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useSyncedUser } from "@/lib/use-synced-user";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

const STORAGE_KEY = "chadwallet:watchlist";
const EMPTY: readonly string[] = Object.freeze([]);

/* ---------- Module-level external store backed by localStorage ----------- */

let cachedRaw: string | null = "__init__";
let cachedList: readonly string[] = EMPTY;

function readSnapshot(): readonly string[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedList;
  cachedRaw = raw;
  if (!raw) {
    cachedList = EMPTY;
    return cachedList;
  }
  try {
    const parsed = JSON.parse(raw);
    cachedList = Array.isArray(parsed)
      ? Object.freeze(parsed.filter((x): x is string => typeof x === "string"))
      : EMPTY;
  } catch {
    cachedList = EMPTY;
  }
  return cachedList;
}

function writeSnapshot(list: readonly string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore quota / private-mode errors
  }
  cachedRaw = null; // force readSnapshot to re-parse on next read
  notify();
}

const subscribers = new Set<() => void>();
function notify() {
  for (const fn of subscribers) fn();
}

function subscribe(callback: () => void) {
  subscribers.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    subscribers.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function getServerSnapshot(): readonly string[] {
  return EMPTY;
}

/* ---------- Hook ---------- */

const watchlistFetchedDids = new Set<string>();

/**
 * Watchlist persisted to localStorage. When the user is signed in and
 * Supabase is configured, the local list is unioned with their server
 * list on mount and every toggle is mirrored to `public.watchlist_items`.
 */
export function useWatchlist() {
  const list = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);
  const { did, authenticated } = useSyncedUser();

  // On sign-in, union the remote list into the local one (once per DID).
  useEffect(() => {
    if (!authenticated || !did || !isSupabaseConfigured) return;
    if (watchlistFetchedDids.has(did)) return;
    watchlistFetchedDids.add(did);

    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await getSupabase()
          .from("watchlist_items")
          .select("mint")
          .eq("user_did", did);
        if (cancelled) return;
        if (error) {
          console.warn("[supabase] watchlist fetch failed", error);
          watchlistFetchedDids.delete(did);
          return;
        }
        const remote = (data ?? []).map((row) => row.mint);
        if (remote.length === 0) return;
        const current = readSnapshot();
        const merged = Array.from(new Set([...current, ...remote]));
        if (merged.length !== current.length) writeSnapshot(merged);
      } catch (err) {
        watchlistFetchedDids.delete(did);
        if (!cancelled) console.warn("[supabase] watchlist fetch threw", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [did, authenticated]);

  const has = useCallback((mint: string) => list.includes(mint), [list]);

  const toggle = useCallback(
    (mint: string) => {
      const current = readSnapshot();
      const adding = !current.includes(mint);
      const next = adding ? [...current, mint] : current.filter((m) => m !== mint);
      writeSnapshot(next);
      void syncToSupabase({ did, authenticated, mint, adding });
    },
    [did, authenticated],
  );

  return { list: list as string[], has, toggle, mounted: true };
}

async function syncToSupabase({
  did,
  authenticated,
  mint,
  adding,
}: {
  did: string | null;
  authenticated: boolean;
  mint: string;
  adding: boolean;
}) {
  if (!authenticated || !did || !isSupabaseConfigured) return;
  try {
    const supabase = getSupabase();
    if (adding) {
      const { error } = await supabase
        .from("watchlist_items")
        .upsert({ user_did: did, mint }, { onConflict: "user_did,mint" });
      if (error) console.warn("[supabase] watchlist add failed", error);
    } else {
      const { error } = await supabase
        .from("watchlist_items")
        .delete()
        .eq("user_did", did)
        .eq("mint", mint);
      if (error) console.warn("[supabase] watchlist remove failed", error);
    }
  } catch (err) {
    console.warn("[supabase] watchlist sync threw", err);
  }
}
