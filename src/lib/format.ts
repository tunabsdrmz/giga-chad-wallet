/** Format a USD price, adapting precision for sub-cent memecoin prices. */
export function formatPrice(value: number): string {
  if (value === 0) return "$0";
  if (value >= 1) {
    return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  }
  if (value >= 0.01) {
    return `$${value.toFixed(4)}`;
  }
  // Show enough significant digits for very small prices.
  return `$${value.toPrecision(3)}`;
}

/**
 * Compact numeric formatting that's deterministic across runtimes.
 * Avoids `Intl.NumberFormat`'s compact notation, which can produce
 * slightly different output between Node SSR and the browser (different
 * ICU data) and trigger hydration warnings.
 */
function compactNumber(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}${(abs / 1e12).toFixed(1)}T`;
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(1)}K`;
  return `${sign}${abs.toFixed(0)}`;
}

/** Compact USD formatting, e.g. $1.7B, $96.3M, $28.4K. */
export function formatCompactUsd(value: number): string {
  return `$${compactNumber(value)}`;
}

/** Compact number formatting (no currency), e.g. 1.2M holders. */
export function formatCompact(value: number): string {
  return compactNumber(value);
}

/** Signed percent with two-decimal precision, e.g. +12.84% / -3.45%. */
export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/** Truncate a wallet/mint address to head…tail form. */
export function shortenAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 1) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}

/** Compact token amount, e.g. 12.3K SOL worth of units. */
export function formatAmount(value: number): string {
  if (value >= 1000) return formatCompact(value);
  if (value >= 1) return value.toFixed(2);
  return value.toPrecision(3);
}

/** Relative "time ago" label, e.g. now, 12s, 4m, 2h. */
export function formatAgo(timestamp: number, nowMs = Date.now()): string {
  const s = Math.max(0, Math.floor((nowMs - timestamp) / 1000));
  if (s < 3) return "now";
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
}
