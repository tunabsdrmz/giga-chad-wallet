/** Shared layout classes for `TradeTerminal` and loading skeleton. */
export const TRADE_TERMINAL_GRID_CLASS = [
  "trade-terminal-grid relative grid grid-cols-1 overflow-hidden",
  "lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)_minmax(300px,380px)]",
  "lg:grid-rows-[auto_1fr_minmax(220px,30%)]",
  "xl:grid-cols-[280px_minmax(0,1fr)_400px]",
  "[grid-template-areas:'header'_'chart'_'activity'_'sidebar']",
  "lg:[grid-template-areas:'leaderboard_header_sidebar'_'leaderboard_chart_sidebar'_'leaderboard_activity_sidebar']",
].join(" ");
