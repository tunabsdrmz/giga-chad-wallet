"use client";

import { usePrivy } from "@privy-io/react-auth";
import type { Token } from "@/types/token";
import { Button } from "@/components/ui/button";
import { TradePanel } from "@/components/trade/TradePanel";
import { PositionCard } from "@/components/trade/PositionCard";
import { isPrivyConfigured } from "@/lib/privy-config";
import { usePosition } from "@/lib/use-position";

/**
 * Right-side panel on the trade page. Hides the buy/sell + position UI
 * behind an auth gate so guests have to sign in before trading.
 */
export function TradeSidebar({ token }: { token: Token }) {
  if (!isPrivyConfigured) {
    return <SidebarPanels token={token} />;
  }
  return <GatedSidebar token={token} />;
}

function SidebarPanels({ token }: { token: Token }) {
  const position = usePosition(token);
  return (
    <>
      <TradePanel token={token} position={position} />
      <PositionCard token={token} position={position} />
    </>
  );
}

function GatedSidebar({ token }: { token: Token }) {
  const { ready, authenticated, login } = usePrivy();

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Trading is gated
        </div>
        <h3 className="text-lg font-semibold">Sign in to trade {token.symbol}</h3>
        <p className="max-w-[260px] text-sm text-muted-foreground">
          Connect with Google or email. A Solana wallet is created for
          you automatically — no seed phrases.
        </p>
        <Button className="mt-2 h-10 w-full text-sm font-semibold" onClick={() => login()}>
          Sign in to trade
        </Button>
        <p className="text-[11px] text-muted-foreground">
          Demo only · Solana devnet
        </p>
      </div>
    );
  }

  return <SidebarPanels token={token} />;
}
