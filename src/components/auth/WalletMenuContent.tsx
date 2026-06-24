"use client";

import { useState } from "react";
import { Menu } from "@base-ui/react/menu";
import { Coins, Copy, ExternalLink, LogOut, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSolBalance } from "@/lib/use-sol-balance";
import { requestSolAirdrop } from "@/lib/solana/airdrop";
import { PRIVY_NETWORK, solscanAddressUrl } from "@/lib/privy-config";

type Status = { kind: "idle" | "loading" | "success" | "error"; message?: string };

/**
 * Dropdown content rendered inside the wallet button's popup. Owns
 * everything that depends on the connected wallet — balance polling,
 * copy-to-clipboard, devnet faucet, sign-out.
 */
export function WalletMenuContent({
  address,
  onLogout,
}: {
  address: string;
  onLogout: () => void;
}) {
  const { sol, loading, refresh } = useSolBalance(address);
  const [copied, setCopied] = useState(false);
  const [airdrop, setAirdrop] = useState<Status>({ kind: "idle" });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — fail silently
    }
  };

  const handleAirdrop = async () => {
    setAirdrop({ kind: "loading", message: "Requesting…" });
    try {
      const sig = await requestSolAirdrop(address, 1);
      setAirdrop({ kind: "success", message: "1 SOL queued — refreshing balance…" });
      // Faucet can take a few seconds to land. Poll a few times.
      let tries = 0;
      const poll = setInterval(() => {
        refresh();
        tries += 1;
        if (tries >= 4) clearInterval(poll);
      }, 2500);
      setTimeout(() => setAirdrop({ kind: "idle" }), 6000);
      console.info("[airdrop] sig:", sig);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setAirdrop({ kind: "error", message: short(message) });
      setTimeout(() => setAirdrop({ kind: "idle" }), 5000);
    }
  };

  return (
    <Menu.Popup
      className={cn(
        "min-w-[230px] rounded-lg border border-white/10 bg-background/95",
        "p-1 text-sm shadow-xl backdrop-blur-md",
      )}
    >
      <div className="px-2 pt-2 pb-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Balance
          </span>
          <span
            className={cn(
              "rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              PRIVY_NETWORK === "devnet"
                ? "border-primary/40 text-primary"
                : "border-white/15 text-muted-foreground",
            )}
          >
            {PRIVY_NETWORK === "devnet" ? "Devnet" : "Mainnet"}
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-lg font-semibold tabular-nums">
            {loading || sol === null ? "—" : sol.toFixed(4)}
          </span>
          <span className="text-xs text-muted-foreground">SOL</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              refresh();
            }}
            aria-label="Refresh balance"
            className={cn(
              "ml-auto text-muted-foreground hover:text-foreground",
              loading && "animate-spin text-foreground",
            )}
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      <div className="my-1 h-px bg-white/8" />

      <Menu.Item
        onClick={handleCopy}
        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 outline-none data-highlighted:bg-muted"
      >
        <Copy size={14} className="text-muted-foreground" />
        {copied ? "Copied!" : "Copy address"}
      </Menu.Item>
      <Menu.Item
        render={
          <a
            href={solscanAddressUrl(address)}
            target="_blank"
            rel="noreferrer noopener"
          />
        }
        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 outline-none data-highlighted:bg-muted"
      >
        <ExternalLink size={14} className="text-muted-foreground" />
        View on Solscan
      </Menu.Item>

      {PRIVY_NETWORK === "devnet" && (
        <Menu.Item
          onClick={(e) => {
            e.preventDefault();
            void handleAirdrop();
          }}
          disabled={airdrop.kind === "loading"}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 outline-none",
            "data-highlighted:bg-muted disabled:opacity-60",
          )}
        >
          <Coins size={14} className="text-primary" />
          {airdrop.kind === "loading"
            ? "Requesting 1 SOL…"
            : airdrop.kind === "success"
              ? "Sent — check balance soon"
              : airdrop.kind === "error"
                ? `Airdrop failed: ${airdrop.message}`
                : "Get 1 devnet SOL"}
        </Menu.Item>
      )}

      <div className="my-1 h-px bg-white/8" />

      <Menu.Item
        onClick={onLogout}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-down outline-none",
          "data-highlighted:bg-down/10",
        )}
      >
        <LogOut size={14} />
        Sign out
      </Menu.Item>
    </Menu.Popup>
  );
}

function short(message: string): string {
  return message.length > 40 ? message.slice(0, 37) + "…" : message;
}
