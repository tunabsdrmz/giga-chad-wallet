import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";

type LandingButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  external?: boolean;
};

export function LandingButton({
  href,
  children,
  variant = "primary",
  className,
  external,
}: LandingButtonProps) {
  const classes = cn(
    "landing-glass-btn group h-11 w-full min-w-[12.5rem] px-6 py-3 sm:w-auto",
    variant === "primary" ? "landing-glass-btn-primary" : "landing-glass-btn-secondary",
    className,
  );

  const content = (
    <>
      {variant === "secondary" && (
        <span className="flex items-center overflow-hidden opacity-0 transition-all duration-150 ease-out group-hover:mr-2 group-hover:w-5 group-hover:opacity-100">
          <Download
            className="size-5 shrink-0"
            aria-hidden
          />
        </span>
      )}
      <span>{children}</span>
      {variant === "primary" && (
        <span className="flex items-center overflow-hidden opacity-0 transition-all duration-150 ease-out group-hover:ml-2 group-hover:w-5 group-hover:opacity-100">
          <ArrowRight
            className="size-5 shrink-0"
            aria-hidden
          />
        </span>
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={classes}>
      {content}
    </Link>
  );
}
