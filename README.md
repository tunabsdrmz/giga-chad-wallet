# ChadWallet — Web demo

A Next.js + Tailwind demo of the ChadWallet experience: a memecoin-themed
landing page, a Solana-style trading UI, and a PnL leaderboard. Sign-in uses
Privy (Google + email OTP). Optional Supabase persistence powers profiles,
watchlists, positions, and leaderboard data. Market data comes from BirdEye;
on-chain SOL balances use Alchemy Devnet RPC.

## What's included

| Area | Route | Notes |
| --- | --- | --- |
| Landing | `/` | Hero, features, cross-device promo, rotating token ticker |
| Trade | `/trade`, `/trade/[mint]` | Trending list, chart, trades/holders feeds, buy/sell panel |
| Leaderboard | `/leaderboard` | 24h / 7d / 30d / all-time rankings |

**Auth (Privy)** — Google and email OTP. A Solana devnet wallet is created
automatically on sign-in. Apple Sign-In is not enabled in this demo.

**Trading UI** — Buy/sell is a **mock simulator**: fills at the token's
BirdEye price, updates a demo USDC balance (localStorage), and persists
positions to Supabase when configured. No on-chain swaps or Jupiter routing.

**Data** — Trending tokens, OHLCV candles, recent trades, and holder lists
are fetched server-side via BirdEye proxies. Missing keys fall back to
deterministic mocks in `src/lib/mock/`.

**Wallet** — SOL balance polling and devnet airdrop use `@solana/kit` against
Alchemy when configured, otherwise the public Devnet RPC.

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS v4 + shadcn/ui
- Privy (`@privy-io/react-auth`) — auth + embedded Solana wallets
- Supabase (`@supabase/supabase-js`) — optional persistence
- BirdEye Data Services — token market data (server-only)
- Alchemy — Solana Devnet RPC for balance reads + airdrop
- `lightweight-charts` — price chart (not TradingView Advanced Charts)

## Getting started

```bash
pnpm install
cp .env.local.example .env.local   # fill in keys as you wire each service
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The app is **stub-safe**: any service you haven't configured yet falls back
to a sensible default (mock data, localStorage, or a gated/disabled UI), so
you can wire integrations in any order. In development, a banner lists
services that are still unconfigured.

```bash
pnpm build   # production build + typecheck
pnpm lint
```

## Environment

See `.env.local.example` for the full list.

| Variable | Purpose | When missing |
| --- | --- | --- |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy auth + embedded wallet | Sign-in disabled; trade sidebar shows a public preview |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Watchlist stays in localStorage; positions/profile not persisted remotely |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Same as above — both Supabase vars are required |
| `BIRDEYE_API_KEY` | Token prices, OHLCV, trades, holders | Mock market data. **Server-only — never prefix with `NEXT_PUBLIC_`.** |
| `NEXT_PUBLIC_ALCHEMY_SOLANA_DEVNET_URL` | Solana Devnet RPC | Falls back to `https://api.devnet.solana.com` for SOL balance + airdrop |

Restart `pnpm dev` after editing `.env.local`.

## Supabase setup

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. **Project Settings → API**: copy the project URL and the `anon` public key
   into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
   ```
3. **SQL Editor → New query**: run each migration from `supabase/migrations/`
   in chronological order:
   - `20260622000001_init.sql` — `users`, `watchlist_items`, `positions`,
     `leaderboard_entries`, plus permissive RLS policies
   - `20260622000002_seed_leaderboard.sql` — seeds the 30-day leaderboard
4. Restart `pnpm dev`. Signing in with Privy upserts a row in `public.users`.
   Watchlist items and trade positions write through to Supabase.

### What syncs where

| Table | Hook / entry point | Behaviour |
| --- | --- | --- |
| `users` | `useSyncedUser` | Upsert on Privy sign-in (DID + wallet address) |
| `watchlist_items` | `useWatchlist` | Merge localStorage with Supabase when signed in |
| `positions` | `usePosition` | Buy/sell panel + position card read/write per user + mint |
| `leaderboard_entries` | `getLeaderboard` | Read-only; seeded by migration |

### About auth & RLS

We don't use Supabase Auth — identity comes from Privy (`user.id`, a
`did:privy:…` string). The migration enables Row Level Security with
permissive policies so the browser anon key can read and write. **Fine for a
demo.** Before production, verify Privy JWTs in an Edge Function or route
all writes through your own API.

### Schema changes

Schema lives as plain SQL under `supabase/migrations/`. Add new files with a
timestamp prefix (e.g. `20260623000000_add_indexes.sql`) and run them in the
SQL editor. Once you wire up the Supabase CLI you can switch to `supabase db
push`.

## BirdEye

Real-time token data (trending list, prices, OHLCV, trade history, holders)
comes from BirdEye Data Services. The API key is **server-only**:

1. Sign up at [bds.birdeye.so](https://bds.birdeye.so) (free Standard tier:
   30 000 compute units / month, 1 rps).
2. Generate an API key in the dashboard.
3. Add it to `.env.local` (no `NEXT_PUBLIC_` prefix):
   ```env
   BIRDEYE_API_KEY=your_key_here
   ```
4. Restart `pnpm dev`. The browser never sees the key — all calls go through
   `/api/birdeye/*` routes in `src/app/api/birdeye/`.

When BirdEye is offline or rate-limited, consumers fall back to deterministic
mocks in `src/lib/mock/`.

## Alchemy (Solana Devnet RPC)

Used for on-chain SOL balance reads and devnet airdrop requests — not for
mock trade fills.

1. Create an app at [alchemy.com](https://www.alchemy.com/) → **Solana
   Devnet**.
2. Copy the HTTPS RPC URL into `.env.local`:
   ```env
   NEXT_PUBLIC_ALCHEMY_SOLANA_DEVNET_URL=https://solana-devnet.g.alchemy.com/v2/...
   ```
3. Restart `pnpm dev`. `useSolBalance` and the wallet menu airdrop button use
   `src/lib/solana/rpc.ts`, which prefers Alchemy on devnet and falls back to
   the public cluster endpoint.

## Mock trading

The trade panel simulates spot buys and sells for demo purposes:

- **Demo USDC** — starts at $1 250 per Privy DID, stored in localStorage
  (`useMockBalance`).
- **Positions** — weighted-average entry; partial sells reduce size, full
  sells delete the row. Persisted to `public.positions` when Supabase is
  configured (`usePosition`, `mock-trade.ts`).
- **Prices** — BirdEye spot price (or mock). Wallet is on **Solana devnet**;
  token prices may reflect mainnet market data. This mismatch is intentional
  for the take-home demo.

Trading is gated behind Privy sign-in on `/trade/[mint]`.

## Project layout

```
src/
├── app/
│   ├── page.tsx                 # Landing
│   ├── leaderboard/page.tsx     # Leaderboard
│   ├── trade/[mint]/page.tsx    # Trade terminal
│   └── api/birdeye/             # Server proxies (OHLCV, trades, holders)
├── components/
│   ├── landing/                 # Hero, features, CTA
│   ├── trade/                   # Chart, panel, position card, feeds
│   ├── leaderboard/             # Table + period switcher
│   ├── auth/                    # Sign-in button, wallet menu
│   └── layout/                  # Navbar, footer, page shell
└── lib/
    ├── supabase/                # Client + generated types
    ├── solana/                  # RPC helpers, devnet airdrop
    ├── mock/                    # Deterministic fallbacks
    ├── mock-trade.ts            # Buy/sell sizing math
    ├── use-position.ts          # Position read/write
    ├── use-watchlist.ts         # Watchlist sync
    ├── use-synced-user.ts       # Privy → Supabase profile
    ├── use-mock-balance.ts      # Demo USDC balance
    ├── use-sol-balance.ts       # On-chain SOL polling
    ├── tokens.ts                # Trending + token overview
    └── leaderboard.ts           # Leaderboard fetch + fallback
supabase/migrations/             # SQL schema + seed
public/brand/                    # Logo, promo video, screenshots
```

## Deployment

Not deployed yet. To ship a live preview on Vercel:

1. Push the repo to GitHub.
2. Import the project in [vercel.com/new](https://vercel.com/new).
3. Add the same environment variables from `.env.local` in **Project
   Settings → Environment Variables**.
4. Deploy. `pnpm build` must pass locally first.

BirdEye and Supabase keys stay server-side or in env vars — never commit
`.env.local`.

## Known limitations (demo scope)

- No on-chain swap execution (Jupiter label is cosmetic).
- No TradingView Advanced Charts widget (`lightweight-charts` instead).
- Leaderboard data is seeded / read-only — not driven by mock trades.
- Supabase RLS is permissive; not production-hardened.
- Apple Sign-In not configured (Google + email only).
