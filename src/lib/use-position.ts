"use client";

import { useCallback, useEffect, useState } from "react";
import { useSyncedUser } from "@/lib/use-synced-user";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { type Position } from "@/lib/mock/market";
import type { Token } from "@/types/token";

export interface PositionState {
  position: Position | null;
  loading: boolean;
  submitting: boolean;
  remote: boolean;
  closePosition: () => Promise<boolean>;
  openPosition: (amount: number, avgPriceUsd: number) => Promise<boolean>;
}

interface RemoteFetch {
  key: string | null;
  position: Position | null;
}

const inflightFetches = new Map<string, Promise<Position | null>>();

/**
 * Position for `token` belonging to the current Privy user.
 *
 * Signed in + Supabase → reads/writes `public.positions`.
 * Otherwise → in-memory demo state (still persisted via openPosition
 * when Supabase is configured on a later sign-in).
 */
export function usePosition(token: Token): PositionState {
  const { did, authenticated } = useSyncedUser();
  const useRemote = authenticated && !!did && isSupabaseConfigured;
  const remoteKey = useRemote && did ? `${did}|${token.mint}` : `local|${token.mint}`;

  const [fetched, setFetched] = useState<RemoteFetch>({ key: null, position: null });
  const [submitting, setSubmitting] = useState(false);
  const [trackedKey, setTrackedKey] = useState(remoteKey);

  if (remoteKey !== trackedKey) {
    setTrackedKey(remoteKey);
    if (!useRemote) {
      setFetched({ key: remoteKey, position: null });
    }
  }

  useEffect(() => {
    if (!useRemote || !did) return;
    let cancelled = false;

    const load = async () => {
      let request = inflightFetches.get(remoteKey);
      if (!request) {
        request = (async () => {
          const { data, error } = await getSupabase()
            .from("positions")
            .select("amount, avg_entry_usd")
            .eq("user_did", did)
            .eq("mint", token.mint)
            .maybeSingle();
          if (error) {
            console.warn("[supabase] position fetch failed", error);
            return null;
          }
          return data
            ? toPosition(token, data.amount, data.avg_entry_usd)
            : null;
        })();
        inflightFetches.set(remoteKey, request);
        void request.finally(() => {
          if (inflightFetches.get(remoteKey) === request) {
            inflightFetches.delete(remoteKey);
          }
        });
      }

      try {
        const position = await request;
        if (cancelled) return;
        setFetched({ key: remoteKey, position });
      } catch (err) {
        if (!cancelled) console.warn("[supabase] position fetch threw", err);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [useRemote, did, token, remoteKey]);

  const persist = useCallback(
    async (next: Position | null): Promise<boolean> => {
      if (useRemote && did) {
        setSubmitting(true);
        try {
          if (!next || next.amount <= 0) {
            const { error } = await getSupabase()
              .from("positions")
              .delete()
              .eq("user_did", did)
              .eq("mint", token.mint);
            if (error) {
              console.warn("[supabase] position delete failed", error);
              return false;
            }
          } else {
            const { error } = await getSupabase()
              .from("positions")
              .upsert(
                {
                  user_did: did,
                  mint: token.mint,
                  amount: next.amount,
                  avg_entry_usd: next.avgPrice,
                  updated_at: new Date().toISOString(),
                },
                { onConflict: "user_did,mint" },
              );
            if (error) {
              console.warn("[supabase] position upsert failed", error);
              return false;
            }
          }
          inflightFetches.delete(remoteKey);
          setFetched({ key: remoteKey, position: next });
          return true;
        } finally {
          setSubmitting(false);
        }
      }
      setFetched({ key: remoteKey, position: next });
      return true;
    },
    [useRemote, did, token.mint, remoteKey],
  );

  const closePosition = useCallback(async () => {
    return persist(null);
  }, [persist]);

  const openPosition = useCallback(
    async (amount: number, avgPriceUsd: number) => {
      return persist(toPosition(token, amount, avgPriceUsd));
    },
    [persist, token],
  );

  const loading = fetched.key !== remoteKey;

  return {
    position: loading ? null : fetched.position,
    loading,
    submitting,
    remote: useRemote,
    closePosition,
    openPosition,
  };
}

function toPosition(token: Token, amount: number, avgPriceUsd: number): Position {
  const costUsd = amount * avgPriceUsd;
  const valueUsd = amount * token.price;
  const pnlUsd = valueUsd - costUsd;
  return {
    amount,
    avgPrice: avgPriceUsd,
    valueUsd,
    costUsd,
    pnlUsd,
    pnlPercent: costUsd === 0 ? 0 : (pnlUsd / costUsd) * 100,
  };
}
