import "server-only";

import { unstable_cache } from "next/cache";
import { birdeyeFetch } from "@/lib/birdeye/client";
import { BIRDEYE_CACHE } from "@/lib/birdeye/cache-config";
import { withStaleFallback } from "@/lib/birdeye/stale-store";
import type {
  BirdEyeCandleItem,
  BirdEyeOhlcvInterval,
  BirdEyeOhlcvPayload,
} from "@/lib/birdeye/types";
import type { Candle } from "@/lib/mock/market";

/** Our UI timeframes mapped to BirdEye's interval strings + step seconds. */
export const TIMEFRAME_MAP: Record<
  string,
  { interval: BirdEyeOhlcvInterval; stepSeconds: number; lookback: number }
> = {
  "1m": { interval: "1m", stepSeconds: 60, lookback: 60 * 60 * 2 },
  "5m": { interval: "5m", stepSeconds: 300, lookback: 60 * 60 * 12 },
  "1h": { interval: "1H", stepSeconds: 3600, lookback: 60 * 60 * 24 * 4 },
  "1d": { interval: "1D", stepSeconds: 86400, lookback: 60 * 60 * 24 * 60 },
  "1w": { interval: "1W", stepSeconds: 604800, lookback: 60 * 60 * 24 * 365 },
};

interface FetchCandlesOptions {
  mint: string;
  timeframe: keyof typeof TIMEFRAME_MAP;
}

async function fetchCandlesLive({
  mint,
  timeframe,
}: FetchCandlesOptions): Promise<Candle[]> {
  const tf = TIMEFRAME_MAP[timeframe];
  if (!tf) throw new Error(`Unsupported timeframe: ${timeframe}`);

  const nowSec = Math.floor(Date.now() / 1000);
  const fromSec = nowSec - tf.lookback;

  const data = await birdeyeFetch<BirdEyeOhlcvPayload>({
    path: "/defi/ohlcv",
    params: {
      address: mint,
      type: tf.interval,
      time_from: fromSec,
      time_to: nowSec,
    },
    noStore: true,
  });

  const items = data.items ?? [];
  return items.map(toCandle).filter((c) => Number.isFinite(c.close));
}

/**
 * OHLCV candles for a mint at the requested timeframe. Cached per
 * mint + timeframe so chart toggles don't re-hit BirdEye within the TTL.
 */
export async function fetchCandles(options: FetchCandlesOptions): Promise<Candle[]> {
  return unstable_cache(
    (mint: string, timeframe: string) =>
      withStaleFallback(
        `ohlcv:${mint}:${timeframe}`,
        () => fetchCandlesLive({ mint, timeframe: timeframe as keyof typeof TIMEFRAME_MAP }),
        (candles) => candles.length === 0,
      ),
    ["birdeye-ohlcv"],
    { revalidate: BIRDEYE_CACHE.ohlcv.revalidateSeconds, tags: ["birdeye-ohlcv"] },
  )(options.mint, options.timeframe);
}

function toCandle(item: BirdEyeCandleItem): Candle {
  return {
    time: item.unixTime,
    open: item.o,
    high: item.h,
    low: item.l,
    close: item.c,
  };
}
