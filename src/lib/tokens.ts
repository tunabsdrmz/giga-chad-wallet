import "server-only";

import type { Token } from "@/types/token";
import { isBirdEyeConfigured } from "@/lib/birdeye/client";
import { fetchTrending } from "@/lib/birdeye/trending";
import { fetchTokenOverview } from "@/lib/birdeye/overview";
import { MOCK_TOKENS } from "@/lib/mock/tokens";

/**
 * Tokens used by the trending list. Hits BirdEye when configured; if
 * the call fails (network, rate limit) we fall back to the mock list
 * so the UI never breaks.
 */
export async function getTrending(limit = 20): Promise<Token[]> {
  if (!isBirdEyeConfigured) return mockTrending(limit);
  try {
    const tokens = await fetchTrending(limit);
    return tokens.length > 0 ? tokens : mockTrending(limit);
  } catch (err) {
    console.warn("[tokens] BirdEye trending failed, using mocks:", errMessage(err));
    return mockTrending(limit);
  }
}

/**
 * Detail for a single mint. Returns null if BirdEye doesn't know the
 * token *and* it isn't in our mock list — in that case the trade page
 * should 404.
 */
export async function getTokenByMint(mint: string): Promise<Token | null> {
  if (isBirdEyeConfigured) {
    try {
      const t = await fetchTokenOverview(mint);
      if (t) return t;
    } catch (err) {
      console.warn(
        `[tokens] BirdEye overview failed for ${mint}, using mock:`,
        errMessage(err),
      );
    }
  }
  return MOCK_TOKENS.find((t) => t.mint === mint) ?? null;
}

/**
 * Mints we know we can render — used by `generateStaticParams` so
 * Next.js can pre-render at build time without hitting BirdEye.
 */
export function getStaticMints(): string[] {
  return MOCK_TOKENS.map((t) => t.mint);
}

function mockTrending(limit: number): Token[] {
  return [...MOCK_TOKENS].sort((a, b) => b.volume24h - a.volume24h).slice(0, limit);
}

function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
