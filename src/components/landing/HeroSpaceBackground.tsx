/** fomo.family space-bg — clipped to hero bounds, top-anchored. */
export function HeroSpaceBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
      aria-hidden
    >
      {/* object-top keeps star clusters; inset-0 + cover prevents bleed into sections below */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/landing/space-bg.webp"
        alt=""
        fetchPriority="high"
        decoding="async"
        className="landing-space-drift h-full w-full object-cover object-top"
      />
    </div>
  );
}
