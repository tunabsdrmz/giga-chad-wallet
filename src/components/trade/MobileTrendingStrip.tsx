"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { Token } from "@/types/token";
import { TradeMintLink } from "@/components/trade/TradeMintLink";
import { TokenAvatar } from "@/components/token/TokenAvatar";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Horizontal token picker shown below the ticker on viewports
 * narrower than `lg`, replacing the left sidebar trending list.
 */
export function MobileTrendingStrip({
  tokens,
  activeMint,
}: {
  tokens: Token[];
  activeMint: string;
}) {
  if (tokens.length === 0) return null;

  return (
    <div className="border-b border-white/8 bg-card/30 lg:hidden">
      <div
        className={cn(
          "flex items-center gap-2 overflow-x-auto px-3 py-2.5",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {tokens.map((token) => {
          const up = token.change24h >= 0;
          const active = token.mint === activeMint;
          return (
            <TradeMintLink
              key={token.mint}
              mint={token.mint}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs transition-colors",
                active
                  ? "border-primary/60 bg-primary/10"
                  : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/6",
              )}
            >
              <TokenAvatar
                mint={token.mint}
                symbol={token.symbol}
                logoUrl={token.logoUrl}
                size="xs"
              />
              <span className="font-semibold">{token.symbol}</span>
              <span
                className={cn(
                  "flex items-center gap-0.5 font-medium",
                  up ? "text-up" : "text-down",
                )}
              >
                {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {formatPercent(token.change24h)}
              </span>
            </TradeMintLink>
          );
        })}
      </div>
    </div>
  );
}
