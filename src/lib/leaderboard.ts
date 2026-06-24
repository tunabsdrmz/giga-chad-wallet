import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { LeaderboardRow, Period } from "@/lib/supabase/types";

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  avatarUrl: string | null;
  totalPnlUsd: number;
  winRate: number;
  tradesCount: number;
}

export const PERIODS: { id: Period; label: string }[] = [
  { id: "24h", label: "24h" },
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "all", label: "All time" },
];

/**
 * Returns leaderboard entries ordered by rank. Falls back to a static
 * snapshot (same shape as the seed migration) when Supabase isn't
 * configured so the leaderboard UI is always functional.
 */
export async function getLeaderboard(
  period: Period = "30d",
  limit = 10,
): Promise<LeaderboardEntry[]> {
  if (!isSupabaseConfigured) return (FALLBACK[period] ?? []).slice(0, limit);
  try {
    const { data, error } = await getSupabase()
      .from("leaderboard_entries")
      .select("rank, display_name, avatar_url, total_pnl_usd, win_rate, trades_count")
      .eq("period", period)
      .order("rank", { ascending: true })
      .limit(limit);
    if (error) {
      console.warn("[supabase] leaderboard fetch failed", error);
      return (FALLBACK[period] ?? []).slice(0, limit);
    }
    if (!data || data.length === 0) {
      return (FALLBACK[period] ?? []).slice(0, limit);
    }
    return data.map(rowToEntry);
  } catch (err) {
    console.warn("[supabase] leaderboard fetch threw", err);
    return (FALLBACK[period] ?? []).slice(0, limit);
  }
}

function rowToEntry(
  row: Pick<
    LeaderboardRow,
    "rank" | "display_name" | "avatar_url" | "total_pnl_usd" | "win_rate" | "trades_count"
  >,
): LeaderboardEntry {
  return {
    rank: row.rank,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    totalPnlUsd: Number(row.total_pnl_usd),
    winRate: Number(row.win_rate),
    tradesCount: row.trades_count,
  };
}

// Names are shared across periods; only the numeric columns shift.
// Keep these in lock-step with `supabase/migrations/20260622000002_seed_leaderboard.sql`.
const NAMES = [
  "GigaChad",
  "roman.sol",
  "jijo_exe",
  "cupsey",
  "Zrool",
  "Smithii",
  "Esee",
  "JaredFromSubway",
  "360blazeit",
  "wojakNoScope",
];

const FALLBACK: Record<Period, LeaderboardEntry[]> = {
  "24h": buildPeriod([
    [8420, 82.5, 38], [6210, 78.1, 31], [4780, 74.6, 26], [3210, 70.0, 22], [2440, 66.3, 19],
    [1880, 63.1, 17], [1490, 60.4, 15], [1270, 58.0, 14], [990, 55.5, 12], [720, 52.3, 10],
  ]),
  "7d": buildPeriod([
    [41200, 80.4, 112], [28640, 74.8, 92], [19850, 72.0, 75], [13320, 67.2, 58], [9540, 63.6, 47],
    [7110, 61.5, 41], [5920, 59.8, 36], [4940, 57.9, 33], [3880, 55.6, 28], [2960, 53.9, 24],
  ]),
  "30d": buildPeriod([
    [142300, 78.2, 312], [92840, 71.5, 248], [64120, 69.8, 198], [41300, 65.0, 142], [28900, 62.1, 121],
    [21450, 60.7, 109], [18120, 58.9, 94], [15440, 57.2, 88], [12100, 55.0, 72], [9320, 53.4, 61],
  ]),
  all: buildPeriod([
    [612400, 74.8, 1380], [412930, 70.2, 1124], [281450, 68.5, 926], [184220, 64.1, 712], [127880, 61.4, 598],
    [98330, 59.6, 521], [79740, 58.2, 468], [68490, 56.7, 432], [52210, 54.5, 361], [39880, 52.8, 301],
  ]),
};

function buildPeriod(rows: [number, number, number][]): LeaderboardEntry[] {
  return rows.map(([pnl, winRate, trades], idx) => ({
    rank: idx + 1,
    displayName: NAMES[idx]!,
    avatarUrl: null,
    totalPnlUsd: pnl,
    winRate,
    tradesCount: trades,
  }));
}
