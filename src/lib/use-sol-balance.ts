"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { address, type Address } from "@solana/kit";
import { getSolanaRpc } from "@/lib/solana/rpc";

const LAMPORTS_PER_SOL = 1_000_000_000;
const REFRESH_INTERVAL_MS = 30_000;

interface BalanceState {
  /** SOL balance (lamports / 1e9). Null while loading or on error. */
  sol: number | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

interface FetchResult {
  key: string;
  sol: number | null;
  error: string | null;
}

/**
 * Polls the wallet's lamport balance on the active Solana network via
 * the configured RPC (Alchemy when set, public Devnet fallback
 * otherwise). Pass `null` while the address is unknown — the hook then
 * stays idle.
 *
 * `loading` is derived from the input key vs. the last-completed
 * fetch's key so we never need to synchronously set state inside the
 * effect.
 */
export function useSolBalance(walletAddress: string | null | undefined): BalanceState {
  const [fetched, setFetched] = useState<FetchResult>({ key: "", sol: null, error: null });
  const [pulse, setPulse] = useState(0);

  // Validate synchronously so address-format errors don't need an effect.
  const pubkey = useMemo<Address | null>(() => {
    if (!walletAddress) return null;
    try {
      return address(walletAddress);
    } catch {
      return null;
    }
  }, [walletAddress]);

  const currentKey = walletAddress && pubkey ? `${walletAddress}|${pulse}` : "";

  useEffect(() => {
    if (!walletAddress || !pubkey) return;
    let cancelled = false;
    const rpc = getSolanaRpc();
    const key = `${walletAddress}|${pulse}`;
    const run = async () => {
      try {
        const res = await rpc.getBalance(pubkey).send();
        if (cancelled) return;
        setFetched({
          key,
          sol: Number(res.value) / LAMPORTS_PER_SOL,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;
        setFetched({
          key,
          sol: null,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    };
    void run();
    const id = setInterval(run, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [walletAddress, pubkey, pulse]);

  const refresh = useCallback(() => setPulse((p) => p + 1), []);

  if (!walletAddress) {
    return { sol: null, loading: false, error: null, refresh };
  }
  if (!pubkey) {
    return { sol: null, loading: false, error: "Invalid address", refresh };
  }
  const loading = fetched.key !== currentKey;
  return {
    sol: loading ? null : fetched.sol,
    loading,
    error: loading ? null : fetched.error,
    refresh,
  };
}
