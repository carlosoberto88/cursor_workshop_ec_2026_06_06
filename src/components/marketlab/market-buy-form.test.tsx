import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketBuyForm } from "./market-buy-form";

const baseProps = {
  marketId: "11111111-1111-4111-8111-111111111111",
  marketBuyable: true,
  isSignedIn: true,
  balanceCents: 100000,
  yesSharesCents: 0,
  noSharesCents: 0,
  loginHref: "/login",
};

describe("MarketBuyForm", () => {
  it("asks signed-out users to sign in", () => {
    render(
      <MarketBuyForm {...baseProps} isSignedIn={false} balanceCents={null} />,
    );

    expect(
      screen.getByRole("link", { name: "Sign in" }).getAttribute("href"),
    ).toBe("/login");
    expect(screen.queryByLabelText("Fake dollars to spend")).toBeNull();
  });

  it("shows buying unavailable for closed markets", () => {
    render(<MarketBuyForm {...baseProps} marketBuyable={false} />);

    expect(
      screen.getByRole("button", { name: "Buying unavailable" }),
    ).toBeTruthy();
    expect(screen.queryByLabelText("Fake dollars to spend")).toBeNull();
  });

  it("renders buy controls for signed-in users on open markets", () => {
    render(<MarketBuyForm {...baseProps} />);

    expect(screen.getByLabelText("Fake dollars to spend")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Buy fake shares" }),
    ).toBeTruthy();
    expect(screen.getByText("Available fake balance:")).toBeTruthy();
  });

  it("shows current position totals when shares exist", () => {
    render(
      <MarketBuyForm {...baseProps} yesSharesCents={150} noSharesCents={250} />,
    );

    expect(screen.getByText("Your position")).toBeTruthy();
    expect(screen.getByText("$1.50 fake")).toBeTruthy();
    expect(screen.getByText("$2.50 fake")).toBeTruthy();
    expect(screen.getByText("$4.00 fake")).toBeTruthy();
  });
});
