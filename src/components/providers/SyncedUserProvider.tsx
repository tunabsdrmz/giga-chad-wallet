"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
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

const SyncedUserContext = createContext<SyncedUser>(EMPTY);

/** Process-wide dedupe so N hook instances → one Supabase upsert. */
let syncedFingerprint: string | null = null;
let upsertInFlight: string | null = null;

function upsertUserProfile(
  fingerprint: string,
  row: {
    did: string;
    solana_address: string | null;
    display_name: string | null;
  },
) {
  if (fingerprint === syncedFingerprint || fingerprint === upsertInFlight) return;
  upsertInFlight = fingerprint;
  void getSupabase()
    .from("users")
    .upsert(
      { ...row, updated_at: new Date().toISOString() },
      { onConflict: "did" },
    )
    .then(({ error }) => {
      upsertInFlight = null;
      if (error) {
        console.warn("[supabase] users upsert failed", error);
        return;
      }
      syncedFingerprint = fingerprint;
    });
}

function SyncedUserProviderActive({ children }: { children: ReactNode }) {
  const { user, ready, authenticated } = usePrivy();
  const { wallets } = useSolanaWallets();

  const value = useMemo<SyncedUser>(() => {
    const did = user?.id ?? null;
    const address = wallets[0]?.address ?? null;
    const displayName =
      user?.email?.address ??
      user?.google?.email ??
      user?.apple?.email ??
      null;
    return { did, address, displayName, ready, authenticated };
  }, [user, wallets, ready, authenticated]);

  useEffect(() => {
    if (!value.authenticated || !value.did || !isSupabaseConfigured) return;
    const fingerprint = `${value.did}|${value.address ?? ""}|${value.displayName ?? ""}`;
    upsertUserProfile(fingerprint, {
      did: value.did,
      solana_address: value.address,
      display_name: value.displayName,
    });
  }, [value.authenticated, value.did, value.address, value.displayName]);

  return (
    <SyncedUserContext.Provider value={value}>{children}</SyncedUserContext.Provider>
  );
}

export function SyncedUserProvider({ children }: { children: ReactNode }) {
  if (!isPrivyConfigured) {
    return (
      <SyncedUserContext.Provider value={EMPTY}>{children}</SyncedUserContext.Provider>
    );
  }
  return <SyncedUserProviderActive>{children}</SyncedUserProviderActive>;
}

export function useSyncedUser(): SyncedUser {
  return useContext(SyncedUserContext);
}
