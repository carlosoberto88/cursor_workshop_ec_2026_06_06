import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketBuyPlaceholder } from "./market-buy-placeholder";

describe("MarketBuyPlaceholder", () => {
  it("shows buying unavailable for closed markets", () => {
    render(
      <MarketBuyPlaceholder
        market={{ status: "closed", close_date: "2026-12-31T00:00:00.000Z" }}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Buying unavailable" }),
    ).toBeTruthy();
  });

  it("shows trading coming soon for open markets", () => {
    render(
      <MarketBuyPlaceholder
        market={{ status: "open", close_date: "2026-12-31T00:00:00.000Z" }}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Trading coming soon" }),
    ).toBeTruthy();
  });
});
