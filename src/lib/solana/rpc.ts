"use client";

import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  devnet,
  mainnet,
} from "@solana/kit";
import { PRIVY_NETWORK, PRIVY_RPC_URLS, type SolanaNetwork } from "@/lib/privy-config";

const ALCHEMY_URL = process.env.NEXT_PUBLIC_ALCHEMY_SOLANA_DEVNET_URL?.trim() ?? "";

/** True when an Alchemy Solana RPC URL has been configured. */
export const isAlchemyConfigured: boolean = ALCHEMY_URL.length > 0;

/**
 * Returns the active HTTP RPC URL. Alchemy when configured (and we're
 * on Devnet), otherwise the public cluster endpoint as a fallback.
 */
export function getSolanaRpcUrl(network: SolanaNetwork = PRIVY_NETWORK): string {
  if (network === "devnet" && isAlchemyConfigured) return ALCHEMY_URL;
  return PRIVY_RPC_URLS[network].http;
}

/** Companion WebSocket URL derived from `getSolanaRpcUrl`. */
export function getSolanaRpcWsUrl(network: SolanaNetwork = PRIVY_NETWORK): string {
  const http = getSolanaRpcUrl(network);
  if (http.startsWith("https://")) return "wss://" + http.slice("https://".length);
  if (http.startsWith("http://")) return "ws://" + http.slice("http://".length);
  return PRIVY_RPC_URLS[network].ws;
}

// The app currently only targets devnet. We brand the URL as such so
// the resulting client exposes test-cluster methods like
// `requestAirdrop` (and Privy's `rpcs` config accepts it).
function makeRpc() {
  return createSolanaRpc(devnet(getSolanaRpcUrl("devnet")));
}

function makeSubs() {
  return createSolanaRpcSubscriptions(devnet(getSolanaRpcWsUrl("devnet")));
}

let cachedRpc: ReturnType<typeof makeRpc> = makeRpc();
let cachedRpcUrl: string = getSolanaRpcUrl("devnet");
let cachedSubs: ReturnType<typeof makeSubs> = makeSubs();
let cachedSubsUrl: string = getSolanaRpcWsUrl("devnet");

/** Lazily-instantiated singleton HTTP RPC client. */
export function getSolanaRpc() {
  const url = getSolanaRpcUrl("devnet");
  if (cachedRpcUrl !== url) {
    cachedRpc = makeRpc();
    cachedRpcUrl = url;
  }
  return cachedRpc;
}

/** Lazily-instantiated singleton WebSocket RPC subscriptions client. */
export function getSolanaRpcSubscriptions() {
  const url = getSolanaRpcWsUrl("devnet");
  if (cachedSubsUrl !== url) {
    cachedSubs = makeSubs();
    cachedSubsUrl = url;
  }
  return cachedSubs;
}

// `mainnet` is kept in the import list so callers can extend the file
// to support mainnet later without a TS shake.
void mainnet;
