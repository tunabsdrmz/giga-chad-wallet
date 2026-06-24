import "server-only";

/** Shared BirdEye cache windows — keep requests well under the 1 rps free tier. */
export const BIRDEYE_CACHE = {
  /** One trending pool fetch serves every page (landing, trade, leaderboard). */
  trending: { poolSize: 50, revalidateSeconds: 120 },
  /** Per-mint overview — only when the mint isn't already in the trending pool. */
  overview: { revalidateSeconds: 300 },
  ohlcv: { revalidateSeconds: 60 },
  trades: { revalidateSeconds: 30 },
  holders: { revalidateSeconds: 300 },
} as const;

/** HTTP cache for `/api/birdeye/*` route handlers (CDN + browser). */
export const BIRDEYE_HTTP_CACHE = {
  ohlcv: "public, s-maxage=60, stale-while-revalidate=120",
  trades: "public, s-maxage=30, stale-while-revalidate=60",
  holders: "public, s-maxage=300, stale-while-revalidate=600",
} as const;
