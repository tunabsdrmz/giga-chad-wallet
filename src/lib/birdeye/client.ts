import "server-only";

import type { BirdEyeChain, BirdEyeEnvelope } from "@/lib/birdeye/types";

const BASE_URL = "https://public-api.birdeye.so";
const DEFAULT_CHAIN: BirdEyeChain = "solana";

// Server-only so the key isn't bundled to the client. Falls back to the
// `NEXT_PUBLIC_` variant during the migration window — we'll log a
// warning so the user knows to rename it.
const KEY = (process.env.BIRDEYE_API_KEY ?? process.env.NEXT_PUBLIC_BIRDEYE_API_KEY ?? "").trim();

if (process.env.NEXT_PUBLIC_BIRDEYE_API_KEY && !process.env.BIRDEYE_API_KEY) {
  console.warn(
    "[birdeye] Using NEXT_PUBLIC_BIRDEYE_API_KEY — please rename to BIRDEYE_API_KEY " +
      "in .env.local so the key stays server-side.",
  );
}

/** True when the env contains a BirdEye API key. */
export const isBirdEyeConfigured: boolean = KEY.length > 0;

export interface BirdEyeFetchOptions {
  /** Path including `/defi/...` prefix. */
  path: string;
  /** Query params; values are stringified, undefined entries are dropped. */
  params?: Record<string, string | number | undefined>;
  /** Override the chain header (defaults to "solana"). */
  chain?: BirdEyeChain;
  /**
   * Next.js `fetch` revalidate in seconds.
   * @default 60
   */
  revalidate?: number;
}

/* ----------------------------- Rate limiter ----------------------------- */
// Free tier is 1 RPS. We enforce slightly less than that across all
// concurrent requests in this process via a simple FIFO queue so a
// burst of parallel page-component fetches doesn't trip 429s.
const MIN_INTERVAL_MS = 1100;
let queueTail: Promise<void> = Promise.resolve();

function scheduleSlot(): Promise<void> {
  const previous = queueTail;
  let release!: () => void;
  queueTail = new Promise<void>((res) => {
    release = res;
  });
  return previous.then(async () => {
    const elapsed = Date.now() - lastRequestAt;
    if (elapsed < MIN_INTERVAL_MS) {
      await sleep(MIN_INTERVAL_MS - elapsed);
    }
    lastRequestAt = Date.now();
    // Release the next queued caller after our minimum gap elapses.
    setTimeout(release, MIN_INTERVAL_MS);
  });
}

let lastRequestAt = 0;
function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

/**
 * Typed BirdEye fetcher. Throws `BirdEyeError` on non-2xx responses or
 * when the API envelope reports `success: false`. Serializes calls
 * across the process to stay under the 1 RPS free-tier limit, and
 * retries once after a brief delay on 429s.
 *
 * Always called from the server — never imported by client components
 * (the `server-only` import enforces this at build time).
 */
export async function birdeyeFetch<T>({
  path,
  params,
  chain = DEFAULT_CHAIN,
  revalidate = 60,
}: BirdEyeFetchOptions): Promise<T> {
  if (!isBirdEyeConfigured) {
    throw new BirdEyeError("BirdEye API key is not configured", 0, path);
  }

  const url = new URL(path, BASE_URL);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }

  return runOnce<T>(url.toString(), chain, revalidate, path, 0);
}

async function runOnce<T>(
  url: string,
  chain: BirdEyeChain,
  revalidate: number,
  path: string,
  attempt: number,
): Promise<T> {
  await scheduleSlot();

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      "X-API-KEY": KEY,
      "x-chain": chain,
    },
    next: { revalidate },
  });

  // Retry once on 429 after a 1.5s cool-down.
  if (res.status === 429 && attempt < 1) {
    await sleep(1500);
    return runOnce<T>(url, chain, revalidate, path, attempt + 1);
  }

  if (!res.ok) {
    throw new BirdEyeError(
      `BirdEye ${path} failed: ${res.status} ${res.statusText}`,
      res.status,
      path,
    );
  }

  const json = (await res.json()) as BirdEyeEnvelope<T>;
  if (!json.success) {
    // "Too many requests" arrives as a 200 with success=false in some
    // BirdEye edge cases — same retry treatment.
    const msg = (json.message ?? "").toLowerCase();
    if (msg.includes("too many requests") && attempt < 1) {
      await sleep(1500);
      return runOnce<T>(url, chain, revalidate, path, attempt + 1);
    }
    throw new BirdEyeError(
      `BirdEye ${path} returned success=false: ${json.message ?? "no message"}`,
      res.status,
      path,
    );
  }
  return json.data;
}

export class BirdEyeError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly path: string,
  ) {
    super(message);
    this.name = "BirdEyeError";
  }
}
