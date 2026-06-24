import { cn } from "@/lib/utils";

/**
 * iPhone-shaped frame that wraps a video or image. The bezel is pure CSS so
 * it adapts to any width — pass `className` to control the size from outside.
 */
export function PhoneMockup({
  src,
  poster,
  alt,
  isVideo = false,
  className,
  screenClassName,
}: {
  src: string;
  poster?: string;
  alt?: string;
  isVideo?: boolean;
  className?: string;
  screenClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-9/19.5 w-[260px] rounded-[2.4rem]",
        "bg-zinc-900 p-[6px] ring-1 ring-white/10",
        "shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6),0_10px_30px_-12px_rgba(34,197,94,0.18)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-[2rem] bg-black",
          screenClassName,
        )}
      >
        {/* Dynamic island */}
        <div className="absolute left-1/2 top-2 z-10 h-[18px] w-[78px] -translate-x-1/2 rounded-full bg-black" />

        {isVideo ? (
          <video
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt ?? ""}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
