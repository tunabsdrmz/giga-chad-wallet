"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { mintFromPathname } from "@/lib/trade-mint-path";
import type { Token } from "@/types/token";

interface TradeMintNav {
  activeMint: string;
  /** Client-side mint switch; pass `token` when the mint is outside the trending pool. */
  selectMint: (mint: string, token?: Token) => void;
  getKnownToken: (mint: string) => Token | undefined;
}

const TradeMintNavContext = createContext<TradeMintNav | null>(null);

/**
 * Keeps mint switches inside the trade terminal on the client — updates
 * the URL with `history.replaceState` instead of Next.js navigation so
 * we don't re-fetch the whole RSC tree on every coin click.
 */
export function TradeMintNavProvider({
  initialMint,
  children,
}: {
  initialMint: string;
  children: ReactNode;
}) {
  const [activeMint, setActiveMint] = useState(initialMint);
  const [prevInitialMint, setPrevInitialMint] = useState(initialMint);
  const [tokenOverrides, setTokenOverrides] = useState<Record<string, Token>>({});
  if (initialMint !== prevInitialMint) {
    setPrevInitialMint(initialMint);
    setActiveMint(initialMint);
  }

  const getKnownToken = useCallback(
    (mint: string) => tokenOverrides[mint],
    [tokenOverrides],
  );

  const selectMint = useCallback((mint: string, token?: Token) => {
    if (token) {
      setTokenOverrides((prev) =>
        prev[mint] === token ? prev : { ...prev, [mint]: token },
      );
    }
    setActiveMint((current) => {
      if (mint === current) return current;
      window.history.replaceState(null, "", `/trade/${mint}`);
      return mint;
    });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const mint = mintFromPathname(window.location.pathname);
      if (mint) setActiveMint(mint);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <TradeMintNavContext.Provider value={{ activeMint, selectMint, getKnownToken }}>
      {children}
    </TradeMintNavContext.Provider>
  );
}

export function useTradeMintNav(): TradeMintNav | null {
  return useContext(TradeMintNavContext);
}
