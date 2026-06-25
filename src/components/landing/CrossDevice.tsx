import { BRAND_ASSETS } from "@/lib/constants";

export function CrossDevice() {
  return (
    <section className="w-full self-stretch z-500">
      {/* Desktop */}
      <div className="hidden w-full flex-col items-center gap-3 px-8 py-10 text-center min-[800px]:flex">
        <p className="font-mono text-sm font-bold text-primary">NOW AVAILABLE ON WEB</p>

        <h2 className="w-full max-w-4xl text-center text-[3.75rem] leading-[3.5rem] tracking-tight text-[var(--landing-headline)]">
          trade from anywhere.
          <br />
          never lose a beat.
        </h2>

        <p className="w-full max-w-2xl text-center text-[1.375rem] tracking-tight text-[var(--landing-subtle)]">
          Open a trade on your phone, close it on your desktop — all in one app.
        </p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BRAND_ASSETS.landing.crossDevice}
          alt="ChadWallet trading dashboard on desktop"
          loading="lazy"
          className="landing-cross-device-img mx-auto mt-2"
        />
      </div>

      {/* Mobile */}
      <div className="relative w-full text-center min-[800px]:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BRAND_ASSETS.landing.crossDevice}
          alt="ChadWallet trading dashboard on desktop"
          loading="lazy"
          className="landing-cross-device-img mx-auto"
        />

        <div className="absolute inset-x-0 bottom-0 flex w-full flex-col items-center gap-3 px-8 pb-4 text-center">
          <h2 className="w-full max-w-lg text-center text-[2.25rem] leading-9 tracking-tighter text-[var(--landing-headline)]">
            trade from anywhere.
            <br />
            never lose a beat.
          </h2>
          <p className="w-full max-w-md text-center leading-5 tracking-tight text-muted-foreground">
            Pick up a trade on your phone, close it on your desktop — all in one app.
          </p>
        </div>
      </div>
    </section>
  );
}
