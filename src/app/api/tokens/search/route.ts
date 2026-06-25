import { NextResponse } from "next/server";
import { searchTokens } from "@/lib/token-search";

/**
 * GET /api/tokens/search?q=bonk&limit=8
 *
 * Navbar token search — local catalog + optional BirdEye v3 search.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 8), 1), 20);

  if (!q) {
    return NextResponse.json({ tokens: [] });
  }

  try {
    const tokens = await searchTokens(q, limit);
    return NextResponse.json(
      { tokens },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message, tokens: [] }, { status: 502 });
  }
}
