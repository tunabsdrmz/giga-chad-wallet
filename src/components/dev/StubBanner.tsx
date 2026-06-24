import { AlertTriangle } from "lucide-react";
import { isBirdEyeConfigured } from "@/lib/birdeye/client";

/**
 * Tiny dev-only banner listing services that haven't been configured
 * yet (Privy, Supabase, BirdEye, Alchemy). Hidden in production
 * builds. Server-rendered so it doesn't ship to the client when there
 * are no missing keys.
 */
export function StubBanner() {
  if (process.env.NODE_ENV === "production") return null;

  const missing = collectMissing();
  if (missing.length === 0) return null;

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-center text-xs text-amber-200">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
        <AlertTriangle size={13} className="shrink-0" />
        <span>
          <span className="font-semibold">Stub mode:</span> {missing.join(", ")} not
          configured · falling back to mock data
        </span>
      </div>
    </div>
  );
}

function collectMissing(): string[] {
  const out: string[] = [];
  // Inline env reads keep this a server-only file and avoid a circular
  // import on the more elaborate `is…Configured` flags from each lib.
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID?.trim()) out.push("Privy");
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  ) {
    out.push("Supabase");
  }
  if (!isBirdEyeConfigured) out.push("BirdEye");
  if (!process.env.NEXT_PUBLIC_ALCHEMY_SOLANA_DEVNET_URL?.trim()) out.push("Alchemy");
  return out;
}
