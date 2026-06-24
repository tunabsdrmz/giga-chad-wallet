"use client";

import { address, createSolanaRpc, lamports as toLamports } from "@solana/kit";
import { PRIVY_NETWORK, PRIVY_RPC_URLS } from "@/lib/privy-config";

/**
 * Request a devnet SOL airdrop for an address. Returns the
 * transaction signature once the public faucet accepts it.
 *
 * Always uses the public `api.devnet.solana.com` RPC for the airdrop
 * call because most paid providers (Alchemy included) disable the
 * `requestAirdrop` method to prevent abuse. We don't await
 * confirmation here — the caller can poll `getSolBalance` until the
 * new balance appears (usually within a few seconds).
 */
export async function requestSolAirdrop(
  walletAddress: string,
  amountSol = 1,
): Promise<string> {
  if (PRIVY_NETWORK !== "devnet") {
    throw new Error("Airdrops are only available on Devnet.");
  }
  const rpc = createSolanaRpc(PRIVY_RPC_URLS.devnet.http);
  const pubkey = address(walletAddress);
  const lamports = toLamports(BigInt(Math.round(amountSol * 1_000_000_000)));
  return rpc.requestAirdrop(pubkey, lamports).send();
}
