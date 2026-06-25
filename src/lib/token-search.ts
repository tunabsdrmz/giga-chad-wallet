import "server-only";

import type { Token } from "@/types/token";
import { isBirdEyeConfigured } from "@/lib/birdeye/client";
import { fetchBirdEyeSearch } from "@/lib/birdeye/search";
import { MOCK_TOKENS } from "@/lib/mock/tokens";
import { looksLikeMint } from "@/lib/trade-mint-path";
import { getTokenByMint, getTrending } from "@/lib/tokens";

function matchesQuery(token: Token, q: string, qLower: string): boolean {
  return (
    token.symbol.toLowerCase().includes(qLower) ||
    token.name.toLowerCase().includes(qLower) ||
    token.mint.toLowerCase().startsWith(qLower)
  );
}

function dedupeTokens(tokens: Token[]): Token[] {
  const seen = new Set<string>();
  const out: Token[] = [];
  for (const token of tokens) {
    if (seen.has(token.mint)) continue;
    seen.add(token.mint);
    out.push(token);
  }
  return out;
}

/**
 * Token search for the trade navbar — local trending/mock catalog first,
 * mint address lookup, then BirdEye v3 search when configured.
 */
export async function searchTokens(query: string, limit = 8): Promise<Token[]> {
  const q = query.trim();
  if (!q) return [];

  const qLower = q.toLowerCase();
  const trending = await getTrending(50);
  const pool = dedupeTokens([...trending, ...MOCK_TOKENS]);

  const local = pool.filter((token) => matchesQuery(token, q, qLower));

  if (looksLikeMint(q)) {
    const byMint = await getTokenByMint(q, pool);
    if (byMint) {
      return dedupeTokens([byMint, ...local]).slice(0, limit);
    }
  }

  if (local.length >= limit || !isBirdEyeConfigured || q.length < 2) {
    return local.slice(0, limit);
  }

  try {
    const remote = await fetchBirdEyeSearch(q, limit);
    return dedupeTokens([...local, ...remote]).slice(0, limit);
  } catch (err) {
    console.warn("[token-search] BirdEye search failed:", err);
    return local.slice(0, limit);
  }
}
