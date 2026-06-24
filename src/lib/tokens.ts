import "server-only";

import { cache } from "react";
import type { Token } from "@/types/token";
import { isBirdEyeConfigured } from "@/lib/birdeye/client";
import { fetchTrending } from "@/lib/birdeye/trending";
import { fetchTokenOverview } from "@/lib/birdeye/overview";
import { MOCK_TOKENS } from "@/lib/mock/tokens";

/**
 * Tokens used by the trending list. Hits BirdEye when configured; if
 * the call fails (network, rate limit) we fall back to the mock list
 * so the UI never breaks. Deduped per request and backed by a shared
 * 2-minute BirdEye cache (see `birdeye/trending.ts`).
 */
export const getTrending = cache(async function getTrending(limit = 20): Promise<Token[]> {
  if (!isBirdEyeConfigured) return mockTrending(limit);
  try {
    const tokens = await fetchTrending(limit);
    return tokens.length > 0 ? tokens : mockTrending(limit);
  } catch (err) {
    console.warn("[tokens] BirdEye trending failed, using mocks:", errMessage(err));
    return mockTrending(limit);
  }
});

/**
 * Detail for a single mint. Uses the trending pool or mock catalog when
 * possible so we don't burn an overview request on every trade page
 * load. Overview (cached 5 min) runs only for deep-linked mints outside
 * the trending pool.
 */
export async function getTokenByMint(
  mint: string,
  hints: Token[] = [],
): Promise<Token | null> {
  const fallback =
    hints.find((t) => t.mint === mint) ??
    MOCK_TOKENS.find((t) => t.mint === mint) ??
    null;

  if (fallback) return fallback;

  if (isBirdEyeConfigured) {
    try {
      return await fetchTokenOverview(mint);
    } catch (err) {
      console.warn(
        `[tokens] BirdEye overview failed for ${mint}:`,
        errMessage(err),
      );
    }
  }

  return null;
}

/** Safe default when `/trade` needs a redirect target. */
export function getDefaultMint(): string {
  return MOCK_TOKENS[0]!.mint;
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
