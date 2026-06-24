"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import type { Token } from "@/types/token";
import { TokenAvatar } from "@/components/token/TokenAvatar";
import { Input } from "@/components/ui/input";
import { formatPrice, formatPercent, formatCompactUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TrendingList({
  tokens,
  activeMint,
}: {
  tokens: Token[];
  activeMint: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tokens;
    return tokens.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q),
    );
  }, [tokens, query]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="sticky top-0 z-10 border-b border-white/8 bg-card/80 px-3 py-2 backdrop-blur">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Trending</h2>
          <span className="text-xs text-muted-foreground">24h vol</span>
        </div>
        <div className="relative">
          <Search
            size={12}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search tokens"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 pl-7 text-xs"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            No tokens match &ldquo;{query}&rdquo;
          </p>
        ) : (
          filtered.map((token) => (
            <TrendingRow
              key={token.mint}
              token={token}
              active={token.mint === activeMint}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TrendingRow({ token, active }: { token: Token; active: boolean }) {
  const up = token.change24h >= 0;
  return (
    <Link
      href={`/trade/${token.mint}`}
      className={cn(
        "flex items-center gap-2.5 border-l-2 px-3 py-2 transition-colors",
        active
          ? "border-primary bg-primary/10"
          : "border-transparent hover:bg-white/4",
      )}
    >
      <TokenAvatar
        mint={token.mint}
        symbol={token.symbol}
        logoUrl={token.logoUrl}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold leading-tight">
          {token.symbol}
        </div>
        <div className="text-[11px] text-muted-foreground">
          {formatCompactUsd(token.volume24h)}
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs">{formatPrice(token.price)}</div>
        <div
          className={cn(
            "flex items-center justify-end gap-0.5 text-[11px] font-medium",
            up ? "text-up" : "text-down",
          )}
        >
          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {formatPercent(token.change24h)}
        </div>
      </div>
    </Link>
  );
}
