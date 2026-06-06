"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatYesChance } from "@/lib/markets/format";
import {
  type ChartPoint,
  type ChartRange,
  filterChartPointsByRange,
} from "@/lib/markets/probability";

const RANGES: ChartRange[] = ["1D", "1W", "1M", "All"];

const CHART = {
  width: 640,
  height: 240,
  padding: { top: 16, right: 16, bottom: 32, left: 40 },
};

type ProbabilityChartProps = {
  yesChance: number;
  points: ChartPoint[];
  isHistorical: boolean;
};

function toPolyline(points: ChartPoint[]): string {
  if (points.length === 0) {
    return "";
  }

  const { width, height, padding } = CHART;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const startMs = new Date(points[0].at).getTime();
  const endMs = new Date(points.at(-1)?.at ?? points[0].at).getTime();
  const spanMs = Math.max(endMs - startMs, 1);

  return points
    .map((point) => {
      const x =
        padding.left +
        ((new Date(point.at).getTime() - startMs) / spanMs) * plotWidth;
      const y = padding.top + plotHeight - (point.yesChance / 100) * plotHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function formatAxisDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function ProbabilityChart({
  yesChance,
  points,
  isHistorical,
}: ProbabilityChartProps) {
  const [range, setRange] = useState<ChartRange>("All");

  const filteredPoints = useMemo(
    () => filterChartPointsByRange(points, range),
    [points, range],
  );

  const polyline = toPolyline(filteredPoints);
  const startLabel = filteredPoints[0]?.at;
  const endLabel = filteredPoints.at(-1)?.at;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base">Yes probability</CardTitle>
            <CardDescription>
              {isHistorical
                ? "Historical Yes share balance reconstructed from ledger activity."
                : "Current market balance — no historical trading data yet."}
            </CardDescription>
          </div>
          <p className="text-2xl font-semibold tabular-nums">
            Yes {formatYesChance(yesChance)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {RANGES.map((item) => (
            <Button
              key={item}
              type="button"
              size="xs"
              variant={range === item ? "default" : "outline"}
              onClick={() => setRange(item)}
            >
              {item}
            </Button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${CHART.width} ${CHART.height}`}
            className="h-auto w-full min-w-[320px]"
            role="img"
            aria-label={`Yes probability chart at ${formatYesChance(yesChance)}`}
          >
            <title>Yes probability over time</title>
            {[0, 25, 50, 75, 100].map((tick) => {
              const y =
                CHART.padding.top +
                (CHART.height - CHART.padding.top - CHART.padding.bottom) *
                  (1 - tick / 100);
              return (
                <g key={tick}>
                  <line
                    x1={CHART.padding.left}
                    x2={CHART.width - CHART.padding.right}
                    y1={y}
                    y2={y}
                    stroke="var(--border)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={CHART.padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}
            {polyline ? (
              <polyline
                fill="none"
                stroke="var(--chart-1)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={polyline}
              />
            ) : null}
            {startLabel && endLabel ? (
              <>
                <text
                  x={CHART.padding.left}
                  y={CHART.height - 8}
                  className="fill-muted-foreground text-[10px]"
                >
                  {formatAxisDate(startLabel)}
                </text>
                <text
                  x={CHART.width - CHART.padding.right}
                  y={CHART.height - 8}
                  textAnchor="end"
                  className="fill-muted-foreground text-[10px]"
                >
                  {formatAxisDate(endLabel)}
                </text>
              </>
            ) : null}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
