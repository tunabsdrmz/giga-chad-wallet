import { notFound } from "next/navigation";
import { TradeTerminal } from "@/components/trade/TradeTerminal";
import { getLeaderboard } from "@/lib/leaderboard";
import type { Period } from "@/lib/supabase/types";
import { getTokenByMint, getTrending, getStaticMints } from "@/lib/tokens";

const VALID_PERIODS: Period[] = ["24h", "7d", "30d", "all"];

function parsePeriod(value: string | undefined): Period {
  if (value && VALID_PERIODS.includes(value as Period)) {
    return value as Period;
  }
  return "30d";
}

export function generateStaticParams() {
  return getStaticMints().map((mint) => ({ mint }));
}

export default async function TradeTokenPage({
  params,
  searchParams,
}: {
  params: Promise<{ mint: string }>;
  searchParams: Promise<{ period?: string }>;
}) {
  const { mint } = await params;
  const sp = await searchParams;
  const period = parsePeriod(sp.period);
  const [trending, leaderboard] = await Promise.all([
    getTrending(20),
    getLeaderboard(period, 20),
  ]);
  const token = await getTokenByMint(mint, trending);
  if (!token) notFound();

  return (
    <main className="relative min-h-0 flex-1 overflow-x-clip">
      <TradeTerminal
        seedToken={token}
        trending={trending}
        leaderboard={leaderboard}
        leaderboardPeriod={period}
      />
    </main>
  );
}
