"use client";

import { type ReactNode, useMemo } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import {
  PRIVY_APP_ID,
  PRIVY_LOGIN_METHODS,
  PRIVY_SOLANA_CLUSTER,
  isPrivyConfigured,
} from "@/lib/privy-config";
import { getSolanaRpc, getSolanaRpcSubscriptions } from "@/lib/solana/rpc";

/**
 * Wraps the app with the Privy SDK.
 *
 * If `NEXT_PUBLIC_PRIVY_APP_ID` is not set we render children directly so the
 * rest of the UI keeps working in mock/stub mode. Components that need auth
 * state should check `isPrivyConfigured` before calling `usePrivy`.
 */
export function PrivyProviders({ children }: { children: ReactNode }) {
  const solanaConfig = useMemo(
    () => ({
      rpcs: {
        [PRIVY_SOLANA_CLUSTER]: {
          rpc: getSolanaRpc(),
          rpcSubscriptions: getSolanaRpcSubscriptions(),
        },
      },
    }),
    [],
  );

  if (!isPrivyConfigured) {
    if (typeof window !== "undefined") {
      // Fire once per page load so it's obvious in dev that auth is stubbed.
      console.warn(
        "[Privy] NEXT_PUBLIC_PRIVY_APP_ID is not set. Auth is stubbed. " +
          "Drop your app id in .env.local to enable login.",
      );
    }
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: [...PRIVY_LOGIN_METHODS],
        appearance: {
          theme: "dark",
          accentColor: "#516af6",
          walletChainType: "solana-only",
          showWalletLoginFirst: false,
          logo: "/brand/logo-on-dark.png",
        },
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
        solana: solanaConfig,
      }}
    >
      {children}
    </PrivyProvider>
  );
}
