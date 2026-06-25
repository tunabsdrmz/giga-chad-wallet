import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { TradeShell } from "@/components/trade/TradeShell";

export default function NotFound() {
  return (
    <TradeShell>
      <Navbar variant="trade" />
      <NotFoundContent />
      <Footer />
    </TradeShell>
  );
}
