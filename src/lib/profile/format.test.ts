import { describe, expect, it } from "vitest";

import { formatFakeBalance } from "@/lib/profile/format";

describe("formatFakeBalance", () => {
  it("formats starting workshop balance", () => {
    expect(formatFakeBalance(100_000)).toBe("$1,000.00 fake");
  });

  it("formats smaller balances with cents", () => {
    expect(formatFakeBalance(1_050)).toBe("$10.50 fake");
  });

  it("formats zero balance", () => {
    expect(formatFakeBalance(0)).toBe("$0.00 fake");
  });
});
