import "server-only";

import { unstable_cache } from "next/cache";
import type { Token } from "@/types/token";
import { birdeyeFetch } from "@/lib/birdeye/client";
import { BIRDEYE_CACHE } from "@/lib/birdeye/cache-config";
import { withStaleFallback } from "@/lib/birdeye/stale-store";
import type {
  BirdEyeTrendingItem,
  BirdEyeTrendingPayload,
} from "@/lib/birdeye/types";

const { poolSize, revalidateSeconds } = BIRDEYE_CACHE.trending;
const STALE_KEY = "trending-pool";

/** Live BirdEye call — always requests the full pool size. */
async function fetchTrendingLive(limit: number): Promise<Token[]> {
  const data = await birdeyeFetch<BirdEyeTrendingPayload>({
    path: "/defi/token_trending",
    params: {
      sort_by: "rank",
      sort_type: "asc",
      offset: 0,
      limit,
    },
    noStore: true,
  });

  const items = data.tokens ?? [];
  return items.map(toToken).filter(isUsable);
}

async function loadTrendingPool(): Promise<Token[]> {
  return withStaleFallback(STALE_KEY, () => fetchTrendingLive(poolSize), (t) => t.length === 0);
}

/**
 * Cached trending pool — one BirdEye request every ~2 minutes shared
 * across landing and trade. On 429 during revalidation,
 * returns the last good in-process snapshot instead of throwing.
 */
const getTrendingPool = unstable_cache(
  loadTrendingPool,
  ["birdeye-trending-pool"],
  { revalidate: revalidateSeconds, tags: ["birdeye-trending"] },
);

/**
 * Trending tokens, sorted by BirdEye's `rank`. Returns a slice of the
 * cached pool so callers can ask for 1–50 without extra API calls.
 */
export async function fetchTrending(limit = 20): Promise<Token[]> {
  const capped = Math.min(Math.max(limit, 1), poolSize);
  const pool = await getTrendingPool();
  return pool.slice(0, capped);
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
    holders: 0,
    liquidity: item.liquidity,
  };
}

function isUsable(t: Token): boolean {
  return !!t.mint && !!t.symbol && t.symbol !== "?" && t.price > 0;
}
