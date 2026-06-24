import "server-only";

import type { Holder } from "@/types/token";
import { birdeyeFetch } from "@/lib/birdeye/client";
import type { BirdEyeHoldersPayload } from "@/lib/birdeye/types";

interface FetchHoldersOptions {
  /** Token mint to look up. */
  mint: string;
  /** Max rows to return (BirdEye max is 100 on Standard). */
  limit?: number;
  /** Current token price in USD; used to compute USD value per holder. */
  priceUsd?: number;
  /**
   * Token market cap in USD. Used to derive the "% of supply" column
   * since BirdEye's v3 holder endpoint doesn't return it directly
   * (`percent = valueUsd / marketCap * 100`).
   */
  marketCap?: number;
}

/**
 * Top holders for a mint. Note: BirdEye's holder endpoint returns the
 * **ui_amount** field which is already decimal-adjusted (i.e. raw
 * amount / 10^decimals), so we can multiply by price directly.
 */
export async function fetchHolders({
  mint,
  limit = 20,
  priceUsd = 0,
  marketCap = 0,
}: FetchHoldersOptions): Promise<Holder[]> {
  const data = await birdeyeFetch<BirdEyeHoldersPayload>({
    path: "/defi/v3/token/holder",
    params: { address: mint, offset: 0, limit },
    revalidate: 300,
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
