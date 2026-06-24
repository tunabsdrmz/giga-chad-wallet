"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary. Catches any uncaught error thrown by a
 * server or client component beneath the root layout, logs it (so we
 * can see it in dev / production tracing), and offers the user a
 * retry + home link.
 */
export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <main className="relative flex flex-1 items-center justify-center p-6">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-160 -translate-x-1/2 rounded-full bg-down/10 blur-[120px]" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-card/40 p-8 text-center shadow-xl backdrop-blur">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-down/15 text-down">
          <AlertOctagon size={24} />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Something broke</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page hit a snag rendering. You can try again — or head back to
          home if it sticks.
        </p>
        {error.digest && (
          <p className="mt-3 inline-block rounded-md bg-muted/40 px-2 py-1 font-mono text-[11px] text-muted-foreground">
            digest: {error.digest}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} className="gap-2">
            <RefreshCw size={14} />
            Try again
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
            Back to home
          </Button>
        </div>
      </div>
    </main>
  );
}
