-- Seed the leaderboard with demo entries for the 24h / 7d / 30d / all
-- windows so the period switcher on /leaderboard has something to show
-- before real trading data lands.
--
-- Safe to re-run: we clear all four periods first and re-insert.

delete from public.leaderboard_entries
where period in ('24h', '7d', '30d', 'all');

insert into public.leaderboard_entries
  (rank, display_name, avatar_url, total_pnl_usd, win_rate, trades_count, period)
values
  -- 24h ------------------------------------------------------------------
  (1,  'GigaChad',        null,  8420,  82.5, 38, '24h'),
  (2,  'roman.sol',       null,  6210,  78.1, 31, '24h'),
  (3,  'jijo_exe',        null,  4780,  74.6, 26, '24h'),
  (4,  'cupsey',          null,  3210,  70.0, 22, '24h'),
  (5,  'Zrool',           null,  2440,  66.3, 19, '24h'),
  (6,  'Smithii',         null,  1880,  63.1, 17, '24h'),
  (7,  'Esee',            null,  1490,  60.4, 15, '24h'),
  (8,  'JaredFromSubway', null,  1270,  58.0, 14, '24h'),
  (9,  '360blazeit',      null,   990,  55.5, 12, '24h'),
  (10, 'wojakNoScope',    null,   720,  52.3, 10, '24h'),

  -- 7d -------------------------------------------------------------------
  (1,  'GigaChad',        null, 41200,  80.4, 112, '7d'),
  (2,  'roman.sol',       null, 28640,  74.8,  92, '7d'),
  (3,  'jijo_exe',        null, 19850,  72.0,  75, '7d'),
  (4,  'cupsey',          null, 13320,  67.2,  58, '7d'),
  (5,  'Zrool',           null,  9540,  63.6,  47, '7d'),
  (6,  'Smithii',         null,  7110,  61.5,  41, '7d'),
  (7,  'Esee',            null,  5920,  59.8,  36, '7d'),
  (8,  'JaredFromSubway', null,  4940,  57.9,  33, '7d'),
  (9,  '360blazeit',      null,  3880,  55.6,  28, '7d'),
  (10, 'wojakNoScope',    null,  2960,  53.9,  24, '7d'),

  -- 30d ------------------------------------------------------------------
  (1,  'GigaChad',        null, 142300, 78.2, 312, '30d'),
  (2,  'roman.sol',       null,  92840, 71.5, 248, '30d'),
  (3,  'jijo_exe',        null,  64120, 69.8, 198, '30d'),
  (4,  'cupsey',          null,  41300, 65.0, 142, '30d'),
  (5,  'Zrool',           null,  28900, 62.1, 121, '30d'),
  (6,  'Smithii',         null,  21450, 60.7, 109, '30d'),
  (7,  'Esee',            null,  18120, 58.9,  94, '30d'),
  (8,  'JaredFromSubway', null,  15440, 57.2,  88, '30d'),
  (9,  '360blazeit',      null,  12100, 55.0,  72, '30d'),
  (10, 'wojakNoScope',    null,   9320, 53.4,  61, '30d'),

  -- all-time -------------------------------------------------------------
  (1,  'GigaChad',        null, 612400, 74.8,  1380, 'all'),
  (2,  'roman.sol',       null, 412930, 70.2,  1124, 'all'),
  (3,  'jijo_exe',        null, 281450, 68.5,   926, 'all'),
  (4,  'cupsey',          null, 184220, 64.1,   712, 'all'),
  (5,  'Zrool',           null, 127880, 61.4,   598, 'all'),
  (6,  'Smithii',         null,  98330, 59.6,   521, 'all'),
  (7,  'Esee',            null,  79740, 58.2,   468, 'all'),
  (8,  'JaredFromSubway', null,  68490, 56.7,   432, 'all'),
  (9,  '360blazeit',      null,  52210, 54.5,   361, 'all'),
  (10, 'wojakNoScope',    null,  39880, 52.8,   301, 'all');
