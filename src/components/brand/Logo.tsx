import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND, BRAND_ASSETS } from "@/lib/constants";

type LogoSize = "sm" | "md" | "lg" | "xl" | "nav";

const SIZE_PX: Record<LogoSize, number> = {
  sm: 28,
  md: 36,
  lg: 56,
  xl: 96,
  nav: 44,
};

const WORDMARK_CLS: Record<LogoSize, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
  nav: "text-xl",
};

export function LogoMark({
  size = "md",
  className,
}: {
  size?: LogoSize;
  className?: string;
}) {
  const px = SIZE_PX[size];
  return (
    <Image
      src={BRAND_ASSETS.logoTransparent}
      alt={`${BRAND.name} logo`}
      width={px}
      height={px}
      priority
      className={cn("select-none", className)}
    />
  );
}

export function Logo({
  size = "md",
  showWordmark = true,
  asLink = true,
  className,
}: {
  size?: LogoSize;
  showWordmark?: boolean;
  asLink?: boolean;
  className?: string;
}) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-2",
        size === "xl" && "gap-4",
        className,
      )}
    >
      <LogoMark size={size} />
      {showWordmark && (
        <span
          className={cn(
            "font-extrabold tracking-tight lowercase",
            WORDMARK_CLS[size],
          )}
        >
          {BRAND.wordmark}
          <span className="text-primary">.</span>
        </span>
      )}
    </span>
  );

  if (!asLink) return content;
  return (
    <Link href="/" className="inline-flex items-center" aria-label={BRAND.name}>
      {content}
    </Link>
  );
}
