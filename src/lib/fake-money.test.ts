import { describe, expect, it } from "vitest";

import {
  formatFakeAmount,
  parseFakeDollarInput,
  totalFakeSharesCents,
} from "./fake-money";

describe("formatFakeAmount", () => {
  it("formats whole and fractional fake dollars", () => {
    expect(formatFakeAmount(100000)).toBe("$1,000.00 fake");
    expect(formatFakeAmount(1050)).toBe("$10.50 fake");
    expect(formatFakeAmount(0)).toBe("$0.00 fake");
  });
});

describe("parseFakeDollarInput", () => {
  it("accepts valid fake dollar amounts", () => {
    expect(parseFakeDollarInput("1")).toEqual({ ok: true, cents: 100 });
    expect(parseFakeDollarInput("1.5")).toEqual({ ok: true, cents: 150 });
    expect(parseFakeDollarInput("10.00")).toEqual({ ok: true, cents: 1000 });
  });

  it("rejects empty and invalid values", () => {
    expect(parseFakeDollarInput("").ok).toBe(false);
    expect(parseFakeDollarInput("abc").ok).toBe(false);
    expect(parseFakeDollarInput("1.234").ok).toBe(false);
  });

  it("rejects zero and negative amounts", () => {
    expect(parseFakeDollarInput("0").ok).toBe(false);
    expect(parseFakeDollarInput("0.00").ok).toBe(false);
  });
});

describe("totalFakeSharesCents", () => {
  it("adds yes and no share cents", () => {
    expect(totalFakeSharesCents(150, 250)).toBe(400);
  });
});
