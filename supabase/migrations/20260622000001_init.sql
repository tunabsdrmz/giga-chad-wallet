-- ChadWallet initial schema
-- Keyed by Privy DID (e.g. "did:privy:abc123") so we don't need Supabase Auth.

-- =============================================================================
-- Tables
-- =============================================================================

-- Profile per Privy-authenticated user
create table if not exists public.users (
  did              text primary key,
  display_name     text,
  avatar_url       text,
  solana_address   text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists users_created_at_idx on public.users (created_at desc);

-- Watchlist (one row per (user, mint))
create table if not exists public.watchlist_items (
  id        uuid primary key default gen_random_uuid(),
  user_did  text not null references public.users(did) on delete cascade,
  mint      text not null,
  added_at  timestamptz not null default now(),
  unique (user_did, mint)
);
create index if not exists watchlist_user_idx on public.watchlist_items (user_did);

-- Mock positions (demo only — no real trading happens yet)
create table if not exists public.positions (
  id             uuid primary key default gen_random_uuid(),
  user_did       text not null references public.users(did) on delete cascade,
  mint           text not null,
  amount         numeric not null,
  avg_entry_usd  numeric not null,
  opened_at      timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (user_did, mint)
);
create index if not exists positions_user_idx on public.positions (user_did);

-- Leaderboard rankings (read-only seed data; refreshed by a job in the future)
create table if not exists public.leaderboard_entries (
  id              uuid primary key default gen_random_uuid(),
  rank            integer not null,
  user_did        text references public.users(did) on delete set null,
  display_name    text not null,
  avatar_url      text,
  total_pnl_usd   numeric not null default 0,
  win_rate        numeric not null default 0,
  trades_count    integer not null default 0,
  period          text not null default '30d',
  updated_at      timestamptz not null default now()
);
create index if not exists leaderboard_period_rank_idx
  on public.leaderboard_entries (period, rank);

-- =============================================================================
-- Row Level Security
-- =============================================================================
-- DEMO POSTURE: we use the public anon key from the browser and the only auth
-- we have is Privy (not Supabase Auth). RLS is therefore permissive: reads
-- are public, writes are allowed from anon. For production, validate the
-- Privy JWT in an Edge Function and tighten these policies (or stop writing
-- from the browser entirely and route through your own API).

alter table public.users              enable row level security;
alter table public.watchlist_items    enable row level security;
alter table public.positions          enable row level security;
alter table public.leaderboard_entries enable row level security;

-- Public reads everywhere
create policy "users_select_all"
  on public.users for select using (true);
create policy "watchlist_select_all"
  on public.watchlist_items for select using (true);
create policy "positions_select_all"
  on public.positions for select using (true);
create policy "leaderboard_select_all"
  on public.leaderboard_entries for select using (true);

-- Writes (demo: anon-friendly; tighten before going to prod)
create policy "users_insert_anon"
  on public.users for insert with check (true);
create policy "users_update_anon"
  on public.users for update using (true);

create policy "watchlist_insert_anon"
  on public.watchlist_items for insert with check (true);
create policy "watchlist_delete_anon"
  on public.watchlist_items for delete using (true);

create policy "positions_insert_anon"
  on public.positions for insert with check (true);
create policy "positions_update_anon"
  on public.positions for update using (true);
create policy "positions_delete_anon"
  on public.positions for delete using (true);

-- Leaderboard is read-only from the client; seed via service role.
