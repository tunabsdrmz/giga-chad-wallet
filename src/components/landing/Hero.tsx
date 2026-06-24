import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreBadges } from "@/components/layout/StoreBadges";
import { PageContainer } from "@/components/layout/PageContainer";
import { LogoMark } from "@/components/brand/Logo";
import { PhoneMockup } from "@/components/brand/PhoneMockup";
import { BRAND, BRAND_ASSETS } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute left-1/2 -top-32 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] sm:-top-48 sm:h-160 sm:w-160 sm:blur-[140px]" />

      <PageContainer className="relative py-16 sm:py-20 lg:py-24 xl:py-28 2xl:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10 xl:gap-16 2xl:gap-20">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center lg:mx-0 lg:max-w-none lg:items-start lg:text-left">
            <LogoMark size="xl" className="mb-5 sm:mb-6" />

            <h1 className="text-[clamp(2.75rem,8vw,6rem)] font-extrabold leading-[0.95] tracking-tight lowercase">
              {BRAND.wordmark}
              <span className="text-primary">.</span>
            </h1>

            <p className="mt-4 text-[clamp(1.25rem,3.5vw,2rem)] font-semibold leading-snug sm:mt-6">
              {BRAND.tagline}
            </p>

            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg lg:max-w-lg xl:max-w-xl">
              {BRAND.subtitle}
            </p>

            <div className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:gap-4 lg:justify-start">
              <Button
                size="lg"
                nativeButton={false}
                className="h-12 w-full px-7 text-base sm:w-auto"
                render={<Link href="/trade" />}
              >
                Start trading
                <ArrowRight className="ml-1" size={18} />
              </Button>
              <StoreBadges className="sm:shrink-0" />
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PhoneMockup
              src={BRAND_ASSETS.promoVideo}
              poster={BRAND_ASSETS.appScreens.token}
              isVideo
              className="w-[min(100%,220px)] rotate-3 sm:w-[240px] md:w-[260px] lg:w-[280px] xl:w-[300px] 2xl:w-[340px] lg:rotate-6"
            />
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
