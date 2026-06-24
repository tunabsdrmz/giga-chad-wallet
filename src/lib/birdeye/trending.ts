import "server-only";

import type { Token } from "@/types/token";
import { birdeyeFetch } from "@/lib/birdeye/client";
import type {
  BirdEyeTrendingItem,
  BirdEyeTrendingPayload,
} from "@/lib/birdeye/types";

/**
 * Trending tokens, sorted by BirdEye's `rank`. We cap at `limit` and
 * filter out entries missing the price/symbol fields we rely on.
 */
export async function fetchTrending(limit = 20): Promise<Token[]> {
  const data = await birdeyeFetch<BirdEyeTrendingPayload>({
    path: "/defi/token_trending",
    params: {
      sort_by: "rank",
      sort_type: "asc",
      offset: 0,
      limit,
    },
    revalidate: 60,
  });

  const items = data.tokens ?? [];
  return items.map(toToken).filter(isUsable);
}

function toToken(item: BirdEyeTrendingItem): Token {
  return {
    mint: item.address,
    symbol: item.symbol ?? "?",
    name: item.name ?? item.symbol ?? "Unknown",
    logoUrl: item.logoURI,
    price: item.price ?? 0,
    change24h: item.price24hChangePercent ?? 0,
    volume24h: item.volume24hUSD ?? 0,
    marketCap: item.marketcap ?? item.fdv ?? 0,
    holders: 0, // not in the trending response — filled in by overview if needed
    liquidity: item.liquidity,
  };
}

function isUsable(t: Token): boolean {
  return !!t.mint && !!t.symbol && t.symbol !== "?" && t.price > 0;
}
