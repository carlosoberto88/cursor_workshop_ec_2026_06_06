import { describe, expect, it } from "vitest";

import {
  buildFlatChartPoints,
  buildLedgerChartPoints,
  calculateYesChance,
  filterChartPointsByRange,
  isMarketWidePositionAggregate,
  NEUTRAL_YES_CHANCE,
  parseLedgerSide,
} from "./probability";

describe("calculateYesChance", () => {
  it("returns 50 when totals are zero", () => {
    expect(calculateYesChance(0, 0)).toBe(NEUTRAL_YES_CHANCE);
  });

  it("computes yes share from aggregate positions", () => {
    expect(calculateYesChance(7500, 2500)).toBe(75);
  });
});

describe("isMarketWidePositionAggregate", () => {
  it("returns false for empty rows", () => {
    expect(isMarketWidePositionAggregate([], "user-1")).toBe(false);
  });

  it("returns false when only the signed-in user is visible", () => {
    expect(
      isMarketWidePositionAggregate([{ user_id: "user-1" }], "user-1"),
    ).toBe(false);
  });

  it("returns true when multiple users are visible", () => {
    expect(
      isMarketWidePositionAggregate(
        [{ user_id: "user-1" }, { user_id: "user-2" }],
        "user-1",
      ),
    ).toBe(true);
  });
});

describe("parseLedgerSide", () => {
  it("detects yes entries", () => {
    expect(parseLedgerSide({ entry_type: "buy_yes", description: "" })).toBe(
      "yes",
    );
  });

  it("detects no entries", () => {
    expect(parseLedgerSide({ entry_type: "buy_no", description: "" })).toBe(
      "no",
    );
  });
});

describe("buildLedgerChartPoints", () => {
  it("returns a flat line when ledger history is unavailable", () => {
    const result = buildLedgerChartPoints([], "2026-01-01T00:00:00.000Z", 50);

    expect(result.isHistorical).toBe(false);
    expect(result.points).toHaveLength(2);
    expect(result.points[0].yesChance).toBe(50);
    expect(result.points[1].yesChance).toBe(50);
  });

  it("builds historical points from parseable ledger entries", () => {
    const result = buildLedgerChartPoints(
      [
        {
          created_at: "2026-01-02T00:00:00.000Z",
          entry_type: "buy_yes",
          description: "",
          amount_cents: 1000,
        },
        {
          created_at: "2026-01-03T00:00:00.000Z",
          entry_type: "buy_no",
          description: "",
          amount_cents: 1000,
        },
      ],
      "2026-01-01T00:00:00.000Z",
      50,
    );

    expect(result.isHistorical).toBe(true);
    expect(result.points.length).toBeGreaterThan(2);
  });
});

describe("buildFlatChartPoints", () => {
  it("creates a flat current-state line", () => {
    const points = buildFlatChartPoints(
      "2026-01-01T00:00:00.000Z",
      "2026-01-02T00:00:00.000Z",
      62.5,
    );

    expect(points).toEqual([
      { at: "2026-01-01T00:00:00.000Z", yesChance: 62.5 },
      { at: "2026-01-02T00:00:00.000Z", yesChance: 62.5 },
    ]);
  });
});

describe("filterChartPointsByRange", () => {
  const points = buildFlatChartPoints(
    "2025-01-01T00:00:00.000Z",
    "2026-06-01T00:00:00.000Z",
    50,
  );

  it("keeps all points for All range", () => {
    expect(filterChartPointsByRange(points, "All")).toHaveLength(2);
  });

  it("anchors short filtered ranges to the latest value", () => {
    const filtered = filterChartPointsByRange(
      points,
      "1D",
      new Date("2026-06-01T00:00:00.000Z"),
    );

    expect(filtered).toHaveLength(2);
    expect(filtered[1].yesChance).toBe(50);
  });
});
