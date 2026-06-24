import "server-only";

/** In-process fallback when BirdEye 429s during cache revalidation. */
interface Entry {
  data: unknown;
  fetchedAt: number;
}

const store = new Map<string, Entry>();

export function writeStale<T>(key: string, data: T): void {
  store.set(key, { data, fetchedAt: Date.now() });
}

/** Last good payload for this key, regardless of age — used only on API errors. */
export function readAnyStale<T>(key: string): T | null {
  const entry = store.get(key);
  return entry ? (entry.data as T) : null;
}

/**
 * Run `fetch`, persist on success, return last good data on failure
 * instead of throwing (keeps `unstable_cache` revalidation quiet).
 */
export async function withStaleFallback<T>(
  key: string,
  fetch: () => Promise<T>,
  isEmpty: (value: T) => boolean = () => false,
): Promise<T> {
  try {
    const fresh = await fetch();
    if (!isEmpty(fresh)) writeStale(key, fresh);
    return fresh;
  } catch (err) {
    const stale = readAnyStale<T>(key);
    if (stale && !isEmpty(stale)) {
      console.warn(`[birdeye] ${key} failed, serving stale cache:`, errMessage(err));
      return stale;
    }
    throw err;
  }
}

function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
