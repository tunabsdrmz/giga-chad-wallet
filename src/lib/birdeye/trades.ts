import "server-only";

import type { Trade } from "@/types/token";
import { birdeyeFetch } from "@/lib/birdeye/client";
import type {
  BirdEyeTradeItem,
  BirdEyeTradesPayload,
} from "@/lib/birdeye/types";

interface FetchTradesOptions {
  mint: string;
  limit?: number;
}

/**
 * Recent swap transactions for a mint. We normalize BirdEye's
 * dual-asset (from/to or base/quote) trade shape into our flat
 * `Trade` type by treating the side from the mint's perspective:
 * "buy" = USDC/SOL → mint, "sell" = mint → USDC/SOL.
 */
export async function fetchRecentTrades({
  mint,
  limit = 30,
}: FetchTradesOptions): Promise<Trade[]> {
  const data = await birdeyeFetch<BirdEyeTradesPayload>({
    path: "/defi/txs/token",
    params: { address: mint, offset: 0, limit, tx_type: "swap", sort_type: "desc" },
    // Live feed, but cached for a few seconds so we don't blow the rate limit.
    revalidate: 5,
  });

  const items = data.items ?? [];
  const trades = items
    .map((item) => toTrade(item, mint))
    .filter((t): t is Trade => t !== null);

  // BirdEye sometimes returns multiple legs of the same swap as
  // separate rows with the same txHash — collapse to a single trade
  // per tx (keeping the first).
  const seen = new Set<string>();
  return trades.filter((t) => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });
}

function toTrade(item: BirdEyeTradeItem, mint: string): Trade | null {
  if (!item.txHash) return null;

  // Figure out which side of the swap is the target mint.
  const fromIsMint = item.from?.address === mint;
  const toIsMint = item.to?.address === mint;
  if (!fromIsMint && !toIsMint) return null;

  const side: Trade["side"] =
    item.side ?? (toIsMint ? "buy" : "sell"); // when buying, the mint shows up in `to`
  const mintLeg = toIsMint ? item.to! : item.from!;
  const counterLeg = toIsMint ? item.from! : item.to!;

  const amount = Math.abs(mintLeg.uiAmount ?? mintLeg.amount ?? 0);
  const price = mintLeg.price ?? mintLeg.nearestPrice ?? 0;
  const valueUsd =
    item.volumeUSD ??
    (counterLeg.uiAmount ?? counterLeg.amount ?? 0) * (counterLeg.price ?? counterLeg.nearestPrice ?? 0);

  return {
    id: item.txHash,
    side,
    amount,
    price,
    valueUsd,
    trader: item.owner,
    timestamp: item.blockUnixTime * 1000,
  };
}
