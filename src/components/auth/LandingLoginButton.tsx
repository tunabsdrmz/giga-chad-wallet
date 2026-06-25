"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { isPrivyConfigured } from "@/lib/privy-config";
import { cn } from "@/lib/utils";

const loginBtn =
  "inline-flex h-11 items-center justify-center rounded-lg bg-[#12111a] px-5 text-sm font-bold ring-1 ring-[rgba(203,208,235,0.1)] transition hover:bg-[#12111a]/80";

/** fomo.family-style Login control for the landing navbar. */
export function LandingLoginButton({ className }: { className?: string }) {
  if (!isPrivyConfigured) {
    return (
      <Link
        href="/trade"
        className={cn(loginBtn, className)}>
        Login
      </Link>
    );
  }

  return <ActiveLandingLoginButton className={className} />;
}

function ActiveLandingLoginButton({ className }: { className?: string }) {
  const { ready, authenticated, login } = usePrivy();

  if (!ready) {
    return (
      <button
        type="button"
        disabled
        className={cn(loginBtn, "opacity-60", className)}>
        Login
      </button>
    );
  }

  if (authenticated) {
    return (
      <Link
        href="/trade"
        className={cn(loginBtn, className)}>
        Login
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(loginBtn, className)}
      onClick={() => login()}>
      Login
    </button>
  );
}
