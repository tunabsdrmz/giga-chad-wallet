"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Client-side helper for `TokenAvatar`: tries to render the token's
 * real logo. If the image errors (404 / blocked CORS / dead host) we
 * hide the `<Image>` and let the parent's gradient + initials show
 * through.
 */
export function AvatarImage({
  src,
  size,
  alt,
}: {
  src: string;
  size: number;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <Image
      src={src}
      width={size}
      height={size}
      alt={alt}
      className="h-full w-full object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}
