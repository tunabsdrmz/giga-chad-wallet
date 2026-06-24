import { Shimmer } from "@/components/skeleton/Shimmer";
import { PageContainer } from "@/components/layout/PageContainer";

/**
 * Skeleton for /leaderboard while the Supabase fetch (or its mock
 * fallback) resolves. Matches the live layout so the page reflows
 * minimally on hand-off.
 */
export default function LeaderboardLoading() {
  return (
    <main className="relative flex-1 overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px] sm:h-96 sm:w-160 sm:blur-[120px]" />

      <PageContainer className="relative py-10 sm:py-14 lg:py-16">
        <header className="mb-8 flex flex-col items-center gap-5 text-center sm:mb-10 sm:gap-6 md:items-start md:text-left">
          <Shimmer className="h-4 w-28" />
          <div className="w-full max-w-2xl space-y-3">
            <Shimmer className="mx-auto h-10 w-48 sm:mx-0 sm:h-12 sm:w-64" />
            <Shimmer className="mx-auto h-4 w-full max-w-xl sm:mx-0" />
            <Shimmer className="mx-auto h-4 w-4/5 max-w-md sm:mx-0" />
          </div>
          <Shimmer className="h-11 w-full max-w-md sm:h-10 sm:w-72" rounded="lg" />
        </header>

        <div className="overflow-hidden rounded-xl border border-white/8 bg-card/30">
          <div className="hidden border-b border-white/8 px-5 py-3 md:grid md:grid-cols-[3.5rem_minmax(0,1fr)_8rem_6rem_5rem] md:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Shimmer key={i} className="h-3 w-full" />
            ))}
          </div>
          <ul className="divide-y divide-white/5">
            {Array.from({ length: 10 }).map((_, i) => (
              <li key={i} className="px-4 py-4 md:px-5 md:py-3">
                <div className="flex items-center gap-3 md:hidden">
                  <Shimmer className="h-4 w-8" />
                  <Shimmer className="h-10 w-10 shrink-0" rounded="full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Shimmer className="h-4 w-32" />
                    <Shimmer className="h-4 w-20" />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 md:hidden">
                  <Shimmer className="h-10 w-full" rounded="lg" />
                  <Shimmer className="h-10 w-full" rounded="lg" />
                </div>
                <div className="hidden items-center gap-4 md:grid md:grid-cols-[3.5rem_minmax(0,1fr)_8rem_6rem_5rem]">
                  <Shimmer className="h-4 w-8" />
                  <div className="flex items-center gap-3">
                    <Shimmer className="h-8 w-8" rounded="full" />
                    <Shimmer className="h-4 w-32" />
                  </div>
                  <Shimmer className="ml-auto h-4 w-20" />
                  <Shimmer className="ml-auto h-4 w-12" />
                  <Shimmer className="ml-auto h-4 w-10" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </PageContainer>
    </main>
  );
}
