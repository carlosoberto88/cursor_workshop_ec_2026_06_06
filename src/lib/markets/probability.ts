export type ChartPoint = {
  at: string;
  yesChance: number;
};

export type ChartRange = "1D" | "1W" | "1M" | "All";

export const NEUTRAL_YES_CHANCE = 50;

export function calculateYesChance(yesTotal: number, noTotal: number): number {
  const total = yesTotal + noTotal;
  if (total <= 0) {
    return NEUTRAL_YES_CHANCE;
  }
  return Math.round((yesTotal / total) * 1000) / 10;
}

export function isMarketWidePositionAggregate(
  rows: Array<{ user_id: string }>,
  authUserId: string | null,
): boolean {
  if (rows.length === 0) {
    return false;
  }

  const distinctUsers = new Set(rows.map((row) => row.user_id));
  if (distinctUsers.size > 1) {
    return true;
  }

  if (!authUserId) {
    return false;
  }

  return !distinctUsers.has(authUserId);
}

export function parseLedgerSide(entry: {
  entry_type: string;
  description: string;
}): "yes" | "no" | null {
  const haystack = `${entry.entry_type} ${entry.description}`.toLowerCase();

  if (/\bno\b/.test(haystack) && !/\byes\b/.test(haystack)) {
    return "no";
  }
  if (/\byes\b/.test(haystack) || haystack.includes("buy_yes")) {
    return "yes";
  }
  if (haystack.includes("buy_no")) {
    return "no";
  }

  return null;
}

export function buildFlatChartPoints(
  createdAt: string,
  endAt: string,
  yesChance: number,
): ChartPoint[] {
  return [
    { at: createdAt, yesChance },
    { at: endAt, yesChance },
  ];
}

export function buildLedgerChartPoints(
  entries: Array<{
    created_at: string;
    entry_type: string;
    description: string;
    amount_cents: number;
  }>,
  marketCreatedAt: string,
  fallbackYesChance: number,
): { points: ChartPoint[]; isHistorical: boolean } {
  const sorted = [...entries].sort((a, b) =>
    a.created_at.localeCompare(b.created_at),
  );

  let yesTotal = 0;
  let noTotal = 0;
  let parsedCount = 0;
  const points: ChartPoint[] = [
    {
      at: marketCreatedAt,
      yesChance: NEUTRAL_YES_CHANCE,
    },
  ];

  for (const entry of sorted) {
    const side = parseLedgerSide(entry);
    if (!side) {
      continue;
    }

    const amount = Math.abs(entry.amount_cents);
    if (side === "yes") {
      yesTotal += amount;
    } else {
      noTotal += amount;
    }
    parsedCount += 1;

    points.push({
      at: entry.created_at,
      yesChance: calculateYesChance(yesTotal, noTotal),
    });
  }

  if (parsedCount === 0) {
    const endAt = new Date().toISOString();
    return {
      points: buildFlatChartPoints(marketCreatedAt, endAt, fallbackYesChance),
      isHistorical: false,
    };
  }

  const last = points.at(-1);
  if (last && last.yesChance !== fallbackYesChance) {
    points.push({
      at: new Date().toISOString(),
      yesChance: fallbackYesChance,
    });
  }

  return { points, isHistorical: true };
}

export function filterChartPointsByRange(
  points: ChartPoint[],
  range: ChartRange,
  now: Date = new Date(),
): ChartPoint[] {
  if (range === "All" || points.length === 0) {
    return points;
  }

  const endMs = now.getTime();
  const startMs =
    range === "1D"
      ? endMs - 24 * 60 * 60 * 1000
      : range === "1W"
        ? endMs - 7 * 24 * 60 * 60 * 1000
        : endMs - 30 * 24 * 60 * 60 * 1000;

  const filtered = points.filter(
    (point) => new Date(point.at).getTime() >= startMs,
  );

  if (filtered.length >= 2) {
    return filtered;
  }

  const anchor = points.at(-1);
  if (!anchor) {
    return points;
  }

  return [
    { at: new Date(startMs).toISOString(), yesChance: anchor.yesChance },
    anchor,
  ];
}
