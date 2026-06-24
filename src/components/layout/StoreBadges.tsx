import type { ReactNode } from "react";
import { SiApple, SiGoogleplay } from "react-icons/si";
import { STORE_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StoreBadgesProps {
  className?: string;
  size?: "sm" | "md";
  /** Stack vertically on narrow screens (hero / footer CTAs). */
  stackOnMobile?: boolean;
}

export function StoreBadges({
  className,
  size = "md",
  stackOnMobile = true,
}: StoreBadgesProps) {
  const pad = size === "sm" ? "px-3 py-2" : "px-4 py-2.5";
  const iconSize = size === "sm" ? 18 : 22;
  const labelSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div
      className={cn(
        "flex items-stretch gap-3",
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
      />
      <StoreLink
        href={STORE_LINKS.googlePlay}
        pad={pad}
        labelSize={labelSize}
        eyebrow="Get it on"
        title="Google Play"
        icon={<SiGoogleplay size={iconSize} aria-hidden />}
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
}: {
  href: string;
  pad: string;
  labelSize: string;
  eyebrow: string;
  title: string;
  icon: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex min-h-11 flex-1 items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 text-left",
        "transition-colors hover:border-white/20 hover:bg-white/10",
        "sm:min-w-[9.5rem] sm:flex-initial",
        pad,
      )}
    >
      <span className="flex shrink-0 items-center justify-center text-foreground">
        {icon}
      </span>
      <span className="leading-tight">
        <span className="block text-[10px] text-muted-foreground">{eyebrow}</span>
        <span className={cn("block font-semibold", labelSize)}>{title}</span>
      </span>
    </a>
  );
}
