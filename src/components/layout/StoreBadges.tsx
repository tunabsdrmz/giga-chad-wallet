import type { ReactNode } from "react";
import { SiApple, SiGoogleplay } from "react-icons/si";
import { STORE_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StoreBadgesProps {
  className?: string;
  size?: "sm" | "md";
  /** Stack vertically on narrow screens (hero / footer CTAs). */
  stackOnMobile?: boolean;
  variant?: "default" | "glass";
}

export function StoreBadges({
  className,
  size = "md",
  stackOnMobile = true,
  variant = "default",
}: StoreBadgesProps) {
  const pad = size === "sm" ? "px-3 py-2" : variant === "glass" ? "px-4 py-3" : "px-4 py-2.5";
  const iconSize = size === "sm" ? 18 : variant === "glass" ? 20 : 22;
  const labelSize = size === "sm" ? "text-xs" : "text-sm";
  const isGlass = variant === "glass";

  return (
    <div
      className={cn(
        "flex items-stretch gap-2 sm:gap-3",
        stackOnMobile ? "w-full flex-col xs:flex-row sm:w-auto" : "flex-row flex-wrap",
        className,
      )}
    >
      <StoreLink
        href={STORE_LINKS.appStore}
        pad={pad}
        labelSize={labelSize}
        eyebrow="Download on the"
        title="App Store"
        icon={<SiApple size={iconSize} aria-hidden />}
        glass={isGlass}
      />
      <StoreLink
        href={STORE_LINKS.googlePlay}
        pad={pad}
        labelSize={labelSize}
        eyebrow="Get it on"
        title="Google Play"
        icon={<SiGoogleplay size={iconSize} aria-hidden />}
        glass={isGlass}
      />
    </div>
  );
}

function StoreLink({
  href,
  pad,
  labelSize,
  eyebrow,
  title,
  icon,
  glass,
}: {
  href: string;
  pad: string;
  labelSize: string;
  eyebrow: string;
  title: string;
  icon: ReactNode;
  glass?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex min-h-11 flex-1 items-center gap-2.5 text-left transition-colors",
        glass
          ? "landing-store-badge rounded-md border-0 px-4 py-2.5 sm:min-w-[7.5rem] sm:flex-initial"
          : [
              "rounded-xl border border-white/10 bg-white/5",
              "hover:border-white/20 hover:bg-white/10",
              "sm:min-w-[9.5rem] sm:flex-initial",
            ],
        pad,
      )}
    >
      <span className="flex shrink-0 items-center justify-center text-foreground">
        {icon}
      </span>
      <span className="leading-tight">
        {!glass && (
          <span className="block text-[10px] text-muted-foreground">{eyebrow}</span>
        )}
        <span className={cn("block font-semibold", labelSize)}>{title}</span>
      </span>
    </a>
  );
}
