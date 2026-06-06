import { describe, expect, it } from "vitest";

import { resolveClientTheme } from "./theme";

describe("resolveClientTheme", () => {
  it("defaults to light when no storage or media query is available", () => {
    expect(resolveClientTheme()).toBe("light");
  });
});
