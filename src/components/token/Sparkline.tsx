import { cn } from "@/lib/utils";

/**
 * Tiny inline SVG sparkline. Pass an array of numeric `values` and
 * the component renders a single smoothed polyline scaled into a
 * `width x height` box. Colour follows the direction of last vs first.
 */
export function Sparkline({
  values,
  width = 64,
  height = 22,
  strokeWidth = 1.4,
  direction,
  className,
}: {
  values: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  /** Force the color. If omitted, inferred from first vs last value. */
  direction?: "up" | "down";
  className?: string;
}) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);

  const points = values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const up =
    direction === "up"
      ? true
      : direction === "down"
        ? false
        : values[values.length - 1] >= values[0];
  const stroke = up ? "var(--color-up)" : "var(--color-down)";
  const fill = up ? "var(--color-up)" : "var(--color-down)";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <polygon
        fill={fill}
        fillOpacity={0.12}
        points={`0,${height} ${points} ${width},${height}`}
      />
    </svg>
  );
}
