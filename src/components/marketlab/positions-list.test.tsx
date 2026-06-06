import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PositionsEmptyState } from "./positions-empty-state";
import { PositionCardPreview } from "./positions-list-preview";

describe("PositionsEmptyState", () => {
  it("shows an empty positions message", () => {
    render(<PositionsEmptyState />);

    expect(screen.getByText("No positions yet")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Browse markets" }).getAttribute("href"),
    ).toBe("/markets");
  });
});

describe("PositionCardPreview", () => {
  it("shows yes, no, total shares and market link", () => {
    render(
      <PositionCardPreview
        marketId="22222222-2222-4222-8222-222222222222"
        title="Workshop market"
        status="open"
        closeDate="2026-12-31T00:00:00.000Z"
        yesSharesCents={150}
        noSharesCents={250}
      />,
    );

    expect(
      screen
        .getByRole("link", { name: "Workshop market" })
        .getAttribute("href"),
    ).toBe("/markets/22222222-2222-4222-8222-222222222222");
    expect(screen.getByText("$1.50 fake")).toBeTruthy();
    expect(screen.getByText("$2.50 fake")).toBeTruthy();
    expect(screen.getByText("$4.00 fake")).toBeTruthy();
  });
});
