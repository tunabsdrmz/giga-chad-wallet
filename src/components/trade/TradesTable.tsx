"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { Token, Trade } from "@/types/token";
import { TokenAvatar } from "@/components/token/TokenAvatar";
import { generateTrades, randomTrade } from "@/lib/mock/market";
import { formatCompactUsd, formatAmount, formatAgo, shortenAddress } from "@/lib/format";
import { cn } from "@/lib/utils";

const MAX_ROWS = 30;
const POLL_INTERVAL_MS = 8_000;

export function TradesTable({ token }: { token: Token }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [now, setNow] = useState<number>(0);
  const [usingMock, setUsingMock] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTrades(generateTrades(token));
    setNow(Date.now());

    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(`/api/birdeye/trades/${token.mint}?limit=${MAX_ROWS}`);
        if (!res.ok) {
          if (!cancelled && res.status === 503) setUsingMock(true);
          return;
        }
        const json = (await res.json()) as { trades?: Trade[] };
        if (cancelled || !json.trades) return;
        setUsingMock(false);
        setTrades(json.trades.slice(0, MAX_ROWS));
        setNow(Date.now());
      } catch {
        // keep last known trades
      }
    };

    void poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    const tick = setInterval(() => setNow(Date.now()), 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearInterval(tick);
    };
  }, [token]);

  useEffect(() => {
    if (!usingMock) return;
    const id = setInterval(() => {
      setTrades((prev) => [randomTrade(token), ...prev].slice(0, MAX_ROWS));
    }, 3000);
    return () => clearInterval(id);
  }, [usingMock, token]);

  return (
    <div className="text-sm">
      <div className="hidden grid-cols-[4.5rem_minmax(0,1fr)_5.5rem_4.5rem_3.5rem] gap-2 border-b border-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:grid">
        <span>Side</span>
        <span>Trader</span>
        <span className="text-right">Value</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Age</span>
      </div>

      <div className="divide-y divide-white/5">
        {trades.map((t) => (
          <div key={t.id}>
            <TradeRow trade={t} now={now} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TradeRow({ trade, now }: { trade: Trade; now: number }) {
  const isBuy = trade.side === "buy";

  return (
    <>
      {/* Mobile card */}
      <div
        className={cn(
          "flex items-center justify-between gap-3 px-3 py-3 md:hidden",
          "border-l-2 border-transparent",
          isBuy ? "border-l-up/30" : "border-l-down/30",
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <SideBadge side={trade.side} />
          <TokenAvatar mint={trade.trader} symbol={trade.trader.slice(0, 2)} size="xs" />
          <span className="truncate font-mono text-xs text-muted-foreground">
            {shortenAddress(trade.trader, 4)}
          </span>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-medium tabular-nums">{formatCompactUsd(trade.valueUsd)}</div>
          <div className="text-[11px] text-muted-foreground">
            {formatAmount(trade.amount)} · {formatAgo(trade.timestamp, now)}
          </div>
        </div>
      </div>

      {/* Desktop row */}
      <div
        className={cn(
          "hidden items-center gap-2 px-3 py-1.5 md:grid",
          "md:grid-cols-[4.5rem_minmax(0,1fr)_5.5rem_4.5rem_3.5rem]",
          "border-l-2 border-transparent transition-colors hover:bg-white/4",
          isBuy ? "hover:border-up/40" : "hover:border-down/40",
        )}
      >
        <SideBadge side={trade.side} />
        <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <TokenAvatar mint={trade.trader} symbol={trade.trader.slice(0, 2)} size="xs" />
          <span className="truncate font-mono">{shortenAddress(trade.trader, 4)}</span>
        </span>
        <span className="text-right tabular-nums">{formatCompactUsd(trade.valueUsd)}</span>
        <span className="text-right tabular-nums text-muted-foreground">
          {formatAmount(trade.amount)}
        </span>
        <span className="text-right text-muted-foreground">
          {formatAgo(trade.timestamp, now)}
        </span>
      </div>
    </>
  );
}

function SideBadge({ side }: { side: Trade["side"] }) {
  const isBuy = side === "buy";
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold uppercase",
        isBuy ? "bg-up/15 text-up" : "bg-down/15 text-down",
      )}
    >
      {isBuy ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
      {side}
    </span>
  );
}
