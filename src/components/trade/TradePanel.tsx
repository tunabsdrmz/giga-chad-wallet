"use client";

import { useState } from "react";
import { ChevronDown, Settings2 } from "lucide-react";
import type { Token, TradeSide } from "@/types/token";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, formatAmount, formatCompactUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PositionState } from "@/lib/use-position";
import { useSyncedUser } from "@/lib/use-synced-user";
import { useMockBalance } from "@/lib/use-mock-balance";
import { calcBuyPosition, calcSellPlan } from "@/lib/mock-trade";

const USD_PRESETS = [25, 100, 500];
const PERCENT_PRESETS = [25, 50, 100];

export function TradePanel({
  token,
  position: positionState,
}: {
  token: Token;
  position: PositionState;
}) {
  const { did } = useSyncedUser();
  const { balance, debit, credit } = useMockBalance(did);
  const { position, loading, submitting, openPosition, closePosition } =
    positionState;

  const [side, setSide] = useState<TradeSide>("buy");
  const [amount, setAmount] = useState<string>("100");
  const [slippage, setSlippage] = useState<number>(0.5);
  const [slippageOpen, setSlippageOpen] = useState<boolean>(false);
  const [tradeError, setTradeError] = useState<string | null>(null);

  const usd = Number(amount) || 0;
  const isBuy = side === "buy";
  const holdingUsd = (position?.amount ?? 0) * token.price;
  const estTokens = isBuy
    ? usd / token.price
    : Math.min(usd / token.price, position?.amount ?? 0);

  const handlePercent = (p: number) => {
    const base = isBuy ? balance : holdingUsd;
    setAmount(String(Math.round((base * p) / 100)));
  };

  const handleTrade = async () => {
    setTradeError(null);
    if (usd <= 0) {
      setTradeError("Enter an amount greater than zero.");
      return;
    }
    if (loading || submitting) return;

    if (isBuy) {
      if (usd > balance) {
        setTradeError("Insufficient demo USDC balance.");
        return;
      }
      const next = calcBuyPosition(position, usd, token.price);
      if (!next) return;
      if (!debit(usd)) {
        setTradeError("Insufficient demo USDC balance.");
        return;
      }
      const ok = await openPosition(next.amount, next.avgPrice);
      if (!ok) {
        credit(usd);
        setTradeError("Could not save position. Try again.");
      }
      return;
    }

    const plan = calcSellPlan(position, usd, token.price);
    if (!plan) {
      setTradeError(
        position && position.amount > 0
          ? "Enter a valid sell amount."
          : "No position to sell.",
      );
      return;
    }

    const ok = plan.close
      ? await closePosition()
      : await openPosition(plan.remainingAmount, position!.avgPrice);
    if (!ok) {
      setTradeError("Could not update position. Try again.");
      return;
    }
    credit(plan.proceedsUsd);
  };

  const ctaDisabled = loading || submitting || usd <= 0;

  return (
    <div className="p-4">
      <SideTabs side={side} setSide={setSide} />

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Demo USDC</span>
        <span className="font-medium">{formatCompactUsd(balance)}</span>
      </div>

      <label className="mt-4 block text-xs text-muted-foreground">
        Amount (USD)
      </label>
      <Input
        type="number"
        inputMode="decimal"
        value={amount}
        min={0}
        onChange={(e) => setAmount(e.target.value)}
        className="mt-1.5 h-11 text-base"
      />

      <div className="mt-2 grid grid-cols-3 gap-2">
        {USD_PRESETS.map((p) => (
          <Button
            key={p}
            variant="secondary"
            size="sm"
            onClick={() => setAmount(String(p))}
          >
            ${p}
          </Button>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {PERCENT_PRESETS.map((p) => (
          <Button
            key={p}
            variant="outline"
            size="sm"
            onClick={() => handlePercent(p)}
          >
            {p === 100 ? "MAX" : `${p}%`}
          </Button>
        ))}
      </div>

      <SlippageRow
        slippage={slippage}
        setSlippage={setSlippage}
        open={slippageOpen}
        setOpen={setSlippageOpen}
      />

      <SummaryRows
        token={token}
        side={side}
        estTokens={estTokens}
        slippage={slippage}
      />

      {tradeError && (
        <p className="mt-3 text-center text-xs text-down">{tradeError}</p>
      )}

      <Button
        className={cn(
          "mt-4 h-12 w-full text-base font-semibold",
          isBuy ? "trade-buy-btn" : "trade-sell-btn",
        )}
        disabled={ctaDisabled}
        onClick={() => {
          void handleTrade();
        }}
      >
        {submitting
          ? isBuy
            ? "Buying…"
            : "Selling…"
          : `${isBuy ? "Buy" : "Sell"} ${token.symbol}`}
      </Button>

      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Demo only · Route via Jupiter aggregator
      </p>
    </div>
  );
}

function SideTabs({
  side,
  setSide,
}: {
  side: TradeSide;
  setSide: (s: TradeSide) => void;
}) {
  const isBuy = side === "buy";
  return (
    <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
      <button
        onClick={() => setSide("buy")}
        className={cn(
          "rounded-md py-2 text-sm font-semibold transition-colors",
          isBuy ? "bg-up/20 text-up" : "text-muted-foreground hover:text-foreground",
        )}
      >
        Buy
      </button>
      <button
        onClick={() => setSide("sell")}
        className={cn(
          "rounded-md py-2 text-sm font-semibold transition-colors",
          !isBuy ? "bg-down/20 text-down" : "text-muted-foreground hover:text-foreground",
        )}
      >
        Sell
      </button>
    </div>
  );
}

function SlippageRow({
  slippage,
  setSlippage,
  open,
  setOpen,
}: {
  slippage: number;
  setSlippage: (n: number) => void;
  open: boolean;
  setOpen: (b: boolean) => void;
}) {
  return (
    <div className="mt-3 rounded-lg border border-white/5 bg-card/40">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs"
      >
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Settings2 size={12} />
          Slippage tolerance
        </span>
        <span className="flex items-center gap-1 font-medium">
          {slippage.toFixed(1)}%
          <ChevronDown
            size={12}
            className={cn("transition-transform", open && "rotate-180")}
          />
        </span>
      </button>
      {open && (
        <div className="grid grid-cols-3 gap-2 px-3 pb-3">
          {[0.1, 0.5, 1.0].map((s) => (
            <Button
              key={s}
              variant={slippage === s ? "default" : "outline"}
              size="sm"
              onClick={() => setSlippage(s)}
            >
              {s}%
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryRows({
  token,
  side,
  estTokens,
  slippage,
}: {
  token: Token;
  side: TradeSide;
  estTokens: number;
  slippage: number;
}) {
  const isBuy = side === "buy";
  const minReceived = estTokens * (1 - slippage / 100);
  return (
    <div className="mt-4 space-y-1.5 text-xs">
      <Row
        label={isBuy ? "You receive" : "You sell"}
        value={`≈ ${formatAmount(estTokens)} ${token.symbol}`}
      />
      <Row
        label={isBuy ? "Min. received" : "Min. sold"}
        value={`${formatAmount(minReceived)} ${token.symbol}`}
      />
      <Row label="Price" value={formatPrice(token.price)} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
