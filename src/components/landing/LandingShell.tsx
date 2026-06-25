import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./landing.css";

export function LandingShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "landing-theme relative isolate flex min-h-full flex-col overflow-x-clip",
        className,
      )}
    >
      {children}
    </div>
  );
}
