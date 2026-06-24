import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";
import { BRAND_ASSETS } from "@/lib/constants";

const FEATURES = [
  {
    src: BRAND_ASSETS.appScreens.token,
    eyebrow: "Fast trading",
    title: "Buy trending tokens 24/7",
  },
  {
    src: BRAND_ASSETS.appScreens.discover,
    eyebrow: "Live feed",
    title: "Watch large trades land in real time",
  },
  {
    src: BRAND_ASSETS.appScreens.kol,
    eyebrow: "Follow the pros",
    title: "Mirror top Solana traders",
  },
  {
    src: BRAND_ASSETS.appScreens.launch,
    eyebrow: "One-tap launch",
    title: "Turn memes into coins instantly",
  },
  {
    src: BRAND_ASSETS.appScreens.portfolio,
    eyebrow: "Portfolio",
    title: "Holdings, PnL, rewards \u2014 all in one place",
  },
  {
    src: BRAND_ASSETS.appScreens.search,
    eyebrow: "Get the alpha",
    title: "Surface tokens before they trend",
  },
] as const;

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 xl:py-28">
      <PageContainer>
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary sm:text-sm">
            Never miss out again
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-tight">
            The only social-first trading app
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {FEATURES.map((feat) => (
            <article
              key={feat.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/40 transition-colors hover:border-primary/40 hover:bg-card/70"
            >
              <div className="px-4 pt-5 sm:px-6 sm:pt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {feat.eyebrow}
                </p>
                <h3 className="mt-2 text-base font-semibold leading-snug sm:text-lg">
                  {feat.title}
                </h3>
              </div>
              <div className="relative mt-3 overflow-hidden sm:mt-4">
                <Image
                  src={feat.src}
                  alt={feat.title}
                  width={472}
                  height={1024}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02] sm:group-hover:scale-[1.03]"
                />
              </div>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
