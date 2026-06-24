import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreBadges } from "@/components/layout/StoreBadges";
import { PageContainer } from "@/components/layout/PageContainer";
import { LogoMark } from "@/components/brand/Logo";

export function FinalCta() {
  return (
    <section id="download" className="py-16 sm:py-20 lg:py-24 xl:py-28">
      <PageContainer>
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/10 px-4 py-14 text-center sm:rounded-3xl sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[100px] sm:h-md sm:w-md sm:blur-[120px]" />
          <DecorativeOrbits />

          <div className="relative mx-auto max-w-3xl">
            <LogoMark size="xl" className="mx-auto mb-5 sm:mb-6" />
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-tight">
              A trading app for the rest of us
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:mt-5 sm:text-lg">
              Join 500,000+ traders making their name on ChadWallet.
            </p>
            <div className="mx-auto mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <Button
                size="lg"
                nativeButton={false}
                className="h-12 w-full px-7 text-base sm:w-auto"
                render={<Link href="/trade" />}
              >
                Start trading
                <ArrowRight className="ml-1" size={18} />
              </Button>
              <StoreBadges className="sm:justify-center" />
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

function DecorativeOrbits() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <div className="absolute size-48 rounded-full border border-dashed border-white/10 sm:size-72 md:size-96" />
      <div className="absolute size-64 rounded-full border border-dashed border-white/10 sm:size-96 md:h-144 md:w-xl" />
      <div className="absolute size-80 rounded-full border border-dashed border-white/5 sm:size-128 md:h-208 md:w-208" />
    </div>
  );
}
