/**
 * Subset of the BirdEye v3 / Defi response shapes we care about. We
 * keep these intentionally loose (lots of optionals) because BirdEye
 * occasionally renames fields between versions and the free tier
 * sometimes omits fields. Mappers in this folder normalize to our
 * internal `Token`, `Trade`, `Holder`, `Candle` shapes.
 *
 * Reference: https://docs.birdeye.so
 */

export type BirdEyeChain = "solana";

export interface BirdEyeEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ---------- /defi/token_trending ----------------------------------------

export interface BirdEyeTrendingItem {
  address: string;
  symbol?: string;
  name?: string;
  logoURI?: string;
  decimals?: number;
  price?: number;
  price24hChangePercent?: number;
  volume24hUSD?: number;
  liquidity?: number;
  marketcap?: number;
  fdv?: number;
  rank?: number;
}

export interface BirdEyeTrendingPayload {
  tokens?: BirdEyeTrendingItem[];
  updateUnixTime?: number;
  total?: number;
}

// ---------- /defi/token_overview ----------------------------------------

export interface BirdEyeOverviewPayload {
  address: string;
  symbol?: string;
  name?: string;
  logoURI?: string;
  decimals?: number;
  price?: number;
  priceChange24hPercent?: number;
  v24hUSD?: number;
  liquidity?: number;
  mc?: number;
  realMc?: number;
  holder?: number;
  supply?: number;
  circulatingSupply?: number;
}

// ---------- /defi/v3/token/holder ---------------------------------------

export interface BirdEyeHolderItem {
  owner: string;
  amount?: string;
  ui_amount?: number;
  decimals?: number;
  mint?: string;
  token_account?: string;
  percentage?: number;
}

export interface BirdEyeHoldersPayload {
  items?: BirdEyeHolderItem[];
  total?: number;
}

// ---------- /defi/txs/token (recent trades) -----------------------------

export interface BirdEyeTradeSideAsset {
  symbol?: string;
  address?: string;
  amount?: number;
  uiAmount?: number;
  price?: number;
  nearestPrice?: number;
  changeAmount?: number;
  uiChangeAmount?: number;
}

export interface BirdEyeTradeItem {
  txHash: string;
  blockUnixTime: number;
  owner: string;
  source?: string;
  side?: "buy" | "sell";
  /** Typed at top level for v3 endpoints */
  txType?: "swap" | string;
  from?: BirdEyeTradeSideAsset;
  to?: BirdEyeTradeSideAsset;
  base?: BirdEyeTradeSideAsset;
  quote?: BirdEyeTradeSideAsset;
  volumeUSD?: number;
}

export interface BirdEyeTradesPayload {
  items?: BirdEyeTradeItem[];
  hasNext?: boolean;
}

// ---------- /defi/ohlcv -------------------------------------------------

export type BirdEyeOhlcvInterval =
  | "1m"
  | "3m"
  | "5m"
  | "15m"
  | "30m"
  | "1H"
  | "2H"
  | "4H"
  | "6H"
  | "8H"
  | "12H"
  | "1D"
  | "3D"
  | "1W"
  | "1M";

export interface BirdEyeCandleItem {
  unixTime: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v?: number;
}

export interface BirdEyeOhlcvPayload {
  items?: BirdEyeCandleItem[];
}
