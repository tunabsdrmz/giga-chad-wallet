import "server-only";

import type { Token } from "@/types/token";
import { birdeyeFetch } from "@/lib/birdeye/client";
import type { BirdEyeOverviewPayload } from "@/lib/birdeye/types";

/**
 * Detailed info for a single mint. We use the `frames=24h` shape so we
 * get 24-hour price change and volume in one request.
 */
export async function fetchTokenOverview(mint: string): Promise<Token | null> {
  const data = await birdeyeFetch<BirdEyeOverviewPayload>({
    path: "/defi/token_overview",
    params: { address: mint },
    revalidate: 30,
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
