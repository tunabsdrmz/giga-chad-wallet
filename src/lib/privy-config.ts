/**
 * Central Privy configuration.
 *
 * The whole app reads from this file so we have a single switch to flip when
 * we go from "no keys / stubbed UI" → "real auth" — just drop the app id into
 * `.env.local` and everything else lights up.
 */

export type SolanaNetwork = "devnet" | "mainnet-beta";

// Widened to SolanaNetwork so callers can branch on the value at runtime.
export const PRIVY_NETWORK = "devnet" as SolanaNetwork;

export const PRIVY_RPC_URLS: Record<SolanaNetwork, { http: string; ws: string }> = {
  devnet: {
    http: "https://api.devnet.solana.com",
    ws: "wss://api.devnet.solana.com",
  },
  "mainnet-beta": {
    http: "https://api.mainnet-beta.solana.com",
    ws: "wss://api.mainnet-beta.solana.com",
  },
};

export const PRIVY_APP_ID: string =
  process.env.NEXT_PUBLIC_PRIVY_APP_ID?.trim() ?? "";

export const isPrivyConfigured: boolean = PRIVY_APP_ID.length > 0;

// Cluster string the Privy SDK expects in `solana.rpcs`.
export const PRIVY_SOLANA_CLUSTER = `solana:${PRIVY_NETWORK}` as const;

// Login methods enabled on the modal. Order = display order.
export const PRIVY_LOGIN_METHODS = ["google", "email"] as const;

export const SOLSCAN_BASE =
  PRIVY_NETWORK === "mainnet-beta"
    ? "https://solscan.io"
    : "https://solscan.io/?cluster=devnet";

export function solscanAddressUrl(address: string): string {
  if (PRIVY_NETWORK === "mainnet-beta") {
    return `https://solscan.io/account/${address}`;
  }
  return `https://solscan.io/account/${address}?cluster=devnet`;
}

export function shortenAddress(address: string, head = 4, tail = 4): string {
  if (address.length <= head + tail + 1) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}
