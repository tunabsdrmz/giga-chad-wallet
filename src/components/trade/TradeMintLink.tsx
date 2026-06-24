"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { useTradeMintNav } from "@/components/trade/TradeMintNav";

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
  ...props
}: {
  mint: string;
  children?: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href">) {
  const nav = useTradeMintNav();

  if (nav) {
    return (
      <button
        type="button"
        {...(props as ComponentProps<"button">)}
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
    <Link href={`/trade/${mint}`} prefetch={false} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}
