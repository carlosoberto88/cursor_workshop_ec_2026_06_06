import { parseFakeDollarInput } from "@/lib/fake-money";

export type BuySide = "yes" | "no";

export type BuyFormInput = {
  marketId: string;
  side: string;
  amount: string;
};

export type ValidatedBuyInput = {
  marketId: string;
  side: BuySide;
  amountCents: number;
};

export type BuyValidationResult =
  | { ok: true; data: ValidatedBuyInput }
  | { ok: false; error: string };

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateBuyFormInput(input: BuyFormInput): BuyValidationResult {
  const marketId = input.marketId.trim();

  if (!UUID_PATTERN.test(marketId)) {
    return { ok: false, error: "Invalid market." };
  }

  const side = input.side.trim().toLowerCase();
  if (side !== "yes" && side !== "no") {
    return { ok: false, error: "Choose Yes or No." };
  }

  const amountResult = parseFakeDollarInput(input.amount);
  if (!amountResult.ok) {
    return { ok: false, error: amountResult.error };
  }

  return {
    ok: true,
    data: {
      marketId,
      side,
      amountCents: amountResult.cents,
    },
  };
}

export type BuyRpcResult = {
  ok: boolean;
  error?: string;
  balance_cents?: number;
  yes_shares_cents?: number;
  no_shares_cents?: number;
};

export function mapBuyRpcResult(result: BuyRpcResult):
  | {
      ok: true;
      balanceCents: number;
      yesSharesCents: number;
      noSharesCents: number;
    }
  | { ok: false; error: string } {
  if (!result.ok) {
    return {
      ok: false,
      error: result.error ?? "Unable to complete this purchase.",
    };
  }

  if (
    typeof result.balance_cents !== "number" ||
    typeof result.yes_shares_cents !== "number" ||
    typeof result.no_shares_cents !== "number"
  ) {
    return { ok: false, error: "Unexpected response from the server." };
  }

  return {
    ok: true,
    balanceCents: result.balance_cents,
    yesSharesCents: result.yes_shares_cents,
    noSharesCents: result.no_shares_cents,
  };
}
