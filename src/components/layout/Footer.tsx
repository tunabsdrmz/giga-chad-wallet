import Link from "next/link";
import { StoreBadges } from "@/components/layout/StoreBadges";
import { PageContainer } from "@/components/layout/PageContainer";
import { Logo } from "@/components/brand/Logo";
import { BRAND, NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Footer({ variant = "default" }: { variant?: "default" | "landing" }) {
  const isLanding = variant === "landing";

  if (isLanding) {
    return (
      <footer className="px-10 pb-12 pt-8">
        <PageContainer className="flex max-w-none flex-col items-start justify-between gap-10 px-0 sm:px-0 lg:flex-row lg:px-0 2xl:px-0 [@media(min-width:1920px)]:px-0">
          <div className="flex w-full flex-col gap-6 lg:max-w-sm">
            <div className="flex flex-col gap-3">
              <Logo size="md" />
              <p className="text-2xl leading-7 tracking-tighter text-muted-foreground">
                {BRAND.subtitle}
              </p>
            </div>
            <StoreBadges
              size="sm"
              variant="glass"
              className="max-w-xs"
              stackOnMobile
            />
            <p className="hidden text-sm text-muted-foreground/70 lg:block">
              © {new Date().getFullYear()} {BRAND.name}. Demo project — not financial
              advice.
            </p>
          </div>

          <div className="flex w-full flex-col items-start gap-8 sm:flex-row lg:w-auto lg:gap-2">
            <FooterColumn title="Product" links={productLinks()} landing />
            <FooterColumn title="Community" links={communityLinks()} landing />
          </div>

          <p className="text-sm text-muted-foreground/70 lg:hidden">
            © {new Date().getFullYear()} {BRAND.name}. Demo project — not financial
            advice.
          </p>
        </PageContainer>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/5 bg-card/30">
      <PageContainer className="flex flex-col items-center gap-10 py-12 text-center sm:py-14 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:text-left">
        <div className="flex w-full max-w-sm flex-col items-center lg:items-start">
          <Logo size="md" />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {BRAND.subtitle}
          </p>
          <StoreBadges
            size="sm"
            className="mt-5 w-full max-w-[17rem] justify-center lg:max-w-xs lg:justify-start"
            stackOnMobile
          />
        </div>

        <div className="flex w-full justify-center lg:w-auto lg:justify-end">
          <div className="grid grid-cols-2 gap-x-10 gap-y-8 text-left sm:gap-x-16 md:gap-x-24">
            <FooterColumn title="Product" links={productLinks()} />
            <FooterColumn title="Community" links={communityLinks()} />
          </div>
        </div>
      </PageContainer>

      <div className="border-t border-white/5 py-5 sm:py-6">
        <PageContainer className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BRAND.name}. Demo project — not financial
          advice.
        </PageContainer>
      </div>
    </footer>
  );
}

function productLinks() {
  return NAV_LINKS.map((l) => ({ label: l.label, href: l.href }));
}

function communityLinks() {
  return [
    { label: "X / Twitter", href: SOCIAL_LINKS.twitter },
    { label: "Discord", href: SOCIAL_LINKS.discord },
    { label: "Telegram", href: SOCIAL_LINKS.telegram },
  ];
}

function FooterColumn({
  title,
  links,
  landing = false,
}: {
  title: string;
  links: { label: string; href: string }[];
  landing?: boolean;
}) {
  return (
    <div className={cn(landing ? "min-w-40" : "min-w-[6.5rem] sm:min-w-[7.5rem]")}>
      <h4
        className={cn(
          landing
            ? "mb-2 font-mono text-sm text-muted-foreground/70"
            : "mb-3 text-sm font-semibold sm:mb-4",
        )}
      >
        {landing ? title.toUpperCase() : title}
      </h4>
      <ul className={cn(landing ? "space-y-2" : "space-y-2.5 sm:space-y-3")}>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className={cn(
                "text-sm transition-colors",
                landing
                  ? "text-foreground/90 hover:text-muted-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
