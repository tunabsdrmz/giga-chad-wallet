import { NextResponse } from "next/server";
import { BIRDEYE_HTTP_CACHE } from "@/lib/birdeye/cache-config";
import { isBirdEyeConfigured } from "@/lib/birdeye/client";
import { fetchTokenOverview } from "@/lib/birdeye/overview";

/**
 * GET /api/birdeye/overview/:mint
 *
 * Lightweight overview proxy — used to fill holder count on tokens
 * loaded from trending/search where BirdEye omits that field.
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ mint: string }> },
) {
  const { mint } = await context.params;
  if (!isBirdEyeConfigured) {
    return NextResponse.json({ error: "BirdEye not configured" }, { status: 503 });
  }

  try {
    const token = await fetchTokenOverview(mint);
    if (!token) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }
    return NextResponse.json(
      { holders: token.holders },
      { headers: { "Cache-Control": BIRDEYE_HTTP_CACHE.overview } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
