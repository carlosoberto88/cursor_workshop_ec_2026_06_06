import { describe, expect, it } from "vitest";

import { getNextThemeMode, resolveThemeClass } from "@/lib/theme";

describe("theme helpers", () => {
  it("toggles between light and dark", () => {
    expect(getNextThemeMode("light")).toBe("dark");
    expect(getNextThemeMode("dark")).toBe("light");
  });

  it("maps theme mode to document class", () => {
    expect(resolveThemeClass("light")).toBe("");
    expect(resolveThemeClass("dark")).toBe("dark");
  });
});
