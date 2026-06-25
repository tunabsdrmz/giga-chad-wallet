"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { TradeMintNavProvider } from "@/components/trade/TradeMintNav";
import { MOCK_TOKENS } from "@/lib/mock/tokens";
import { mintFromPathname } from "@/lib/trade-mint-path";

/** Wraps trade routes so navbar search can call `selectMint` without RSC navigation. */
export function TradeLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const initialMint = mintFromPathname(pathname) ?? MOCK_TOKENS[0]!.mint;

  return (
    <TradeMintNavProvider initialMint={initialMint}>
      <Navbar variant="trade" />
      {children}
    </TradeMintNavProvider>
  );
}
