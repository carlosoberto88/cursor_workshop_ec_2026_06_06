import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketsEmptyState } from "./markets-empty-state";

describe("MarketsEmptyState", () => {
  it("renders empty state copy", () => {
    render(<MarketsEmptyState />);

    expect(screen.getByText("No markets yet")).toBeTruthy();
    expect(
      screen.getByText(/Browse fictional Yes\/No markets using fake money/i),
    ).toBeTruthy();
  });
});
