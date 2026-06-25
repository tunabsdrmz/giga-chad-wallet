"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import { PERIODS } from "@/lib/leaderboard";
import type { Period } from "@/lib/supabase/types";
import { TokenAvatar } from "@/components/token/TokenAvatar";
import { TrendingList } from "@/components/trade/TrendingList";
import { useTradeMintNav } from "@/components/trade/TradeMintNav";
import { formatCompactUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Token } from "@/types/token";

type LeftPanel = "trade" | "leaderboard";

const PANEL_TABS: { id: LeftPanel; label: string }[] = [
  { id: "trade", label: "Trade" },
  { id: "leaderboard", label: "Leaderboard" },
];

function traderHandle(name: string): string {
  const trimmed = name.trim();
  if (trimmed.startsWith("@")) return trimmed;
  if (trimmed.includes(".")) return `@${trimmed}`;
  return `@${trimmed.toLowerCase().replace(/\s+/g, "")}`;
}

function TradeLeaderboardPeriodSwitcher({ active }: { active: Period }) {
  const router = useRouter();
  const pathname = usePathname();
  const nav = useTradeMintNav();
  const search = useSearchParams();
  const [pending, startTransition] = useTransition();

  const setPeriod = (next: Period) => {
    const params = new URLSearchParams(search?.toString() ?? "");
    if (next === "30d") params.delete("period");
    else params.set("period", next);
    const qs = params.toString();
    // Client mint switches use replaceState — Next pathname stays stale until
    // we build the path from the active mint in TradeMintNav.
    const tradePath = nav?.activeMint
      ? `/trade/${nav.activeMint}`
      : pathname;
    startTransition(() => {
      router.replace(qs ? `${tradePath}?${qs}` : tradePath, { scroll: false });
    });
  };

  return (
    <div
      role="tablist"
      aria-label="Leaderboard time window"
      className={cn(
        "flex gap-0.5 overflow-x-auto rounded-lg border border-[var(--trade-border)] bg-black/20 p-0.5",
        "scrollbar-none",
        pending && "opacity-70",
      )}>
      {PERIODS.map((p) => {
        const isActive = p.id === active;
        return (
          <button
            key={p.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            disabled={pending}
            onClick={() => setPeriod(p.id)}
            className={cn(
              "shrink-0 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}>
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

function LeaderboardSidebarRow({ entry }: { entry: LeaderboardEntry }) {
  const up = entry.totalPnlUsd >= 0;

  return (
    <div className="flex w-full min-w-0 items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-white/4">
      <span className="w-5 shrink-0 text-center text-xs font-medium tabular-nums text-muted-foreground">
        {entry.rank}
      </span>
      <TokenAvatar
        mint={`trader:${entry.rank}:${entry.displayName}`}
        symbol={entry.displayName.slice(0, 2).toUpperCase()}
        logoUrl={entry.avatarUrl ?? undefined}
        size="sm"
        className="shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight">
          {entry.displayName}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">
          {traderHandle(entry.displayName)}
        </p>
      </div>
      <span
        className={cn(
          "flex shrink-0 items-center gap-0.5 text-xs font-semibold tabular-nums",
          up ? "text-up" : "text-down",
        )}>
        {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {formatCompactUsd(entry.totalPnlUsd)}
      </span>
    </div>
  );
}

/** fomo-style left rail — Trade (tokens) vs Leaderboard tabs. */
export function TradeLeftSidebar({
  tokens,
  activeMint,
  leaderboard,
  leaderboardPeriod,
}: {
  tokens: Token[];
  activeMint: string;
  leaderboard: LeaderboardEntry[];
  leaderboardPeriod: Period;
}) {
  const [panel, setPanel] = useState<LeftPanel>("trade");

  return (
    <div className="flex h-full w-full flex-col">
      <div className="trade-panel-header shrink-0 border-b px-3 pt-2.5 backdrop-blur">
        <div
          role="tablist"
          aria-label="Left sidebar"
          className="trade-left-tabs flex gap-4 border-b border-[var(--trade-border)]">
          {PANEL_TABS.map((tab) => {
            const active = panel === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setPanel(tab.id)}
                className={cn(
                  "trade-left-tab pb-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}>
                {tab.label}
              </button>
            );
          })}
        </div>

        {panel === "leaderboard" && (
          <div className="flex items-center justify-between gap-2 py-2.5">
            <TradeLeaderboardPeriodSwitcher active={leaderboardPeriod} />
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {panel === "trade" ? (
          <TrendingList
            tokens={tokens}
            activeMint={activeMint}
          />
        ) : (
          <div className="h-full overflow-y-auto">
            {leaderboard.length === 0 ? (
              <p className="px-3 py-8 text-center text-xs text-muted-foreground">
                No traders in this window yet.
              </p>
            ) : (
              leaderboard.map((entry) => (
                <LeaderboardSidebarRow
                  key={`${entry.rank}-${entry.displayName}`}
                  entry={entry}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
