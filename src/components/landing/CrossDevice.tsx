import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";
import { BRAND_ASSETS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SHOWCASE = [
  { src: BRAND_ASSETS.appScreens.token, alt: "Token trading screen" },
  { src: BRAND_ASSETS.appScreens.discover, alt: "Discover feed" },
  { src: BRAND_ASSETS.appScreens.portfolio, alt: "Portfolio" },
  { src: BRAND_ASSETS.appScreens.kol, alt: "Top traders" },
] as const;

export function CrossDevice() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-28">
      <PageContainer>
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary sm:text-sm">
            Trade from anywhere
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-tight">
            Never lose a beat.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
            Open a trade on your phone, close it on your desktop. Live prices,
            real-time alerts and your portfolio always in sync.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 xs:grid-cols-2 sm:mt-14 sm:gap-5 md:gap-6 lg:grid-cols-4">
          {SHOWCASE.map((shot, i) => (
            <div
              key={shot.src}
              className={cn(
                "group overflow-hidden rounded-2xl border border-white/10 bg-card/40 transition-transform hover:-translate-y-1",
                i % 2 === 1 && "xs:translate-y-4 md:translate-y-6",
              )}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                width={472}
                height={1024}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="h-auto w-full"
              />
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
