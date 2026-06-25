import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./trade.css";

export function TradeShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("trade-theme flex min-h-dvh flex-col", className)}>
      {children}
    </div>
  );
}
