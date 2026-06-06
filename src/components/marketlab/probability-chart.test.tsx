import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ProbabilityChart } from "./probability-chart";

describe("ProbabilityChart", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the svg line and neutral flat fallback copy", () => {
    render(
      <ProbabilityChart
        yesChance={50}
        isHistorical={false}
        points={[
          { at: "2026-01-01T00:00:00.000Z", yesChance: 50 },
          { at: "2026-06-01T00:00:00.000Z", yesChance: 50 },
        ]}
      />,
    );

    expect(
      screen.getByText(
        /Current market balance — no historical trading data yet/i,
      ),
    ).toBeTruthy();
    expect(screen.getByText("Yes 50.0%")).toBeTruthy();
    expect(document.querySelector("polyline")).toBeTruthy();
  });

  it("filters points when a range toggle is selected", () => {
    render(
      <ProbabilityChart
        yesChance={50}
        isHistorical={false}
        points={[
          { at: "2025-01-01T00:00:00.000Z", yesChance: 50 },
          { at: "2026-06-01T00:00:00.000Z", yesChance: 50 },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "1D" }));
    expect(document.querySelector("polyline")).toBeTruthy();
  });
});
