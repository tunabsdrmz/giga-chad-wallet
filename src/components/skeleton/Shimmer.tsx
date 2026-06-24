import { cn } from "@/lib/utils";

/**
 * Reusable shimmer block. Used by loading skeletons across the app.
 * Animation is defined in globals.css (`animate-shimmer`).
 */
export function Shimmer({
  className,
  rounded = "md",
}: {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}) {
  const radius = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }[rounded];
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted/40",
        radius,
        "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer",
        "before:bg-gradient-to-r before:from-transparent before:via-white/8 before:to-transparent",
        className,
      )}
      aria-hidden="true"
    />
  );
}
