"use client";

import { useEffect, useState } from "react";
import type { Holder, Token } from "@/types/token";
import { TokenAvatar } from "@/components/token/TokenAvatar";
import { generateHolders } from "@/lib/mock/market";
import { formatCompactUsd, shortenAddress } from "@/lib/format";
import { cn } from "@/lib/utils";

export function HoldersTable({ token }: { token: Token }) {
  const [holders, setHolders] = useState<Holder[]>(() => generateHolders(token));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const url = `/api/birdeye/holders/${token.mint}?price=${token.price}&marketCap=${token.marketCap}`;
        const res = await fetch(url);
        if (cancelled || !res.ok) return;
        const json = (await res.json()) as { holders?: Holder[] };
        if (json.holders && json.holders.length > 0) setHolders(json.holders);
      } catch {
        // keep mock
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token.mint, token.price, token.marketCap]);

  const top = holders[0]?.percent ?? 0;

  return (
    <div className="text-sm">
      <div className="hidden grid-cols-[2.5rem_minmax(0,1fr)_5.5rem_6rem] gap-2 border-b border-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:grid">
        <span>#</span>
        <span>Holder</span>
        <span className="text-right">Share</span>
        <span className="text-right">Value</span>
      </div>

      <div className="divide-y divide-white/5">
        {holders.map((h) => (
          <div key={h.address}>
            <HolderRow holder={h} topPercent={top} />
          </div>
        ))}
      </div>
    </div>
  );
}

function HolderRow({ holder, topPercent }: { holder: Holder; topPercent: number }) {
  const barWidth = topPercent > 0 ? Math.min(100, (holder.percent / topPercent) * 100) : 0;

  return (
    <>
      {/* Mobile card */}
      <div className="px-3 py-3 md:hidden">
        <div className="flex items-center gap-2.5">
          <RankBadge rank={holder.rank} />
          <TokenAvatar mint={holder.address} symbol={holder.address.slice(0, 2)} size="xs" />
          <span className="min-w-0 flex-1 truncate font-mono text-xs">
            {shortenAddress(holder.address, 5)}
          </span>
          <span className="shrink-0 text-right font-medium tabular-nums">
            {holder.percent.toFixed(2)}%
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="h-1.5 flex-1 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary/70"
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {formatCompactUsd(holder.valueUsd)}
          </span>
        </div>
      </div>

      {/* Desktop row */}
      <div className="hidden items-center gap-2 px-3 py-1.5 hover:bg-white/4 md:grid md:grid-cols-[2.5rem_minmax(0,1fr)_5.5rem_6rem]">
        <RankBadge rank={holder.rank} />
        <span className="flex min-w-0 items-center gap-1.5 text-xs">
          <TokenAvatar mint={holder.address} symbol={holder.address.slice(0, 2)} size="xs" />
          <span className="truncate font-mono">{shortenAddress(holder.address, 5)}</span>
        </span>
        <span className="text-right">
          <span className="font-medium tabular-nums">{holder.percent.toFixed(2)}%</span>
          <div className="mt-0.5 h-1 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary/70"
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </span>
        <span className="text-right tabular-nums text-muted-foreground">
          {formatCompactUsd(holder.valueUsd)}
        </span>
      </div>
    </>
  );
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold",
        rank <= 3 ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
      )}
    >
      {rank}
    </span>
  );
}
