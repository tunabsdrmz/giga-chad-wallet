import { AvatarImage } from "@/components/token/AvatarImage";
import { cn } from "@/lib/utils";

/**
 * Deterministic gradient avatar for any token. When a `logoUrl` is
 * provided we render it as a circle image and fall back to the
 * gradient if it fails to load (handled by the client-side
 * `AvatarImage` helper). Used across the app — trending list,
 * ticker, header, holders, trades, leaderboard.
 */

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function paletteFor(mint: string): { from: string; to: string } {
  const h = hashString(mint);
  const hueA = h % 360;
  const hueB = (h * 7) % 360;
  return {
    from: `oklch(0.68 0.16 ${hueA})`,
    to: `oklch(0.62 0.18 ${hueB})`,
  };
}

const SIZE_PX: Record<string, number> = {
  xs: 18,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 56,
};

const TEXT_CLS: Record<string, string> = {
  xs: "text-[8px]",
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-base",
};

export function TokenAvatar({
  mint,
  symbol,
  logoUrl,
  size = "md",
  className,
}: {
  mint: string;
  symbol: string;
  /** Real token logo to use first. Falls back to gradient on load error. */
  logoUrl?: string | null;
  size?: keyof typeof SIZE_PX;
  className?: string;
}) {
  const { from, to } = paletteFor(mint);
  const initials = symbol.slice(0, 3);
  const px = SIZE_PX[size];

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold text-black/80 ring-1 ring-white/15",
        TEXT_CLS[size],
        className,
      )}
      style={{
        width: px,
        height: px,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
      aria-hidden="true"
    >
      {logoUrl ? (
        <AvatarImage src={logoUrl} size={px} alt={initials} />
      ) : (
        initials
      )}
    </span>
  );
}
