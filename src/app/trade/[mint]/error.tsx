"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TradeTokenError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[trade/[mint]/error]", error);
  }, [error]);

  return (
    <main className="relative flex min-h-[50vh] flex-1 items-center justify-center p-6">
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--trade-border)] bg-card/40 p-8 text-center shadow-xl backdrop-blur">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-down/15 text-down">
          <AlertOctagon size={24} />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Trade page failed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Could not load this token. Try again or pick another from trending.
        </p>
        {error.digest ? (
          <p className="mt-3 inline-block rounded-md bg-muted/40 px-2 py-1 font-mono text-[11px] text-muted-foreground">
            digest: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} className="gap-2">
            <RefreshCw size={14} />
            Try again
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/trade" />}>
            Back to trade
          </Button>
        </div>
      </div>
    </main>
  );
}
