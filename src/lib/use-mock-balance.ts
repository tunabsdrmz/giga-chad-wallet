"use client";

import { useCallback, useEffect, useState } from "react";

const DEFAULT_USDC = 1250;

function storageKey(did: string | null): string {
  return did ? `chadwallet:demo-usdc:${did}` : "chadwallet:demo-usdc:guest";
}

function readBalance(key: string): number {
  if (typeof window === "undefined") return DEFAULT_USDC;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return DEFAULT_USDC;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : DEFAULT_USDC;
  } catch {
    return DEFAULT_USDC;
  }
}

/**
 * Demo USDC balance for the mock trade panel. Persisted per Privy DID
 * (or a guest key when auth is stubbed).
 */
export function useMockBalance(did: string | null) {
  const key = storageKey(did);
  const [balance, setBalance] = useState<number>(DEFAULT_USDC);

  useEffect(() => {
    setBalance(readBalance(key));
  }, [key]);

  const persist = useCallback(
    (next: number) => {
      setBalance(next);
      try {
        window.localStorage.setItem(key, String(next));
      } catch {
        // ignore quota errors
      }
    },
    [key],
  );

  const debit = useCallback(
    (usd: number) => {
      if (usd <= 0) return false;
      if (usd > balance) return false;
      persist(balance - usd);
      return true;
    },
    [balance, persist],
  );

  const credit = useCallback(
    (usd: number) => {
      if (usd <= 0) return;
      persist(balance + usd);
    },
    [balance, persist],
  );

  return { balance, debit, credit };
}
