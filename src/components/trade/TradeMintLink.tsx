"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { useTradeMintNav } from "@/components/trade/TradeMintNav";
import { cn } from "@/lib/utils";

type TradeMintLinkProps = {
  mint: string;
  children?: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "children" | "className">;

/**
 * Trade route links opt out of Next.js prefetch. The trade terminal renders
 * dozens of mint links (ticker + sidebar); default prefetch would fire an
 * RSC request for every visible href and blow through BirdEye rate limits.
 *
 * Inside `TradeMintNavProvider`, clicks swap the active mint on the client
 * (no full page navigation).
 */
export function TradeMintLink({
  mint,
  onClick,
  children,
  className,
  ...linkProps
}: TradeMintLinkProps) {
  const nav = useTradeMintNav();

  if (nav) {
    return (
      <button
        type="button"
        className={cn(
          "cursor-pointer border-0 bg-transparent p-0 text-left font-inherit text-inherit outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          className,
        )}
        onClick={(event) => {
          onClick?.(event as unknown as MouseEvent<HTMLAnchorElement>);
          nav.selectMint(mint);
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <Link
      href={`/trade/${mint}`}
      prefetch={false}
      onClick={onClick}
      className={className}
      {...linkProps}
    >
      {children}
    </Link>
  );
}
