"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { PERIODS } from "@/lib/leaderboard";
import type { Period } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

/**
 * Period tabs for the leaderboard. Writes the active period to the
 * URL (`?period=…`) so the server component on /leaderboard can re-
 * fetch on navigation.
 */
export function PeriodSwitcher({ active }: { active: Period }) {
  const router = useRouter();
  const search = useSearchParams();
  const [pending, startTransition] = useTransition();

  const setPeriod = (next: Period) => {
    const params = new URLSearchParams(search?.toString() ?? "");
    if (next === "30d") params.delete("period");
    else params.set("period", next);
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/leaderboard?${qs}` : "/leaderboard", { scroll: false });
    });
  };

  return (
    <div className="w-full md:w-auto">
      <div
        role="tablist"
        aria-label="Leaderboard time window"
        className={cn(
          "flex w-full gap-1 overflow-x-auto rounded-xl border border-white/10 bg-card/40 p-1",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          pending && "opacity-70",
          "sm:inline-flex sm:w-auto",
        )}
      >
        {PERIODS.map((p) => {
          const isActive = p.id === active;
          return (
            <button
              key={p.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              disabled={pending}
              onClick={() => setPeriod(p.id)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:py-1.5",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
