import Link from "next/link";
import { StoreBadges } from "@/components/layout/StoreBadges";
import { PageContainer } from "@/components/layout/PageContainer";
import { Logo } from "@/components/brand/Logo";
import { BRAND, NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
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
            <FooterColumn
              title="Product"
              links={NAV_LINKS.map((l) => ({ label: l.label, href: l.href }))}
            />
            <FooterColumn
              title="Community"
              links={[
                { label: "X / Twitter", href: SOCIAL_LINKS.twitter },
                { label: "Discord", href: SOCIAL_LINKS.discord },
                { label: "Telegram", href: SOCIAL_LINKS.telegram },
              ]}
            />
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

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="min-w-[6.5rem] sm:min-w-[7.5rem]">
      <h4 className="mb-3 text-sm font-semibold sm:mb-4">{title}</h4>
      <ul className="space-y-2.5 sm:space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
