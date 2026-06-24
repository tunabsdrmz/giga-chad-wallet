"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface TradeMintNav {
  activeMint: string;
  selectMint: (mint: string) => void;
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

  useEffect(() => {
    setActiveMint(initialMint);
  }, [initialMint]);

  const selectMint = useCallback((mint: string) => {
    setActiveMint((current) => {
      if (mint === current) return current;
      window.history.replaceState(null, "", `/trade/${mint}`);
      return mint;
    });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const segment = window.location.pathname.split("/").pop();
      if (segment) setActiveMint(segment);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <TradeMintNavContext.Provider value={{ activeMint, selectMint }}>
      {children}
    </TradeMintNavContext.Provider>
  );
}

export function useTradeMintNav(): TradeMintNav | null {
  return useContext(TradeMintNavContext);
}
