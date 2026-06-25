import { Shimmer } from "@/components/skeleton/Shimmer";
import { TRADE_TERMINAL_GRID_CLASS } from "@/components/trade/trade-terminal-grid";

/** Loading placeholder aligned with `TradeTerminal` grid + mobile order. */
export function TradePageSkeleton() {
  return (
    <main className="relative min-h-0 flex-1 overflow-x-clip">
      <div className="trade-panel border-b lg:hidden">
        <div className="flex gap-2 overflow-hidden px-3 py-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Shimmer key={i} className="h-8 w-24 shrink-0" rounded="full" />
          ))}
        </div>
      </div>

      <div className={TRADE_TERMINAL_GRID_CLASS}>
        <aside className="trade-panel hidden min-h-0 flex-col border-r p-3 lg:flex [grid-area:leaderboard] lg:row-span-3">
          <Shimmer className="mb-3 h-8 w-36" />
          <Shimmer className="mb-3 h-9 w-full" />
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2">
              <Shimmer className="h-6 w-6" rounded="full" />
              <div className="flex-1 space-y-1">
                <Shimmer className="h-3 w-12" />
                <Shimmer className="h-2.5 w-16" />
              </div>
              <Shimmer className="h-3 w-12" />
            </div>
          ))}
        </aside>

        <div className="trade-panel border-b p-3 sm:p-4 lg:border-b-0 [grid-area:header]">
          <div className="flex items-start gap-3">
            <Shimmer className="h-10 w-10 shrink-0" rounded="full" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-5 w-28" />
              <Shimmer className="h-3 w-40" />
            </div>
            <Shimmer className="h-9 w-9 shrink-0" rounded="md" />
          </div>
          <Shimmer className="mt-4 h-9 w-36" />
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Shimmer key={i} className="h-12 w-full" rounded="lg" />
            ))}
          </div>
        </div>

        <aside className="trade-panel min-h-0 border-b p-4 lg:row-span-3 lg:border-b-0 lg:border-l [grid-area:sidebar]">
          <Shimmer className="h-10 w-full" />
          <Shimmer className="mt-3 h-32 w-full" rounded="lg" />
          <Shimmer className="mt-3 h-12 w-full" />
          <Shimmer className="mt-6 h-24 w-full" rounded="lg" />
        </aside>

        <div className="trade-panel flex min-h-[270px] h-[min(47vh,460px)] flex-col p-2 sm:min-h-[310px] sm:p-3 lg:min-h-0 lg:h-full lg:border-r [grid-area:chart]">
          <Shimmer className="mb-2 h-8 w-full" rounded="lg" />
          <Shimmer className="min-h-0 flex-1 w-full" rounded="lg" />
        </div>

        <div className="trade-panel min-h-[250px] h-[min(36vh,350px)] p-3 sm:min-h-[270px] lg:min-h-0 lg:h-full [grid-area:activity]">
          <Shimmer className="mb-3 h-9 w-48" rounded="lg" />
          <Shimmer className="h-32 w-full" rounded="lg" />
        </div>
      </div>
    </main>
  );
}
