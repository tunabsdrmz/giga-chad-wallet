import "server-only";

import { unstable_cache } from "next/cache";
import type { Holder } from "@/types/token";
import { birdeyeFetch } from "@/lib/birdeye/client";
import { BIRDEYE_CACHE } from "@/lib/birdeye/cache-config";
import { withStaleFallback } from "@/lib/birdeye/stale-store";
import type { BirdEyeHoldersPayload } from "@/lib/birdeye/types";

interface FetchHoldersOptions {
  mint: string;
  limit?: number;
  priceUsd?: number;
  marketCap?: number;
}

async function fetchHoldersLive({
  mint,
  limit = 20,
  priceUsd = 0,
  marketCap = 0,
}: FetchHoldersOptions): Promise<Holder[]> {
  const data = await birdeyeFetch<BirdEyeHoldersPayload>({
    path: "/defi/v3/token/holder",
    params: { address: mint, offset: 0, limit },
    noStore: true,
  });

  const items = data.items ?? [];

  return items.map((item, idx): Holder => {
    const uiAmount = item.ui_amount ?? 0;
    const valueUsd = uiAmount * priceUsd;
    const percent =
      item.percentage ??
      (marketCap > 0 ? (valueUsd / marketCap) * 100 : 0);
    return {
      rank: idx + 1,
      address: item.owner,
      percent,
      valueUsd,
    };
  });
}

/**
 * Top holders for a mint. Cached per mint + pricing inputs — holder
 * lists change slowly so we keep this TTL long.
 */
export async function fetchHolders(options: FetchHoldersOptions): Promise<Holder[]> {
  const limit = options.limit ?? 20;
  const priceUsd = options.priceUsd ?? 0;
  const marketCap = options.marketCap ?? 0;
  return unstable_cache(
    (mint: string, rowLimit: number, price: number, mcap: number) =>
      withStaleFallback(
        `holders:${mint}:${rowLimit}:${price}:${mcap}`,
        () => fetchHoldersLive({ mint, limit: rowLimit, priceUsd: price, marketCap: mcap }),
        (rows) => rows.length === 0,
      ),
    ["birdeye-holders"],
    { revalidate: BIRDEYE_CACHE.holders.revalidateSeconds, tags: ["birdeye-holders"] },
  )(options.mint, limit, priceUsd, marketCap);
}
