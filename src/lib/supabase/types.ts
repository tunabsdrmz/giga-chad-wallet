/**
 * Hand-written types that mirror the Supabase schema in
 * `supabase/migrations/`. Keep these in sync with the SQL — or generate
 * via `supabase gen types typescript` once a project is wired up.
 *
 * Shape matches `@supabase/supabase-js`'s `GenericSchema`:
 * each table is `{ Row, Insert, Update, Relationships }` and the
 * schema also has `Views` and `Functions` records.
 *
 * NOTE: these are `type` aliases (not `interface`) on purpose —
 * interfaces are not assignable to `Record<string, unknown>` (because
 * declaration merging makes them "open"), which breaks `supabase-js`'s
 * generic constraints and silently degrades inference to `never`.
 */

export type Period = "24h" | "7d" | "30d" | "all";

export type UserRow = {
  did: string;
  display_name: string | null;
  avatar_url: string | null;
  solana_address: string | null;
  created_at: string;
  updated_at: string;
};

export type WatchlistRow = {
  id: string;
  user_did: string;
  mint: string;
  added_at: string;
};

export type PositionRow = {
  id: string;
  user_did: string;
  mint: string;
  amount: number;
  avg_entry_usd: number;
  opened_at: string;
  updated_at: string;
};

export type LeaderboardRow = {
  id: string;
  rank: number;
  user_did: string | null;
  display_name: string;
  avatar_url: string | null;
  total_pnl_usd: number;
  win_rate: number;
  trades_count: number;
  period: Period;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: Partial<Omit<UserRow, "did">> & { did: string };
        Update: Partial<Omit<UserRow, "did">>;
        Relationships: [];
      };
      watchlist_items: {
        Row: WatchlistRow;
        Insert: Omit<WatchlistRow, "id" | "added_at"> & {
          id?: string;
          added_at?: string;
        };
        Update: Partial<WatchlistRow>;
        Relationships: [];
      };
      positions: {
        Row: PositionRow;
        Insert: Omit<PositionRow, "id" | "opened_at" | "updated_at"> & {
          id?: string;
          opened_at?: string;
          updated_at?: string;
        };
        Update: Partial<PositionRow>;
        Relationships: [];
      };
      leaderboard_entries: {
        Row: LeaderboardRow;
        Insert: Omit<LeaderboardRow, "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<LeaderboardRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
