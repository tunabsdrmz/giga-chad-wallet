"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { Token } from "@/types/token";
import { Button } from "@/components/ui/button";
import type { PositionState } from "@/lib/use-position";
import { useSyncedUser } from "@/lib/use-synced-user";
import { useMockBalance } from "@/lib/use-mock-balance";
import { formatPrice, formatCompactUsd, formatAmount, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function PositionCard({
  token,
  position: { position, loading, submitting, closePosition },
}: {
  token: Token;
  position: PositionState;
}) {
  const { did } = useSyncedUser();
  const { credit } = useMockBalance(did);

  const handleClose = async () => {
    if (!position || position.amount <= 0) return;
    const proceeds = position.amount * token.price;
    const ok = await closePosition();
    if (ok) credit(proceeds);
  };

  if (loading) {
    return (
      <div className="border-t border-white/8 p-4">
        <h3 className="mb-2 text-sm font-semibold">Your position</h3>
        <p className="text-xs text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const isEmpty = !position || position.amount <= 0;

  if (isEmpty) {
    return (
      <div className="border-t border-white/8 p-4">
        <h3 className="mb-2 text-sm font-semibold">Your position</h3>
        <p className="text-xs text-muted-foreground">
          No position in {token.symbol} yet.
        </p>
      </div>
    );
  }

  const pos = position;
  const up = pos.pnlUsd >= 0;

  return (
    <div className="border-t border-white/8 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Your position</h3>
        <PnlChip percent={pos.pnlPercent} up={up} />
      </div>

      <div className="space-y-2">
        <Row label="Holding" value={`${formatAmount(pos.amount)} ${token.symbol}`} />
        <Row label="Value" value={formatCompactUsd(pos.valueUsd)} />
        <Row label="Avg. entry" value={formatPrice(pos.avgPrice)} />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Unrealized PnL</span>
          <span className={cn("font-semibold", up ? "text-up" : "text-down")}>
            {up ? "+" : ""}
            {formatCompactUsd(pos.pnlUsd)}
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="mt-4 h-9 w-full text-xs font-semibold"
        disabled={submitting}
        onClick={() => {
          void handleClose();
        }}
      >
        {submitting ? "Closing…" : "Close position"}
      </Button>
    </div>
  );
}

function PnlChip({ percent, up }: { percent: number; up: boolean }) {
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        up ? "bg-up/15 text-up" : "bg-down/15 text-down",
      )}
    >
      <Icon size={12} />
      {up ? "+" : ""}
      {formatPercent(percent)}
    </span>
  );
}
