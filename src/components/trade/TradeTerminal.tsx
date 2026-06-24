"use client";

import { TokenTicker } from "@/components/token/TokenTicker";
import { MobileTrendingStrip } from "@/components/trade/MobileTrendingStrip";
import { TrendingList } from "@/components/trade/TrendingList";
import { TokenHeader } from "@/components/trade/TokenHeader";
import { PriceChart } from "@/components/trade/PriceChart";
import { ActivityPanel } from "@/components/trade/ActivityPanel";
import { TradeSidebar } from "@/components/trade/TradeSidebar";
import {
  TradeMintNavProvider,
  useTradeMintNav,
} from "@/components/trade/TradeMintNav";
import type { Token } from "@/types/token";

export function TradeTerminal({
  initialMint,
  trending,
}: {
  initialMint: string;
  trending: Token[];
}) {
  return (
    <TradeMintNavProvider initialMint={initialMint}>
      <TradeTerminalShell trending={trending} />
    </TradeMintNavProvider>
  );
}

function TradeTerminalShell({ trending }: { trending: Token[] }) {
  const nav = useTradeMintNav();
  const activeMint = nav?.activeMint ?? trending[0]?.mint ?? "";
  const token = trending.find((t) => t.mint === activeMint) ?? trending[0];

  if (!token) return null;

  return (
    <>
      <TokenTicker direction="left" tokens={trending} className="hidden lg:block" />
      <MobileTrendingStrip tokens={trending} activeMint={token.mint} />

      <div
        className={[
          "relative grid grid-cols-1",
          "lg:h-[calc(100dvh-6.6rem)] lg:overflow-hidden",
          "lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)_minmax(300px,360px)]",
          "xl:grid-cols-[280px_minmax(0,1fr)_380px]",
          "2xl:grid-cols-[300px_minmax(0,1fr)_400px]",
          "[grid-template-areas:'header'_'sidebar'_'chart'_'activity']",
          "lg:[grid-template-areas:'trending_header_sidebar'_'trending_chart_sidebar'_'trending_activity_sidebar']",
        ].join(" ")}
      >
        <aside className="hidden min-h-0 w-full min-w-0 flex-col border-r border-white/8 bg-card/20 lg:flex [grid-area:trending] lg:row-span-3">
          <TrendingList tokens={trending} activeMint={token.mint} />
        </aside>

        <div className="min-w-0 [grid-area:header]">
          <TokenHeader token={token} />
        </div>

        <aside className="min-h-0 overflow-y-auto border-b border-white/8 bg-card/20 [grid-area:sidebar] lg:row-span-3 lg:border-b-0 lg:border-l">
          <TradeSidebar key={token.mint} token={token} />
        </aside>

        <div className="min-h-[240px] h-[min(42vh,400px)] p-2 sm:min-h-[280px] sm:p-3 lg:min-h-0 lg:h-auto lg:flex-1 [grid-area:chart]">
          <PriceChart key={token.mint} token={token} />
        </div>

        <div className="min-h-[260px] h-[min(38vh,360px)] border-t border-white/8 bg-card/20 sm:min-h-[280px] lg:min-h-[220px] lg:h-auto [grid-area:activity]">
          <ActivityPanel key={token.mint} token={token} />
        </div>
      </div>
    </>
  );
}
