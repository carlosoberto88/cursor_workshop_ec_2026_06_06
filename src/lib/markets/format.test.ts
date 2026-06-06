import { describe, expect, it } from "vitest";

import { formatCloseDate, formatMarketStatus } from "./format";

describe("formatMarketStatus", () => {
  it("formats known statuses", () => {
    expect(formatMarketStatus("open")).toEqual({
      label: "Open",
      variant: "open",
    });
    expect(formatMarketStatus("closed")).toEqual({
      label: "Closed",
      variant: "closed",
    });
    expect(formatMarketStatus("resolved")).toEqual({
      label: "Resolved",
      variant: "resolved",
    });
  });
});

describe("formatCloseDate", () => {
  it("returns a friendly label when close date is missing", () => {
    expect(formatCloseDate(null)).toBe("No close date");
  });

  it("formats close dates", () => {
    expect(formatCloseDate("2026-12-31T18:30:00.000Z")).toContain("2026");
  });
});
