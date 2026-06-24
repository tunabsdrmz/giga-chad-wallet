import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@/components/auth/SignInButton";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { PageContainer } from "@/components/layout/PageContainer";
import { Logo } from "@/components/brand/Logo";
import { NAV_LINKS } from "@/lib/constants";

export type NavbarVariant = "landing" | "trade";

export function Navbar({ variant = "landing" }: { variant?: NavbarVariant }) {
  const isTrade = variant === "trade";

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <PageContainer tight className="flex h-14 items-center justify-between sm:h-16">
        <Logo size="sm" />

        <div className="hidden items-center gap-6 lg:gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isTrade ? (
            <SignInButton />
          ) : (
            <Button
              nativeButton={false}
              render={<Link href="/trade" />}
              className="hidden sm:inline-flex"
              size="sm"
            >
              Start trading
            </Button>
          )}
          <MobileMenu />
        </div>
      </PageContainer>
    </header>
  );
}
