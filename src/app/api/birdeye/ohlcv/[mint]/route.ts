import { NextResponse } from "next/server";
import { fetchCandles, TIMEFRAME_MAP } from "@/lib/birdeye/ohlcv";
import { isBirdEyeConfigured } from "@/lib/birdeye/client";

/**
 * GET /api/birdeye/ohlcv/:mint?tf=1h
 *
 * OHLCV candles for the chart. `tf` must match one of our UI
 * timeframes (1m, 5m, 1h, 1d, 1w).
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ mint: string }> },
) {
  const { mint } = await context.params;
  if (!isBirdEyeConfigured) {
    return NextResponse.json({ error: "BirdEye not configured" }, { status: 503 });
  }
  const tf = new URL(req.url).searchParams.get("tf") ?? "1h";
  if (!(tf in TIMEFRAME_MAP)) {
    return NextResponse.json(
      { error: `Unknown timeframe: ${tf}` },
      { status: 400 },
    );
  }
  try {
    const candles = await fetchCandles({
      mint,
      timeframe: tf as keyof typeof TIMEFRAME_MAP,
    });
    return NextResponse.json({ candles });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
