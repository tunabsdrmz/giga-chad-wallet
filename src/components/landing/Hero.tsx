import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { PhoneMockup } from "@/components/brand/PhoneMockup";
import { HeroSpaceBackground } from "@/components/landing/HeroSpaceBackground";
import { LandingButton } from "@/components/landing/LandingButton";
import { StoreBadges } from "@/components/layout/StoreBadges";
import { BRAND, BRAND_ASSETS } from "@/lib/constants";

export function Hero({ topChrome }: { topChrome?: ReactNode }) {
  return (
    <section className="landing-space-bg relative flex w-full self-stretch flex-col items-center overflow-hidden">
      <HeroSpaceBackground />

      {topChrome ? (
        <div className="relative z-20 w-full self-stretch">{topChrome}</div>
      ) : null}

      <div className="relative z-10 flex w-full flex-col items-center gap-5 px-6 pt-10 text-center min-[800px]:gap-8 min-[800px]:pt-20">
        <LogoMark
          size="xl"
          className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
        />

        <div className="relative flex max-w-3xl flex-col gap-2">
          <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold leading-none tracking-tighter lowercase text-[var(--landing-headline)] drop-shadow-[0_2px_28px_rgba(6,5,16,0.95)]">
            {BRAND.wordmark}
            <span className="text-primary">.</span>
          </h1>
          <p className="text-2xl font-bold leading-6 tracking-tighter text-[var(--landing-headline)] drop-shadow-[0_2px_24px_rgba(6,5,16,0.92)] sm:text-[2.5rem] sm:leading-[3rem]">
            {BRAND.tagline}
          </p>
          <p className="text-base tracking-tight text-[var(--landing-subtle)] drop-shadow-[0_2px_20px_rgba(6,5,16,0.9)] sm:text-[1.375rem] sm:leading-6">
            {BRAND.subtitle}
          </p>
        </div>

        <div className="flex w-full max-w-md flex-col items-stretch gap-2 sm:max-w-none sm:flex-row sm:justify-center sm:gap-3">
          <LandingButton
            href="/trade"
            variant="primary">
            Start trading
          </LandingButton>
          <div className="hidden sm:block">
            <StoreBadges
              variant="glass"
              stackOnMobile={false}
            />
          </div>
        </div>

        <div className="flex w-full justify-center sm:hidden">
          <StoreBadges variant="glass" />
        </div>
      </div>

      {/* fomo: in-flow + -mt-16 (mobile) / -mt-20 + h-130 (desktop) — overlaps, no empty padding slot */}
      <PhoneMockup
        src={BRAND_ASSETS.promoVideo}
        poster={BRAND_ASSETS.appScreens.token}
        isVideo
        variant="landing"
        className="landing-hero-promo pointer-events-none relative z-[5] mt-16 w-[min(92vw,380px)] min-[800px]:mt-20 min-[800px]:h-[32.5rem] min-[800px]:w-auto"
      />
    </section>
  );
}
