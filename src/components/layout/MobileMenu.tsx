"use client";

import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Hamburger menu shown on screens narrower than `md`. Slides in from
 * the right with full-height navigation + a "Start trading" CTA.
 */
export function MobileMenu({ className }: { className?: string }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        render={
          <button
            type="button"
            aria-label="Open menu"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground",
              "hover:bg-white/5 hover:text-foreground md:hidden",
              className,
            )}
          >
            <Menu size={18} />
          </button>
        }
      />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 transition-opacity duration-200" />
        <Dialog.Popup
          className={cn(
            "fixed right-0 top-0 z-50 flex h-dvh w-72 max-w-[85vw] flex-col gap-1 border-l border-white/8 bg-background p-5 shadow-2xl",
            "data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full",
            "transition-transform duration-250 ease-out",
          )}
        >
          <div className="mb-2 flex items-center justify-between">
            <Dialog.Title className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Menu
            </Dialog.Title>
            <Dialog.Close
              render={
                <button
                  type="button"
                  aria-label="Close menu"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  <X size={16} />
                </button>
              }
            />
          </div>
          <Dialog.Description className="sr-only">
            Site navigation links
          </Dialog.Description>

          <nav className="mt-2 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Dialog.Close
                key={link.href}
                render={
                  <Link
                    href={link.href}
                    className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-white/5"
                  />
                }
              >
                {link.label}
              </Dialog.Close>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            <Dialog.Close
              render={
                <Button nativeButton={false} render={<Link href="/trade" />} className="w-full">
                  Start trading
                </Button>
              }
            />
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-foreground"
              >
                Twitter
              </a>
              <a
                href={SOCIAL_LINKS.discord}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-foreground"
              >
                Discord
              </a>
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-foreground"
              >
                Telegram
              </a>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
