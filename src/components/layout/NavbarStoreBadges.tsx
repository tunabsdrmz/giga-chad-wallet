import { SiApple, SiGoogleplay } from "react-icons/si";
import { STORE_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const badgeLink =
  "block rounded-md bg-white/20 backdrop-blur-md transition hover:opacity-90 hover:ring-1 hover:ring-white/40 hover:backdrop-blur-sm";

/** Compact App Store / Google Play badges matching fomo.family header. */
export function NavbarStoreBadges({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <a
        href={STORE_LINKS.appStore}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download on the App Store"
        className={badgeLink}
      >
        <span className="flex h-10 w-[7.5rem] items-center gap-2 px-2.5">
          <SiApple size={18} className="shrink-0" aria-hidden />
          <span className="leading-none">
            <span className="block text-[9px] text-white/70">Download on the</span>
            <span className="block text-xs font-semibold">App Store</span>
          </span>
        </span>
      </a>
      <a
        href={STORE_LINKS.googlePlay}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get it on Google Play"
        className={badgeLink}
      >
        <span className="flex h-10 w-[8.4375rem] items-center gap-2 px-2.5">
          <SiGoogleplay size={16} className="shrink-0" aria-hidden />
          <span className="leading-none">
            <span className="block text-[9px] text-white/70">Get it on</span>
            <span className="block text-xs font-semibold">Google Play</span>
          </span>
        </span>
      </a>
    </div>
  );
}
