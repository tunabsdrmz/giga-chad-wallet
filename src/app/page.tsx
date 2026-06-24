import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TokenTicker } from "@/components/token/TokenTicker";
import { Hero } from "@/components/landing/Hero";
import { CrossDevice } from "@/components/landing/CrossDevice";
import { Features } from "@/components/landing/Features";
import { FinalCta } from "@/components/landing/FinalCta";
import { getTrending } from "@/lib/tokens";

export default async function Home() {
  const trending = await getTrending(20);
  return (
    <>
      <Navbar />
      <TokenTicker direction="left" tokens={trending} />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <CrossDevice />
        <Features />
        <FinalCta />
      </main>
      <TokenTicker direction="right" tokens={trending} />
      <Footer />
    </>
  );
}
