import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { TradeTerminal } from "@/components/trade/TradeTerminal";
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
  const trending = await getTrending(20);
  const token = await getTokenByMint(mint, trending);
  if (!token) notFound();

  return (
    <>
      <Navbar variant="trade" />
      <main className="relative flex-1 overflow-x-clip">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px] sm:h-96 sm:w-160 sm:blur-[120px]" />
        <TradeTerminal initialMint={token.mint} trending={trending} />
      </main>
    </>
  );
}
