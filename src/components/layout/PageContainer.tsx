import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  /** Tighter horizontal padding for full-bleed bars like the navbar. */
  tight?: boolean;
};

/**
 * Shared horizontal layout shell for landing sections.
 * Scales padding and max-width from phone → tablet → 4K without
 * leaving huge empty gutters on ultra-wide monitors.
 */
export function PageContainer({ children, className, tight }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        tight
          ? "max-w-none px-4 sm:px-6 lg:max-w-7xl lg:px-8 2xl:max-w-[90rem] 2xl:px-10"
          : [
              "max-w-7xl px-4 sm:px-6 lg:px-8",
              "2xl:max-w-[90rem] 2xl:px-10",
              "[@media(min-width:1920px)]:max-w-[100rem] [@media(min-width:1920px)]:px-12",
            ],
        className,
      )}
    >
      {children}
    </div>
  );
}
