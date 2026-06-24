import type { Token, Trade, Holder } from "@/types/token";

export interface Candle {
  /** Unix time in seconds (Lightweight Charts UTCTimestamp). */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Position {
  amount: number;
  avgPrice: number;
  valueUsd: number;
  costUsd: number;
  pnlUsd: number;
  pnlPercent: number;
}

/** Deterministic string hash → 32-bit seed. */
function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Mulberry32 PRNG — deterministic so SSR and client output match. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PSEUDO_ADDRS = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789abcdefghijkmnopqrstuvwxyz";

function pseudoAddress(rng: () => number): string {
  let out = "";
  for (let i = 0; i < 44; i++) {
    out += PSEUDO_ADDRS[Math.floor(rng() * PSEUDO_ADDRS.length)];
  }
  return out;
}

/**
 * Candles ending near the token's current price.
 * `step` is in seconds; defaults to hourly.
 */
export function generateCandles(
  token: Token,
  count = 96,
  step = 3600,
): Candle[] {
  const rng = mulberry32(hashSeed(token.mint + step));
  const vol = 0.03 + Math.abs(token.change24h) / 400;
  const start = token.price / (1 + token.change24h / 100);
  const startTime = Math.floor(Date.now() / 1000 / step) * step - count * step;

  const candles: Candle[] = [];
  let price = start;
  for (let i = 0; i < count; i++) {
    const drift = (token.change24h / 100) * (start / count);
    const open = price;
    const move = (rng() - 0.5) * vol * open + drift;
    const close = Math.max(open + move, open * 0.5);
    const high = Math.max(open, close) * (1 + rng() * vol * 0.5);
    const low = Math.min(open, close) * (1 - rng() * vol * 0.5);
    candles.push({ time: startTime + i * step, open, high, low, close });
    price = close;
  }
  return candles;
}

export function generateHolders(token: Token, count = 12): Holder[] {
  const rng = mulberry32(hashSeed(token.mint + "holders"));
  const holders: Holder[] = [];
  let remaining = 62; // percent held by the top holders
  for (let i = 0; i < count; i++) {
    const percent = i === 0 ? 8 + rng() * 6 : Math.max(0.4, remaining * (0.12 + rng() * 0.1));
    remaining -= percent;
    holders.push({
      rank: i + 1,
      address: pseudoAddress(rng),
      percent,
      valueUsd: (percent / 100) * token.marketCap,
    });
  }
  return holders;
}

export function generateTrades(token: Token, count = 20): Trade[] {
  const rng = mulberry32(hashSeed(token.mint + "trades"));
  const trades: Trade[] = [];
  for (let i = 0; i < count; i++) {
    trades.push(buildTrade(token, rng, i, i * 9_000));
  }
  return trades;
}

/** A single fresh trade for the live feed (client-only, non-deterministic). */
export function randomTrade(token: Token): Trade {
  return buildTrade(token, Math.random, Math.floor(Math.random() * 1e6), 0);
}

function buildTrade(
  token: Token,
  rng: () => number,
  idx: number,
  agoMs: number,
): Trade {
  const side = rng() > 0.48 ? "buy" : "sell";
  const valueUsd = 20 + rng() * 4800;
  const price = token.price * (1 + (rng() - 0.5) * 0.01);
  return {
    id: `${token.mint}-${idx}-${Math.floor(rng() * 1e9)}`,
    side,
    valueUsd,
    price,
    amount: valueUsd / price,
    trader: pseudoAddress(rng),
    timestamp: Date.now() - agoMs,
  };
}

export function getPosition(token: Token): Position {
  const rng = mulberry32(hashSeed(token.mint + "position"));
  const amount = (500 + rng() * 9500) / token.price;
  const avgPrice = token.price * (1 - (rng() - 0.35) * 0.2);
  const costUsd = amount * avgPrice;
  const valueUsd = amount * token.price;
  const pnlUsd = valueUsd - costUsd;
  return {
    amount,
    avgPrice,
    valueUsd,
    costUsd,
    pnlUsd,
    pnlPercent: (pnlUsd / costUsd) * 100,
  };
}
