import "server-only";

import { birdeyeFetch } from "@/lib/birdeye/client";
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
  "1m": { interval: "1m", stepSeconds: 60, lookback: 60 * 60 * 2 }, // last 2h
  "5m": { interval: "5m", stepSeconds: 300, lookback: 60 * 60 * 12 }, // last 12h
  "1h": { interval: "1H", stepSeconds: 3600, lookback: 60 * 60 * 24 * 4 }, // last 4d
  "1d": { interval: "1D", stepSeconds: 86400, lookback: 60 * 60 * 24 * 60 }, // last 60d
  "1w": { interval: "1W", stepSeconds: 604800, lookback: 60 * 60 * 24 * 365 }, // last 1y
};

interface FetchCandlesOptions {
  mint: string;
  timeframe: keyof typeof TIMEFRAME_MAP;
}

/**
 * OHLCV candles for a mint at the requested timeframe. Returns a list
 * in chronological order (oldest first) so lightweight-charts can
 * consume it directly.
 */
export async function fetchCandles({
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
    revalidate: 30,
  });

  const items = data.items ?? [];
  return items.map(toCandle).filter((c) => Number.isFinite(c.close));
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
