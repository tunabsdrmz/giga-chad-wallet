import "server-only";

import type { Token } from "@/types/token";
import { birdeyeFetch } from "@/lib/birdeye/client";
import type { BirdEyeSearchPayload, BirdEyeSearchTokenItem } from "@/lib/birdeye/types";

export async function fetchBirdEyeSearch(
  keyword: string,
  limit = 8,
): Promise<Token[]> {
  const data = await birdeyeFetch<BirdEyeSearchPayload>({
    path: "/defi/v3/search",
    params: {
      chain: "solana",
      keyword,
      target: "token",
      limit: Math.min(Math.max(limit, 1), 20),
    },
    noStore: true,
  });

  const tokenGroup = data.items?.find((item) => item.type === "token");
  const rows = tokenGroup?.result ?? [];
  return rows.map(toToken).filter(isUsable);
}

function toToken(item: BirdEyeSearchTokenItem): Token {
  return {
    mint: item.address,
    symbol: item.symbol?.trim() || "?",
    name: item.name ?? item.symbol ?? "Unknown",
    logoUrl: item.logo_uri,
    price: item.price ?? 0,
    change24h: item.price_change_24h_percent ?? 0,
    volume24h: item.volume_24h_usd ?? 0,
    marketCap: item.market_cap ?? item.fdv ?? 0,
    holders: 0,
    liquidity: item.liquidity,
  };
}

function isUsable(t: Token): boolean {
  return !!t.mint && t.symbol !== "?";
}
