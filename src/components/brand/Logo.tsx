import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

type LogoSize = "sm" | "md" | "lg" | "xl";

const SIZE_PX: Record<LogoSize, number> = {
  sm: 28,
  md: 36,
  lg: 56,
  xl: 96,
};

const WORDMARK_CLS: Record<LogoSize, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
};

/**
 * Brand mark. The PNG asset has a black background baked in, so we use
 * `mix-blend-screen` to drop the black against any dark surface — the
 * white linework stays, the black background becomes invisible.
 */
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
      src="/brand/logo-on-dark.png"
      alt={`${BRAND.name} logo`}
      width={px}
      height={px}
      priority
      className={cn("mix-blend-screen select-none", className)}
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
