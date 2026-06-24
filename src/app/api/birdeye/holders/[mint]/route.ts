import { NextResponse } from "next/server";
import { fetchHolders } from "@/lib/birdeye/holders";
import { isBirdEyeConfigured } from "@/lib/birdeye/client";

/**
 * GET /api/birdeye/holders/:mint?price=12.34
 *
 * Server-only proxy so the BirdEye key never reaches the browser.
 * Returns 503 when BirdEye isn't configured so the caller can fall
 * back to mocks.
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ mint: string }> },
) {
  const { mint } = await context.params;
  if (!isBirdEyeConfigured) {
    return NextResponse.json({ error: "BirdEye not configured" }, { status: 503 });
  }
  const sp = new URL(req.url).searchParams;
  const priceUsd = Number(sp.get("price") ?? 0);
  const marketCap = Number(sp.get("marketCap") ?? 0);
  try {
    const holders = await fetchHolders({ mint, priceUsd, marketCap });
    return NextResponse.json({ holders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
