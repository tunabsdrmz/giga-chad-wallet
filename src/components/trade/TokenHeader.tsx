"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, ExternalLink, Star } from "lucide-react";
import type { Token } from "@/types/token";
import { TokenAvatar } from "@/components/token/TokenAvatar";
import { Sparkline } from "@/components/token/Sparkline";
import { Button } from "@/components/ui/button";
import {
  formatPrice,
  formatPercent,
  formatCompactUsd,
  formatCompact,
  shortenAddress,
} from "@/lib/format";
import { generateCandles } from "@/lib/mock/market";
import { useWatchlist } from "@/lib/use-watchlist";
import { solscanAddressUrl } from "@/lib/privy-config";
import { cn } from "@/lib/utils";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-black/10 px-3 py-2 sm:border-0 sm:bg-transparent sm:p-0">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground sm:text-[11px]">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums sm:mt-0">{value}</div>
    </div>
  );
}

export function TokenHeader({ token }: { token: Token }) {
  const up = token.change24h >= 0;

  return (
    <div className="border-b border-[var(--trade-border)] p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-start gap-3">
          <TokenAvatar
            mint={token.mint}
            symbol={token.symbol}
            logoUrl={token.logoUrl}
            size="lg"
            className="shrink-0"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <h1 className="text-lg font-bold sm:text-xl">{token.symbol}</h1>
              <span className="truncate text-sm text-muted-foreground">{token.name}</span>
            </div>
            <AddressRow mint={token.mint} />
          </div>

          <WatchlistToggle mint={token.mint} symbol={token.symbol} />
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-2xl font-bold tabular-nums sm:text-3xl">
              {formatPrice(token.price)}
            </div>
            <div className={cn("text-sm font-medium", up ? "text-up" : "text-down")}>
              {formatPercent(token.change24h)} · 24h
            </div>
          </div>
          <PriceSparkline token={token} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-4 sm:gap-3">
        <Stat label="Market Cap" value={formatCompactUsd(token.marketCap)} />
        <Stat label="24h Volume" value={formatCompactUsd(token.volume24h)} />
        <Stat
          label="Liquidity"
          value={token.liquidity ? formatCompactUsd(token.liquidity) : "—"}
        />
        <HolderStat key={token.mint} mint={token.mint} initial={token.holders} />
      </div>
    </div>
  );
}

function HolderStat({ mint, initial }: { mint: string; initial: number }) {
  if (initial > 0) {
    return <Stat label="Holders" value={formatCompact(initial)} />;
  }
  return <FetchedHolderStat mint={mint} />;
}

function FetchedHolderStat({ mint }: { mint: string }) {
  const [holders, setHolders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/birdeye/overview/${mint}`);
        if (cancelled || !res.ok) return;
        const data = (await res.json()) as { holders?: number };
        if (typeof data.holders === "number" && data.holders > 0) {
          setHolders(data.holders);
        }
      } catch {
        // keep 0
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mint]);

  const value = loading ? "—" : formatCompact(holders);
  return <Stat label="Holders" value={value} />;
}

function AddressRow({ mint }: { mint: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mint);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore — clipboard may be blocked
    }
  };
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:mt-0.5 sm:gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:bg-white/5 hover:text-foreground"
        aria-label="Copy mint address"
      >
        {shortenAddress(mint, 5)}
        {copied ? <Check size={11} className="text-up" /> : <Copy size={11} />}
      </button>
      <a
        href={solscanAddressUrl(mint)}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:bg-white/5 hover:text-foreground"
      >
        Solscan <ExternalLink size={11} />
      </a>
    </div>
  );
}

function PriceSparkline({ token }: { token: Token }) {
  const values = useMemo(
    () => generateCandles(token, 24, 3600).map((c) => c.close),
    [token],
  );
  return (
    <div className="hidden shrink-0 xs:block">
      <Sparkline
        values={values}
        width={84}
        height={32}
        direction={token.change24h >= 0 ? "up" : "down"}
      />
    </div>
  );
}

function WatchlistToggle({ mint, symbol }: { mint: string; symbol: string }) {
  const { has, toggle, mounted } = useWatchlist();
  const active = mounted && has(mint);
  return (
    <Button
      variant="ghost"
      size="icon"
      className="shrink-0"
      aria-label={active ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
      onClick={() => toggle(mint)}
    >
      <Star size={18} className={cn(active && "fill-primary text-primary")} />
    </Button>
  );
}
