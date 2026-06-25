import type { ReactNode } from "react";
import { TradeLayoutClient } from "@/components/trade/TradeLayoutClient";
import { TradeShell } from "@/components/trade/TradeShell";

export default function TradeLayout({ children }: { children: ReactNode }) {
  return (
    <TradeShell>
      <TradeLayoutClient>{children}</TradeLayoutClient>
    </TradeShell>
  );
}
