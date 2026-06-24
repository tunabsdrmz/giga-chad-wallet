import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { TokenTicker } from "@/components/token/TokenTicker";
import { MobileTrendingStrip } from "@/components/trade/MobileTrendingStrip";
import { TrendingList } from "@/components/trade/TrendingList";
import { TokenHeader } from "@/components/trade/TokenHeader";
import { PriceChart } from "@/components/trade/PriceChart";
import { ActivityPanel } from "@/components/trade/ActivityPanel";
import { TradeSidebar } from "@/components/trade/TradeSidebar";
import { getTokenByMint, getTrending, getStaticMints } from "@/lib/tokens";

export function generateStaticParams() {
  return getStaticMints().map((mint) => ({ mint }));
}

export default async function TradeTokenPage({
  params,
}: {
  params: Promise<{ mint: string }>;
}) {
  const { mint } = await params;
  const [token, trending] = await Promise.all([
    getTokenByMint(mint),
    getTrending(20),
  ]);
  if (!token) notFound();

  return (
    <>
      <Navbar variant="trade" />
      {/* Below lg, MobileTrendingStrip replaces the marquee ticker */}
      <TokenTicker direction="left" tokens={trending} className="hidden lg:block" />
      <main className="relative flex-1 overflow-x-clip">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px] sm:h-96 sm:w-160 sm:blur-[120px]" />

        <MobileTrendingStrip tokens={trending} activeMint={token.mint} />

        <div
          className={[
            "relative grid grid-cols-1",
            "lg:h-[calc(100dvh-6.6rem)] lg:overflow-hidden",
            "lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)_minmax(300px,360px)]",
            "xl:grid-cols-[280px_minmax(0,1fr)_380px]",
            "2xl:grid-cols-[300px_minmax(0,1fr)_400px]",
          ].join(" ")}
        >
          <aside className="hidden min-h-0 border-r border-white/8 bg-card/20 lg:flex">
            <TrendingList tokens={trending} activeMint={token.mint} />
          </aside>

          <section className="flex min-h-0 min-w-0 flex-col">
            <TokenHeader token={token} />

            {/* Mobile / tablet: trade panel sits under the header for quick access */}
            <div className="border-b border-white/8 bg-card/20 lg:hidden">
              <TradeSidebar token={token} />
            </div>

            <div className="h-[min(42vh,400px)] min-h-[240px] p-2 sm:min-h-[280px] sm:p-3 lg:h-auto lg:min-h-0 lg:flex-1">
              <PriceChart token={token} />
            </div>

            <div className="min-h-[260px] h-[min(38vh,360px)] border-t border-white/8 bg-card/20 sm:min-h-[280px] lg:h-[40%] lg:min-h-[220px]">
              <ActivityPanel token={token} />
            </div>
          </section>

          <aside className="hidden min-h-0 overflow-y-auto border-white/8 bg-card/20 lg:block lg:border-l">
            <TradeSidebar token={token} />
          </aside>
        </div>
      </main>
    </>
  );
}
