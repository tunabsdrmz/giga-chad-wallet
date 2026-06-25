import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { CrossDevice } from "@/components/landing/CrossDevice";
import { Features } from "@/components/landing/Features";
import { FinalCta } from "@/components/landing/FinalCta";
import { LandingShell } from "@/components/landing/LandingShell";
import { TokenTicker } from "@/components/token/TokenTicker";
import { getTrending } from "@/lib/tokens";

export default async function Home() {
  const trending = await getTrending(20);

  return (
    <LandingShell>
      <main className="flex w-full flex-1 flex-col items-center">
        <Hero
          topChrome={
            <div className="landing-top-chrome relative shrink-0">
              <Navbar variant="landing" />
              <TokenTicker
                direction="left"
                tokens={trending}
                variant="landing"
                className="relative z-40"
              />
            </div>
          }
        />
        <CrossDevice />
        <Features />
        <FinalCta />
      </main>
      <TokenTicker direction="right" tokens={trending} variant="landing" />
      <Footer variant="landing" />
    </LandingShell>
  );
}
