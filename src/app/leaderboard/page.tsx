import { Trophy } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { TokenTicker } from "@/components/token/TokenTicker";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { PeriodSwitcher } from "@/components/leaderboard/PeriodSwitcher";
import { getLeaderboard } from "@/lib/leaderboard";
import type { Period } from "@/lib/supabase/types";
import { getTrending } from "@/lib/tokens";

const VALID_PERIODS: Period[] = ["24h", "7d", "30d", "all"];

function parsePeriod(value: string | string[] | undefined): Period {
  if (typeof value === "string" && VALID_PERIODS.includes(value as Period)) {
    return value as Period;
  }
  return "30d";
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const sp = await searchParams;
  const period = parsePeriod(sp.period);
  const [entries, trending] = await Promise.all([
    getLeaderboard(period, 20),
    getTrending(20),
  ]);

  return (
    <>
      <Navbar />
      <TokenTicker direction="left" tokens={trending} />
      <main className="relative flex-1 overflow-x-clip">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px] sm:h-96 sm:w-160 sm:blur-[120px]" />

        <PageContainer className="relative py-10 sm:py-14 lg:py-16">
          <header className="mb-8 flex flex-col items-center gap-5 text-center sm:mb-10 sm:gap-6 md:items-start md:text-left">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">
              <Trophy size={14} />
              <span>Top traders</span>
            </div>
            <div className="max-w-2xl">
              <h1 className="text-[clamp(2rem,6vw,3rem)] font-bold tracking-tight">
                Leaderboard
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Ranking the sharpest Chad on Solana by realized PnL. Updated
                continuously from on-chain swaps.
              </p>
            </div>
            <PeriodSwitcher active={period} />
          </header>

          <LeaderboardTable entries={entries} />
        </PageContainer>
      </main>
      <TokenTicker direction="right" tokens={trending} />
      <Footer />
    </>
  );
}
