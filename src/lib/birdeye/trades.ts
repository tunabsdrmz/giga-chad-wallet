import "server-only";

import { unstable_cache } from "next/cache";
import type { Trade } from "@/types/token";
import { birdeyeFetch } from "@/lib/birdeye/client";
import { BIRDEYE_CACHE } from "@/lib/birdeye/cache-config";
import { withStaleFallback } from "@/lib/birdeye/stale-store";
import type {
  BirdEyeTradeItem,
  BirdEyeTradesPayload,
} from "@/lib/birdeye/types";

interface FetchTradesOptions {
  mint: string;
  limit?: number;
}

async function fetchRecentTradesLive({
  mint,
  limit = 30,
}: FetchTradesOptions): Promise<Trade[]> {
  const data = await birdeyeFetch<BirdEyeTradesPayload>({
    path: "/defi/txs/token",
    params: { address: mint, offset: 0, limit, tx_type: "swap", sort_type: "desc" },
    noStore: true,
  });

  const items = data.items ?? [];
  const trades = items
    .map((item) => toTrade(item, mint))
    .filter((t): t is Trade => t !== null);

  const seen = new Set<string>();
  return trades.filter((t) => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });
}

/**
 * Recent swap transactions for a mint. Cached per mint + limit so the
 * client poll interval can stay slow without stale UI.
 */
export async function fetchRecentTrades(options: FetchTradesOptions): Promise<Trade[]> {
  const limit = options.limit ?? 30;
  return unstable_cache(
    (mint: string, rowLimit: number) =>
      withStaleFallback(
        `trades:${mint}:${rowLimit}`,
        () => fetchRecentTradesLive({ mint, limit: rowLimit }),
        (rows) => rows.length === 0,
      ),
    ["birdeye-trades"],
    { revalidate: BIRDEYE_CACHE.trades.revalidateSeconds, tags: ["birdeye-trades"] },
  )(options.mint, limit);
}

function toTrade(item: BirdEyeTradeItem, mint: string): Trade | null {
  if (!item.txHash) return null;

  const fromIsMint = item.from?.address === mint;
  const toIsMint = item.to?.address === mint;
  if (!fromIsMint && !toIsMint) return null;

  const side: Trade["side"] =
    item.side ?? (toIsMint ? "buy" : "sell");
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
