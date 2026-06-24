export interface Token {
  /** Solana mint address */
  mint: string;
  symbol: string;
  name: string;
  logoUrl?: string;
  /** Current price in USD */
  price: number;
  /** 24h price change in percent (e.g. 12.5 = +12.5%) */
  change24h: number;
  /** 24h trading volume in USD */
  volume24h: number;
  /** Fully diluted / market cap in USD */
  marketCap: number;
  /** Number of unique holders */
  holders: number;
  /** 24h liquidity in USD */
  liquidity?: number;
}

export type TradeSide = "buy" | "sell";

export interface Trade {
  id: string;
  side: TradeSide;
  /** Token amount */
  amount: number;
  /** USD value of the trade */
  valueUsd: number;
  price: number;
  /** Truncated wallet address of the trader */
  trader: string;
  /** Unix epoch millis */
  timestamp: number;
}

export interface Holder {
  rank: number;
  address: string;
  /** Percentage of total supply held */
  percent: number;
  /** USD value of the holding */
  valueUsd: number;
}
