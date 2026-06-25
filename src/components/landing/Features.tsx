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
    <section
      id="features"
      className="flex w-full max-w-[125rem] flex-col gap-[3.25rem] self-stretch px-3 pt-8 min-[500px]:self-center min-[800px]:px-20 min-[800px]:py-2"
    >
      <div className="hidden w-full flex-col gap-3 px-8 min-[800px]:flex">
        <h2 className="text-[3.75rem] leading-[3.75rem] tracking-tighter text-[var(--landing-headline)]">
          never miss out again
        </h2>
        <p className="text-[1.75rem] leading-6 tracking-tight text-[var(--landing-subtle)]">
          the only social-first trading app
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 min-[800px]:grid-cols-3 min-[800px]:gap-6">
        {FEATURES.map((feat) => (
          <FeatureCard key={feat.title} {...feat} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({
  src,
  eyebrow,
  title,
}: {
  src: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <article className="landing-card landing-feature-card group min-w-0 overflow-hidden rounded-[25px]">
      <div className="landing-feature-card-copy">
        <p className="landing-feature-card-eyebrow">{eyebrow}</p>
        <h3 className="landing-feature-card-title">{title}</h3>
      </div>

      <div className="landing-feature-card-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          loading="lazy"
          className="landing-feature-card-image"
        />
      </div>
    </article>
  );
}
