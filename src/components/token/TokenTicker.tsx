import { TrendingDown, TrendingUp } from "lucide-react";
import type { Token } from "@/types/token";
import { TradeMintLink } from "@/components/trade/TradeMintLink";
import { TokenAvatar } from "@/components/token/TokenAvatar";
import { formatPrice, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

interface TokenTickerProps {
  /** Scroll direction. Use "left" for the top banner, "right" for bottom. */
  direction?: "left" | "right";
  tokens: Token[];
  className?: string;
  variant?: "landing" | "trade";
}

function TickerChip({
  token,
  interactive = true,
  variant,
}: {
  token: Token;
  interactive?: boolean;
  variant: "landing" | "trade";
}) {
  const up = token.change24h >= 0;
  const className = cn(
    variant === "landing" ? "landing-ticker-chip" : "trade-ticker-chip",
    "group flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/3 py-1.5 pl-1.5 pr-3.5 text-sm transition-all duration-200",
    interactive && "hover:-translate-y-px",
  );

  const body = (
    <>
      <TokenAvatar
        mint={token.mint}
        symbol={token.symbol}
        logoUrl={token.logoUrl}
        size="xs"
      />
      <span className="font-semibold tracking-tight">{token.symbol}</span>
      <span className="text-muted-foreground">{formatPrice(token.price)}</span>
      <span
        className={cn(
          "flex items-center gap-0.5 font-medium",
          up ? "text-up" : "text-down",
        )}
      >
        {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        {formatPercent(token.change24h)}
      </span>
    </>
  );

  if (!interactive) {
    return (
      <div className={className} aria-hidden="true">
        {body}
      </div>
    );
  }

  return (
    <TradeMintLink mint={token.mint} className={className}>
      {body}
    </TradeMintLink>
  );
}

export function TokenTicker({
  direction = "left",
  tokens,
  className,
  variant = "trade",
}: TokenTickerProps) {
  if (tokens.length === 0) return null;
  const animation =
    direction === "left" ? "animate-marquee" : "animate-marquee-reverse";

  return (
    <div
      className={cn(
        variant === "landing" ? "landing-ticker" : "trade-ticker",
        "relative w-full overflow-hidden border-y border-white/5 py-2",
        variant === "trade" && "bg-card/40",
        className,
      )}
    >
      <div className={cn("marquee-track flex w-max gap-3", animation)}>
        {tokens.map((token) => (
          <TickerChip key={token.mint} token={token} variant={variant} />
        ))}
        {tokens.map((token) => (
          <TickerChip
            key={`dup-${token.mint}`}
            token={token}
            variant={variant}
            interactive={false}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-background to-transparent" />
    </div>
  );
}
