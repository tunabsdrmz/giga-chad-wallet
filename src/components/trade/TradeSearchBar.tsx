"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { TokenAvatar } from "@/components/token/TokenAvatar";
import { useTradeMintNav } from "@/components/trade/TradeMintNav";
import { formatCompactUsd, formatPercent, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Token } from "@/types/token";

const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 1;

/** fomo-style centered token search with debounced API lookup. */
export function TradeSearchBar({ className }: { className?: string }) {
  const listboxId = useId();
  const router = useRouter();
  const nav = useTradeMintNav();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Token[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const trimmed = query.trim();
  const canSearch = trimmed.length >= MIN_QUERY_LENGTH;
  const showDropdown = open && canSearch;
  const visibleResults = canSearch ? results : [];
  const visibleLoading = canSearch && loading;

  const resetSearchState = useCallback(() => {
    setResults([]);
    setLoading(false);
    setError(null);
    setActiveIndex(-1);
  }, []);

  const goToMint = useCallback(
    (mint: string, token?: Token) => {
      setOpen(false);
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
      inputRef.current?.blur();

      if (nav) {
        nav.selectMint(mint, token);
        return;
      }
      router.push(`/trade/${mint}`);
    },
    [nav, router],
  );

  useEffect(() => {
    if (!canSearch) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/tokens/search?q=${encodeURIComponent(trimmed)}&limit=8`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("Search failed");
        const data = (await res.json()) as { tokens?: Token[]; error?: string };
        if (controller.signal.aborted) return;
        setResults(data.tokens ?? []);
        setActiveIndex(data.tokens?.length ? 0 : -1);
        if (data.error) setError(data.error);
      } catch (err) {
        if (controller.signal.aborted) return;
        setResults([]);
        setActiveIndex(-1);
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [trimmed, canSearch]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) {
      if (event.key === "ArrowDown" && canSearch) {
        setOpen(true);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!visibleResults.length) return;
      setActiveIndex((i) => (i + 1) % visibleResults.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!visibleResults.length) return;
      setActiveIndex((i) => (i <= 0 ? visibleResults.length - 1 : i - 1));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const pick = visibleResults[activeIndex] ?? visibleResults[0];
      if (pick) goToMint(pick.mint, pick);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <label
        className={cn(
          "trade-search flex h-9 w-full items-center gap-2 rounded-lg px-3 text-sm transition-colors",
        )}
      >
        <Search size={15} className="shrink-0 opacity-60" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            setOpen(true);
            if (next.trim().length < MIN_QUERY_LENGTH) {
              resetSearchState();
            }
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search tokens by name, symbol, or mint…"
          className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
          aria-label="Search tokens"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? listboxId : undefined}
          aria-autocomplete="list"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
        />
        {visibleLoading ? (
          <Loader2 size={14} className="shrink-0 animate-spin opacity-60" aria-hidden />
        ) : null}
      </label>

      {showDropdown ? (
        <div
          id={listboxId}
          role="listbox"
          className="trade-search-dropdown absolute top-[calc(100%+0.35rem)] z-50 max-h-80 w-full overflow-y-auto rounded-lg border shadow-lg"
        >
          {visibleLoading && visibleResults.length === 0 ? (
            <p className="px-3 py-2.5 text-sm text-muted-foreground">Searching…</p>
          ) : null}

          {!visibleLoading && visibleResults.length === 0 ? (
            <p className="px-3 py-2.5 text-sm text-muted-foreground">
              {error ? "Search unavailable. Try again." : `No tokens found for “${trimmed}”.`}
            </p>
          ) : null}

          {visibleResults.map((token, index) => (
            <button
              key={token.mint}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              className={cn(
                "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors",
                index === activeIndex
                  ? "bg-primary/15 text-foreground"
                  : "text-foreground hover:bg-primary/10",
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => goToMint(token.mint, token)}
            >
              <TokenAvatar
                mint={token.mint}
                symbol={token.symbol}
                logoUrl={token.logoUrl}
                size="sm"
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-semibold">{token.symbol}</span>
                  <span className="truncate text-muted-foreground">{token.name}</span>
                </span>
                <span className="mt-0.5 block truncate font-mono text-[11px] text-muted-foreground/80">
                  {token.mint}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-xs">{formatPrice(token.price)}</span>
                <span
                  className={cn(
                    "block text-[11px]",
                    token.change24h >= 0 ? "text-emerald-400" : "text-rose-400",
                  )}
                >
                  {formatPercent(token.change24h)}
                </span>
                {token.volume24h > 0 ? (
                  <span className="block text-[10px] text-muted-foreground">
                    {formatCompactUsd(token.volume24h)} vol
                  </span>
                ) : null}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
