import "server-only";

import { unstable_cache } from "next/cache";
import type { Token } from "@/types/token";
import { birdeyeFetch } from "@/lib/birdeye/client";
import { BIRDEYE_CACHE } from "@/lib/birdeye/cache-config";
import { withStaleFallback } from "@/lib/birdeye/stale-store";
import type { BirdEyeOverviewPayload } from "@/lib/birdeye/types";

async function fetchTokenOverviewLive(mint: string): Promise<Token | null> {
  const data = await birdeyeFetch<BirdEyeOverviewPayload>({
    path: "/defi/token_overview",
    params: { address: mint },
    noStore: true,
  });

  if (!data?.address) return null;

  return {
    mint: data.address,
    symbol: data.symbol ?? "?",
    name: data.name ?? data.symbol ?? "Unknown",
    logoUrl: data.logoURI,
    price: data.price ?? 0,
    change24h: data.priceChange24hPercent ?? 0,
    volume24h: data.v24hUSD ?? 0,
    marketCap: data.mc ?? data.realMc ?? 0,
    holders: data.holder ?? 0,
    liquidity: data.liquidity,
  };
}

/**
 * Detailed info for a single mint. Cached per address — only used when
 * the mint isn't already present in the trending pool.
 */
export async function fetchTokenOverview(mint: string): Promise<Token | null> {
  return unstable_cache(
    (address: string) =>
      withStaleFallback(
        `overview:${address}`,
        () => fetchTokenOverviewLive(address),
        (token) => token === null,
      ),
    ["birdeye-token-overview"],
    {
      revalidate: BIRDEYE_CACHE.overview.revalidateSeconds,
      tags: ["birdeye-overview"],
    },
  )(mint);
}
