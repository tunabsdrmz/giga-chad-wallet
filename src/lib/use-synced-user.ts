"use client";

import { useEffect, useMemo, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useWallets as useSolanaWallets } from "@privy-io/react-auth/solana";
import { isPrivyConfigured } from "@/lib/privy-config";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

export interface SyncedUser {
  did: string | null;
  address: string | null;
  displayName: string | null;
  ready: boolean;
  authenticated: boolean;
}

const EMPTY: SyncedUser = {
  did: null,
  address: null,
  displayName: null,
  ready: true,
  authenticated: false,
};

/**
 * Single source of truth for "who is signed in" across the app.
 *
 * - If Privy isn't configured, returns an empty/anonymous state.
 * - If Privy is configured but Supabase isn't, returns the live Privy
 *   user info but doesn't write anywhere.
 * - If both are configured, also upserts a profile row in
 *   `public.users` whenever the DID or wallet address changes.
 *
 * Bound at module load so React always sees the same hook function and
 * the rules of hooks are honored. Calling `usePrivy()` outside a
 * `<PrivyProvider>` would throw, so we swap the implementation entirely
 * when Privy is unconfigured.
 */
function useStubSyncedUser(): SyncedUser {
  return EMPTY;
}

export const useSyncedUser: () => SyncedUser = isPrivyConfigured
  ? useActiveSyncedUser
  : useStubSyncedUser;

function useActiveSyncedUser(): SyncedUser {
  const { user, ready, authenticated } = usePrivy();
  const { wallets } = useSolanaWallets();

  const info = useMemo<SyncedUser>(() => {
    const did = user?.id ?? null;
    const address = wallets[0]?.address ?? null;
    const displayName =
      user?.email?.address ??
      user?.google?.email ??
      user?.apple?.email ??
      null;
    return { did, address, displayName, ready, authenticated };
  }, [user, wallets, ready, authenticated]);

  useUpsertUser(info);
  return info;
}

function useUpsertUser({ did, address, displayName, authenticated }: SyncedUser) {
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  useEffect(() => {
    if (!authenticated || !did) return;
    if (!isSupabaseConfigured) return;
    const fingerprint = `${did}|${address ?? ""}|${displayName ?? ""}`;
    if (fingerprint === lastSynced) return;

    const supabase = getSupabase();
    supabase
      .from("users")
      .upsert(
        {
          did,
          solana_address: address,
          display_name: displayName,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "did" },
      )
      .then(({ error }) => {
        if (error) {
          console.warn("[supabase] users upsert failed", error);
          return;
        }
        setLastSynced(fingerprint);
      });
  }, [did, address, displayName, authenticated, lastSynced]);
}
