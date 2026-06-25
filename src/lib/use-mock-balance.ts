"use client";

import { useCallback, useSyncExternalStore } from "react";

const DEFAULT_USDC = 1250;

const balanceListeners = new Set<() => void>();

function notifyBalanceListeners() {
  for (const listener of balanceListeners) {
    listener();
  }
}

function subscribeBalance(callback: () => void) {
  balanceListeners.add(callback);
  return () => balanceListeners.delete(callback);
}

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

  const balance = useSyncExternalStore(
    subscribeBalance,
    () => readBalance(key),
    () => DEFAULT_USDC,
  );

  const persist = useCallback(
    (next: number) => {
      try {
        window.localStorage.setItem(key, String(next));
      } catch {
        // ignore quota errors
      }
      notifyBalanceListeners();
    },
    [key],
  );

  const debit = useCallback(
    (usd: number) => {
      if (usd <= 0) return false;
      const current = readBalance(key);
      if (usd > current) return false;
      persist(current - usd);
      return true;
    },
    [key, persist],
  );

  const credit = useCallback(
    (usd: number) => {
      if (usd <= 0) return;
      persist(readBalance(key) + usd);
    },
    [key, persist],
  );

  return { balance, debit, credit };
}
