import type { ReactNode } from "react";
import { Crown, Medal, Trophy, TrendingDown, TrendingUp } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import { TokenAvatar } from "@/components/token/TokenAvatar";
import { formatCompactUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const TROPHY: Record<number, { icon: ReactNode; ring: string; tint: string }> = {
  1: {
    icon: <Crown size={16} className="text-yellow-300" />,
    ring: "ring-yellow-300/50",
    tint: "bg-yellow-300/10",
  },
  2: {
    icon: <Trophy size={16} className="text-slate-200" />,
    ring: "ring-slate-200/40",
    tint: "bg-slate-200/8",
  },
  3: {
    icon: <Medal size={16} className="text-amber-500" />,
    ring: "ring-amber-500/40",
    tint: "bg-amber-500/8",
  },
};

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-card/30 p-8 text-center text-sm text-muted-foreground sm:p-12">
        No traders in this window yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/8 bg-card/30">
      <div className="hidden border-b border-white/8 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:grid md:grid-cols-[3.5rem_minmax(0,1fr)_7.5rem_5.5rem_4.5rem] md:gap-3 md:px-5 lg:grid-cols-[3.5rem_minmax(0,1fr)_8rem_6rem_5rem] lg:gap-4">
        <span>Rank</span>
        <span>Trader</span>
        <span className="text-right">PnL (USD)</span>
        <span className="text-right">Win rate</span>
        <span className="text-right">Trades</span>
      </div>

      <ul className="divide-y divide-white/5">
        {entries.map((entry) => (
          <LeaderboardRow key={`${entry.rank}-${entry.displayName}`} entry={entry} />
        ))}
      </ul>
    </div>
  );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const trophy = TROPHY[entry.rank];
  const up = entry.totalPnlUsd >= 0;

  return (
    <li
      className={cn(
        "transition-colors hover:bg-white/4",
        trophy && trophy.tint,
      )}
    >
      {/* Mobile / tablet card */}
      <div className="flex flex-col gap-3 px-4 py-4 md:hidden">
        <div className="flex items-center gap-3">
          <RankBadge rank={entry.rank} trophy={trophy} />
          <TokenAvatar
            mint={entry.displayName}
            symbol={entry.displayName.slice(0, 2).toUpperCase()}
            size="md"
            className={cn("shrink-0 ring-2 ring-transparent", trophy?.ring)}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{entry.displayName}</p>
            <PnlValue up={up} value={entry.totalPnlUsd} className="mt-0.5 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-lg border border-white/5 bg-black/10 px-3 py-2 text-sm">
          <MobileStat label="Win rate" value={`${entry.winRate.toFixed(1)}%`} />
          <MobileStat
            label="Trades"
            value={entry.tradesCount.toLocaleString("en-US")}
            align="right"
          />
        </div>
      </div>

      {/* Desktop table row */}
      <div
        className={cn(
          "hidden items-center gap-3 px-5 py-3 md:grid",
          "md:grid-cols-[3.5rem_minmax(0,1fr)_7.5rem_5.5rem_4.5rem]",
          "lg:grid-cols-[3.5rem_minmax(0,1fr)_8rem_6rem_5rem] lg:gap-4",
        )}
      >
        <RankBadge rank={entry.rank} trophy={trophy} />
        <span className="flex min-w-0 items-center gap-3">
          <TokenAvatar
            mint={entry.displayName}
            symbol={entry.displayName.slice(0, 2).toUpperCase()}
            size="md"
            className={cn("shrink-0 ring-2 ring-transparent", trophy?.ring)}
          />
          <span className="truncate font-medium">{entry.displayName}</span>
        </span>
        <PnlValue up={up} value={entry.totalPnlUsd} className="justify-end text-right" />
        <span className="text-right tabular-nums">{entry.winRate.toFixed(1)}%</span>
        <span className="text-right tabular-nums text-muted-foreground">
          {entry.tradesCount.toLocaleString("en-US")}
        </span>
      </div>
    </li>
  );
}

function RankBadge({
  rank,
  trophy,
}: {
  rank: number;
  trophy?: (typeof TROPHY)[number];
}) {
  return (
    <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold">
      {trophy?.icon}
      <span className={cn(trophy ? "text-foreground" : "text-muted-foreground")}>
        #{rank}
      </span>
    </span>
  );
}

function PnlValue({
  up,
  value,
  className,
}: {
  up: boolean;
  value: number;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-1 tabular-nums", className)}>
      {up ? (
        <TrendingUp size={14} className="shrink-0 text-up" />
      ) : (
        <TrendingDown size={14} className="shrink-0 text-down" />
      )}
      <span className={cn("font-semibold", up ? "text-up" : "text-down")}>
        {formatCompactUsd(value)}
      </span>
    </span>
  );
}

function MobileStat({
  label,
  value,
  align = "left",
}: {
  label: string;
  value: string;
  align?: "left" | "right";
}) {
  return (
    <div className={cn(align === "right" && "text-right")}>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium tabular-nums">{value}</p>
    </div>
  );
}
