"use client";

import { MobileTrendingStrip } from "@/components/trade/MobileTrendingStrip";
import { TradeLeftSidebar } from "@/components/trade/TradeLeftSidebar";
import { TokenHeader } from "@/components/trade/TokenHeader";
import { PriceChart } from "@/components/trade/PriceChart";
import { ActivityPanel } from "@/components/trade/ActivityPanel";
import { TradeSidebar } from "@/components/trade/TradeSidebar";
import { useTradeMintNav } from "@/components/trade/TradeMintNav";
import { TRADE_TERMINAL_GRID_CLASS } from "@/components/trade/trade-terminal-grid";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import type { Period } from "@/lib/supabase/types";
import type { Token } from "@/types/token";

export function TradeTerminal({
  seedToken,
  trending,
  leaderboard,
  leaderboardPeriod,
}: {
  seedToken: Token;
  trending: Token[];
  leaderboard: LeaderboardEntry[];
  leaderboardPeriod: Period;
}) {
  return (
    <TradeTerminalShell
      seedToken={seedToken}
      trending={trending}
      leaderboard={leaderboard}
      leaderboardPeriod={leaderboardPeriod}
    />
  );
}

function resolveToken(
  activeMint: string,
  trending: Token[],
  seedToken: Token,
  override?: Token,
): Token | null {
  return (
    trending.find((t) => t.mint === activeMint) ??
    override ??
    (seedToken.mint === activeMint ? seedToken : null)
  );
}

function TradeTerminalShell({
  seedToken,
  trending,
  leaderboard,
  leaderboardPeriod,
}: {
  seedToken: Token;
  trending: Token[];
  leaderboard: LeaderboardEntry[];
  leaderboardPeriod: Period;
}) {
  const nav = useTradeMintNav();
  const activeMint = nav?.activeMint ?? seedToken.mint;
  const token = resolveToken(
    activeMint,
    trending,
    seedToken,
    nav?.getKnownToken(activeMint),
  );

  if (!token) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-muted-foreground">
        Could not load this token. Choose one from the trending list.
      </div>
    );
  }

  return (
    <>
      <MobileTrendingStrip
        tokens={trending}
        activeMint={token.mint}
      />

      <div className={TRADE_TERMINAL_GRID_CLASS}>
        <aside className="trade-panel hidden min-h-0 w-full min-w-0 flex-col border-r lg:flex [grid-area:leaderboard] lg:row-span-3">
          <TradeLeftSidebar
            tokens={trending}
            activeMint={token.mint}
            leaderboard={leaderboard}
            leaderboardPeriod={leaderboardPeriod}
          />
        </aside>

        <div className="trade-panel min-w-0 border-b lg:border-b-0 [grid-area:header]">
          <TokenHeader token={token} />
        </div>

        <aside className="trade-panel min-h-0 overflow-y-auto border-b lg:row-span-3 lg:border-b-0 lg:border-l [grid-area:sidebar]">
          <TradeSidebar
            key={token.mint}
            token={token}
          />
        </aside>

        <div className="trade-panel flex min-h-[270px] h-[min(47vh,460px)] flex-col p-2 sm:min-h-[310px] sm:p-3 lg:min-h-0 lg:h-full lg:border-r [grid-area:chart]">
          <PriceChart
            key={token.mint}
            token={token}
          />
        </div>

        <div className="trade-panel min-h-[250px] h-[min(36vh,350px)] sm:min-h-[270px] lg:min-h-0 lg:h-full [grid-area:activity]">
          <ActivityPanel
            key={token.mint}
            token={token}
          />
        </div>
      </div>
    </>
  );
}
