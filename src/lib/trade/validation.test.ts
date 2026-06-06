import { describe, expect, it } from "vitest";

import { mapBuyRpcResult, validateBuyFormInput } from "./validation";

describe("validateBuyFormInput", () => {
  const marketId = "11111111-1111-4111-8111-111111111111";

  it("accepts valid yes and no buys", () => {
    expect(
      validateBuyFormInput({
        marketId,
        side: "yes",
        amount: "1.50",
      }),
    ).toEqual({
      ok: true,
      data: { marketId, side: "yes", amountCents: 150 },
    });

    expect(
      validateBuyFormInput({
        marketId,
        side: "no",
        amount: "10",
      }),
    ).toEqual({
      ok: true,
      data: { marketId, side: "no", amountCents: 1000 },
    });
  });

  it("rejects invalid side values", () => {
    const result = validateBuyFormInput({
      marketId,
      side: "maybe",
      amount: "1",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Choose Yes or No.");
    }
  });

  it("rejects invalid amounts", () => {
    const result = validateBuyFormInput({
      marketId,
      side: "yes",
      amount: "1.234",
    });

    expect(result.ok).toBe(false);
  });

  it("does not use a spoofed user id field", () => {
    const result = validateBuyFormInput({
      marketId,
      side: "yes",
      amount: "5",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).not.toHaveProperty("userId");
    }
  });
});

describe("mapBuyRpcResult", () => {
  it("maps successful rpc payloads", () => {
    expect(
      mapBuyRpcResult({
        ok: true,
        balance_cents: 90000,
        yes_shares_cents: 150,
        no_shares_cents: 0,
      }),
    ).toEqual({
      ok: true,
      balanceCents: 90000,
      yesSharesCents: 150,
      noSharesCents: 0,
    });
  });

  it("maps overspend and other rpc errors", () => {
    expect(
      mapBuyRpcResult({
        ok: false,
        error: "Insufficient fake balance for this purchase.",
      }),
    ).toEqual({
      ok: false,
      error: "Insufficient fake balance for this purchase.",
    });
  });
});
