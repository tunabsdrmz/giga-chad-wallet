import Link from "next/link";
import { SignInButton } from "@/components/auth/SignInButton";
import { LandingLoginButton } from "@/components/auth/LandingLoginButton";
import { LogoMark } from "@/components/brand/Logo";
import { NavbarStoreBadges } from "@/components/layout/NavbarStoreBadges";
import { TradeSearchBar } from "@/components/trade/TradeSearchBar";
import { BRAND } from "@/lib/constants";

export type NavbarVariant = "landing" | "trade";

export function Navbar({ variant = "landing" }: { variant?: NavbarVariant }) {
  if (variant === "landing") {
    return <LandingNavbar />;
  }

  return <TradeNavbar />;
}

/** fomo.family landing header — desktop only, transparent, logo + store badges + Login. */
function LandingNavbar() {
  return (
    <header className="landing-nav absolute inset-x-0 top-0 z-50 hidden h-13 items-center justify-between bg-transparent px-5 pt-3 min-[800px]:flex">
      <Link
        href="/"
        className="inline-flex items-center gap-2.5 text-foreground"
        aria-label={`${BRAND.name} home`}
      >
        <LogoMark size="nav" className="h-11 w-11" />
        <span className="text-xl font-extrabold tracking-tight lowercase">
          {BRAND.wordmark}
          <span className="text-primary">.</span>
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <NavbarStoreBadges />
        <LandingLoginButton />
      </div>
    </header>
  );
}

/** fomo trade header — icon, search, wallet/sign-in only. */
function TradeNavbar() {
  return (
    <header className="trade-nav sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[125rem] items-center gap-3 px-4 sm:h-[var(--trade-nav-h)] lg:px-5">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center"
          aria-label={`${BRAND.name} home`}
        >
          <LogoMark size="nav" className="h-9 w-9 sm:h-10 sm:w-10" />
        </Link>

        <div className="flex min-w-0 flex-1 justify-center px-2 sm:px-4">
          <TradeSearchBar className="max-w-xl" />
        </div>

        <SignInButton className="shrink-0" />
      </div>
    </header>
  );
}
