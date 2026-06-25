import { LogoMark } from "@/components/brand/Logo";
import { LandingButton } from "@/components/landing/LandingButton";
import { StoreBadges } from "@/components/layout/StoreBadges";

export function FinalCta() {
  return (
    <section id="download" className="relative flex w-full self-stretch items-center justify-center py-24 lg:py-32">
      <div className="landing-legends-bg absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[#060510] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#060510] to-transparent"
        aria-hidden
      />

      <div className="relative z-10 flex w-[80vw] max-w-4xl flex-col items-center px-8">
        <div className="relative flex aspect-square w-full max-w-lg flex-col items-center justify-center">
          <div className="relative z-10 flex flex-col items-center gap-3 text-center lg:gap-6">
            <LogoMark size="xl" className="mb-2" />
            <h2 className="text-[2.5rem] leading-10 tracking-tighter text-[var(--landing-headline)] lg:text-[3.75rem] lg:leading-[3.75rem]">
              A trading app
              <br />
              for the rest of us
            </h2>
            <p className="text-base tracking-tight text-muted-foreground lg:text-[1.375rem] lg:leading-7">
              Join 500,000+ traders making their name on ChadWallet.
            </p>
            <div className="flex w-full flex-col items-stretch gap-2 pt-4 sm:flex-row sm:justify-center sm:gap-3 lg:pt-6">
              <LandingButton href="/trade" variant="primary">
                Start trading
              </LandingButton>
              <div className="hidden sm:block">
                <StoreBadges variant="glass" stackOnMobile={false} />
              </div>
            </div>
            <div className="flex w-full justify-center pt-2 sm:hidden">
              <StoreBadges variant="glass" />
            </div>
          </div>

          <div
            className="landing-orbit-inner pointer-events-none absolute inset-0 z-[1] m-auto size-[35vw] max-w-[18rem] rounded-full border border-dashed border-white/10 lg:max-w-[14rem]"
            aria-hidden
          />
          <div
            className="landing-orbit-outer pointer-events-none absolute inset-0 z-[1] m-auto size-[55vw] max-w-[28rem] rounded-full border border-dashed border-white/10 lg:max-w-[22rem]"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
