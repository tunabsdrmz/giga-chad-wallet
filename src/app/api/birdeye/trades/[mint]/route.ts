import { NextResponse } from "next/server";
import { fetchRecentTrades } from "@/lib/birdeye/trades";
import { BIRDEYE_HTTP_CACHE } from "@/lib/birdeye/cache-config";
import { isBirdEyeConfigured } from "@/lib/birdeye/client";

/**
 * GET /api/birdeye/trades/:mint?limit=30
 *
 * Recent swap transactions for a mint. Cached briefly server-side so
 * polling clients don't burn through the rate limit.
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ mint: string }> },
) {
  const { mint } = await context.params;
  if (!isBirdEyeConfigured) {
    return NextResponse.json({ error: "BirdEye not configured" }, { status: 503 });
  }
  const limit = Number(new URL(req.url).searchParams.get("limit") ?? 30);
  try {
    const trades = await fetchRecentTrades({ mint, limit });
    return NextResponse.json(
      { trades },
      { headers: { "Cache-Control": BIRDEYE_HTTP_CACHE.trades } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
