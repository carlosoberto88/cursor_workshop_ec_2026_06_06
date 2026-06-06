import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketCard } from "./market-card";

describe("MarketCard", () => {
  it("renders title, status, close date, and detail link", () => {
    render(
      <MarketCard
        market={{
          id: "market-1",
          title: "Will it rain?",
          description: "A fictional weather market.",
          status: "open",
          close_date: "2026-12-31T18:30:00.000Z",
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: "2026-01-01T00:00:00.000Z",
        }}
      />,
    );

    expect(screen.getByText("Will it rain?")).toBeTruthy();
    expect(screen.getByText("Open")).toBeTruthy();
    expect(screen.getByText(/Closes/i)).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "View details" }).getAttribute("href"),
    ).toBe("/markets/market-1");
  });
});
