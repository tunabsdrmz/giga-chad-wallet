import type { Token } from "@/types/token";

/**
 * Mock token data layer. Uses real Solana mint addresses so the same shapes
 * can later be swapped for live BirdEye / Alchemy responses without touching
 * the UI. Prices and stats are illustrative only.
 */
export const MOCK_TOKENS: Token[] = [
  {
    mint: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Solana",
    price: 168.42,
    change24h: 4.21,
    volume24h: 2_140_000_000,
    marketCap: 79_500_000_000,
    holders: 1_240_000,
    liquidity: 410_000_000,
  },
  {
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    symbol: "BONK",
    name: "Bonk",
    price: 0.0000231,
    change24h: 12.84,
    volume24h: 96_300_000,
    marketCap: 1_720_000_000,
    holders: 712_000,
    liquidity: 28_400_000,
  },
  {
    mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    symbol: "WIF",
    name: "dogwifhat",
    price: 1.92,
    change24h: -3.45,
    volume24h: 134_000_000,
    marketCap: 1_910_000_000,
    holders: 198_000,
    liquidity: 41_000_000,
  },
  {
    mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    symbol: "JUP",
    name: "Jupiter",
    price: 0.84,
    change24h: 2.13,
    volume24h: 58_000_000,
    marketCap: 1_130_000_000,
    holders: 540_000,
    liquidity: 33_000_000,
  },
  {
    mint: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    symbol: "POPCAT",
    name: "Popcat",
    price: 0.71,
    change24h: 18.92,
    volume24h: 44_000_000,
    marketCap: 698_000_000,
    holders: 92_000,
    liquidity: 19_500_000,
  },
  {
    mint: "ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY",
    symbol: "MOODENG",
    name: "Moo Deng",
    price: 0.18,
    change24h: -7.61,
    volume24h: 31_000_000,
    marketCap: 178_000_000,
    holders: 64_000,
    liquidity: 8_900_000,
  },
  {
    mint: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5",
    symbol: "MEW",
    name: "cat in a dogs world",
    price: 0.0079,
    change24h: 6.04,
    volume24h: 22_000_000,
    marketCap: 702_000_000,
    holders: 118_000,
    liquidity: 14_200_000,
  },
  {
    mint: "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC",
    symbol: "BOME",
    name: "Book of Meme",
    price: 0.0091,
    change24h: 9.37,
    volume24h: 27_500_000,
    marketCap: 637_000_000,
    holders: 84_000,
    liquidity: 11_800_000,
  },
];

export function getTokenByMint(mint: string): Token | undefined {
  return MOCK_TOKENS.find((t) => t.mint === mint);
}

export function getTokenBySymbol(symbol: string): Token | undefined {
  const upper = symbol.toUpperCase();
  return MOCK_TOKENS.find((t) => t.symbol.toUpperCase() === upper);
}

/** Sorted by 24h volume, highest first. */
export function getTrendingTokens(): Token[] {
  return [...MOCK_TOKENS].sort((a, b) => b.volume24h - a.volume24h);
}
