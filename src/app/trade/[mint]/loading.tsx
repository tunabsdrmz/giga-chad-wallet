import { Shimmer } from "@/components/skeleton/Shimmer";

export default function TradeLoading() {
  return (
    <main className="relative flex-1 overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px] sm:h-96 sm:w-160 sm:blur-[120px]" />

      <div className="border-b border-white/8 bg-card/30 px-3 py-2.5 lg:hidden">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Shimmer key={i} className="h-8 w-24 shrink-0" rounded="full" />
          ))}
        </div>
      </div>

      <div className="relative grid grid-cols-1 lg:h-[calc(100dvh-6.6rem)] lg:grid-cols-[260px_1fr_340px] lg:overflow-hidden xl:grid-cols-[280px_1fr_380px]">
        <aside className="hidden border-r border-white/8 bg-card/20 p-3 lg:flex lg:flex-col lg:gap-2.5">
          <Shimmer className="h-8 w-32" />
          <Shimmer className="h-9 w-full" />
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5 py-1">
              <Shimmer className="h-6 w-6" rounded="full" />
              <div className="flex-1 space-y-1">
                <Shimmer className="h-3 w-12" />
                <Shimmer className="h-2.5 w-16" />
              </div>
              <Shimmer className="h-3 w-12" />
            </div>
          ))}
        </aside>

        <section className="flex min-h-0 min-w-0 flex-col">
          <div className="space-y-3 border-b border-white/5 p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <Shimmer className="h-10 w-10 shrink-0" rounded="full" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-5 w-28" />
                <Shimmer className="h-3 w-40" />
              </div>
              <Shimmer className="h-9 w-9 shrink-0" rounded="md" />
            </div>
            <Shimmer className="h-8 w-36" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Shimmer key={i} className="h-12 w-full" rounded="lg" />
              ))}
            </div>
          </div>

          <div className="border-b border-white/8 bg-card/20 p-3 lg:hidden">
            <Shimmer className="h-48 w-full" rounded="lg" />
          </div>

          <div className="h-[min(42vh,400px)] min-h-[240px] p-2 sm:p-3 lg:flex-1">
            <Shimmer className="h-full w-full" rounded="lg" />
          </div>

          <div className="min-h-[260px] border-t border-white/8 p-3 sm:min-h-[280px] lg:h-[40%]">
            <Shimmer className="mb-3 h-9 w-48" rounded="lg" />
            <Shimmer className="h-32 w-full" rounded="lg" />
          </div>
        </section>

        <aside className="hidden border-l border-white/8 bg-card/20 p-4 lg:flex lg:flex-col lg:gap-3">
          <Shimmer className="h-10 w-full" />
          <Shimmer className="h-32 w-full" rounded="lg" />
          <Shimmer className="h-12 w-full" />
          <div className="mt-auto space-y-2">
            <Shimmer className="h-4 w-20" />
            <Shimmer className="h-24 w-full" rounded="lg" />
          </div>
        </aside>
      </div>
    </main>
  );
}
