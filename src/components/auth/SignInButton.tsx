"use client";

import { Menu } from "@base-ui/react/menu";
import { usePrivy } from "@privy-io/react-auth";
import { useWallets as useSolanaWallets } from "@privy-io/react-auth/solana";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isPrivyConfigured, shortenAddress } from "@/lib/privy-config";
import { useSolBalance } from "@/lib/use-sol-balance";
import { WalletMenuContent } from "@/components/auth/WalletMenuContent";

/**
 * Sign-in button for the navbar.
 *
 * - No app id configured → disabled "Configure Privy" stub.
 * - Logged out          → "Sign in" button that opens the Privy modal.
 * - Logged in           → SOL balance + shortened address, dropdown
 *                         with copy, view, airdrop, sign out.
 */
export function SignInButton({ className }: { className?: string }) {
  if (!isPrivyConfigured) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={cn("opacity-70", className)}>
        Configure Privy
      </Button>
    );
  }
  return <ActiveSignInButton className={className} />;
}

function ActiveSignInButton({ className }: { className?: string }) {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useSolanaWallets();
  const address = wallets[0]?.address;
  const { sol } = useSolBalance(address ?? null);

  if (!ready) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={className}>
        Loading…
      </Button>
    );
  }

  if (!authenticated || !address) {
    return (
      <Button
        size="lg"
        className={className}
        onClick={() => login()}>
        Sign in
      </Button>
    );
  }

  const balanceLabel = sol === null ? "—" : sol.toFixed(2);

  return (
    <Menu.Root>
      <Menu.Trigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn("gap-2", className)}>
            <span className="text-primary">◎ {balanceLabel}</span>
            <span className="hidden text-muted-foreground sm:inline">·</span>
            <span className="font-mono text-xs">{shortenAddress(address)}</span>
          </Button>
        }
      />
      <Menu.Portal>
        <Menu.Positioner
          sideOffset={8}
          align="end">
          <WalletMenuContent
            address={address}
            onLogout={() => logout()}
          />
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
