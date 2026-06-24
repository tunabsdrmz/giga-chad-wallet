import type { Position } from "@/lib/mock/market";

/** Result of sizing a mock sell against the current holding. */
export interface SellPlan {
  sellTokens: number;
  /** USD credited back to the demo balance. */
  proceedsUsd: number;
  /** Remaining token amount after the sell (0 when fully closed). */
  remainingAmount: number;
  close: boolean;
}

export function calcBuyPosition(
  current: Position | null,
  usd: number,
  price: number,
): { amount: number; avgPrice: number } | null {
  if (usd <= 0 || price <= 0) return null;
  const buyTokens = usd / price;
  if (!current || current.amount <= 0) {
    return { amount: buyTokens, avgPrice: price };
  }
  const amount = current.amount + buyTokens;
  const avgPrice =
    (current.amount * current.avgPrice + buyTokens * price) / amount;
  return { amount, avgPrice };
}

export function calcSellPlan(
  current: Position | null,
  usd: number,
  price: number,
): SellPlan | null {
  if (!current || current.amount <= 0 || usd <= 0 || price <= 0) return null;
  const sellTokens = Math.min(usd / price, current.amount);
  if (sellTokens <= 0) return null;
  const remainingAmount = current.amount - sellTokens;
  return {
    sellTokens,
    proceedsUsd: sellTokens * price,
    remainingAmount,
    close: remainingAmount <= 1e-12,
  };
}
