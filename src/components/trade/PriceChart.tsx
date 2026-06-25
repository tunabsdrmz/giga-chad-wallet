"use client";

import { useEffect, useRef, useState } from "react";
import {
  AreaSeries,
  CandlestickSeries,
  ColorType,
  createChart,
  type IChartApi,
  type UTCTimestamp,
} from "lightweight-charts";
import type { Token } from "@/types/token";
import { generateCandles, type Candle } from "@/lib/mock/market";
import { cn } from "@/lib/utils";

type Timeframe = "1m" | "5m" | "1h" | "1d" | "1w";
type ChartType = "candles" | "line";

const TIMEFRAMES: { id: Timeframe; label: string; step: number; count: number }[] = [
  { id: "1m", label: "1m", step: 60, count: 120 },
  { id: "5m", label: "5m", step: 300, count: 144 },
  { id: "1h", label: "1h", step: 3600, count: 96 },
  { id: "1d", label: "1d", step: 86400, count: 60 },
  { id: "1w", label: "1w", step: 604800, count: 52 },
];

const UP = "#21c95e";
const DOWN = "#ff622e";
const LINE = "#21c95e";

export function PriceChart({ token }: { token: Token }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("1h");
  const [chartType, setChartType] = useState<ChartType>("candles");
  const [candles, setCandles] = useState<Candle[]>(() => {
    const tf = TIMEFRAMES.find((t) => t.id === "1h")!;
    return generateCandles(token, tf.count, tf.step);
  });

  // Refresh candles when token or timeframe changes — BirdEye first,
  // mock generator as fallback.
  useEffect(() => {
    const tf = TIMEFRAMES.find((t) => t.id === timeframe)!;
    let cancelled = false;
    // Reset to mock candles immediately so the chart re-renders for
    // the new token/timeframe before the BirdEye fetch resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCandles(generateCandles(token, tf.count, tf.step));
    (async () => {
      try {
        const res = await fetch(`/api/birdeye/ohlcv/${token.mint}?tf=${timeframe}`);
        if (!res.ok) return; // keep mock
        const json = (await res.json()) as { candles?: Candle[] };
        if (cancelled || !json.candles || json.candles.length === 0) return;
        setCandles(json.candles);
      } catch {
        // network blip → keep mock
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, timeframe]);

  return (
    <div className="flex h-full w-full flex-col">
      <ChartToolbar
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        chartType={chartType}
        setChartType={setChartType}
      />
      <ChartCanvas candles={candles} chartType={chartType} />
    </div>
  );
}

function ChartToolbar({
  timeframe,
  setTimeframe,
  chartType,
  setChartType,
}: {
  timeframe: Timeframe;
  setTimeframe: (t: Timeframe) => void;
  chartType: ChartType;
  setChartType: (t: ChartType) => void;
}) {
  return (
    <div className="flex flex-col gap-2 px-1 pb-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
      <div
        className={cn(
          "flex items-center gap-1 overflow-x-auto rounded-lg bg-muted/40 p-0.5 text-xs",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.id}
            type="button"
            onClick={() => setTimeframe(tf.id)}
            className={cn(
              "shrink-0 rounded-md px-2.5 py-1 font-medium transition-colors sm:px-2.5",
              timeframe === tf.id
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tf.label}
          </button>
        ))}
      </div>
      <div className="flex shrink-0 items-center gap-1 self-end rounded-lg bg-muted/40 p-0.5 text-xs sm:self-auto">
        {(["candles", "line"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setChartType(t)}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium capitalize transition-colors",
              chartType === t
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChartCanvas({
  candles,
  chartType,
}: {
  candles: Candle[];
  chartType: ChartType;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || candles.length === 0) return;

    const chart: IChartApi = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9ca3af",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.04)" },
        horzLines: { color: "rgba(255,255,255,0.04)" },
      },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.08)" },
      timeScale: {
        borderColor: "rgba(255,255,255,0.08)",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: { mode: 0 },
      height: el.clientHeight,
      width: el.clientWidth,
    });

    if (chartType === "candles") {
      const series = chart.addSeries(CandlestickSeries, {
        upColor: UP,
        downColor: DOWN,
        borderUpColor: UP,
        borderDownColor: DOWN,
        wickUpColor: UP,
        wickDownColor: DOWN,
      });
      series.setData(
        candles.map((c) => ({ ...c, time: c.time as UTCTimestamp })),
      );
    } else {
      const series = chart.addSeries(AreaSeries, {
        lineColor: LINE,
        topColor: "rgba(33,201,94,0.35)",
        bottomColor: "rgba(33,201,94,0)",
        lineWidth: 2,
      });
      series.setData(
        candles.map((c) => ({
          time: c.time as UTCTimestamp,
          value: c.close,
        })),
      );
    }

    chart.timeScale().fitContent();

    const observer = new ResizeObserver(() => {
      chart.applyOptions({ width: el.clientWidth, height: el.clientHeight });
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, [candles, chartType]);

  return <div ref={containerRef} className="min-h-0 w-full flex-1" />;
}
