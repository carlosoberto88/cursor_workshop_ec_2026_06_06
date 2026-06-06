const FAKE_DOLLAR_PATTERN = /^\d+(\.\d{1,2})?$/;

export function formatFakeAmount(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} fake`;
}

export type ParseFakeDollarResult =
  | { ok: true; cents: number }
  | { ok: false; error: string };

export function parseFakeDollarInput(value: string): ParseFakeDollarResult {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return { ok: false, error: "Enter a fake dollar amount." };
  }

  if (!FAKE_DOLLAR_PATTERN.test(trimmed)) {
    return {
      ok: false,
      error: "Use up to two decimal places, for example 1 or 1.50.",
    };
  }

  const [wholePart, fractionalPart = ""] = trimmed.split(".");
  const whole = Number.parseInt(wholePart, 10);
  if (Number.isNaN(whole)) {
    return {
      ok: false,
      error: "Use up to two decimal places, for example 1 or 1.50.",
    };
  }

  const fractionText = fractionalPart.padEnd(2, "0").slice(0, 2);
  const fraction = Number.parseInt(fractionText, 10);
  const totalCents = whole * 100 + fraction;

  if (totalCents <= 0) {
    return { ok: false, error: "Enter an amount greater than zero." };
  }

  if (!Number.isSafeInteger(totalCents)) {
    return { ok: false, error: "Amount is too large." };
  }

  return { ok: true, cents: totalCents };
}

export function totalFakeSharesCents(
  yesSharesCents: number,
  noSharesCents: number,
): number {
  return yesSharesCents + noSharesCents;
}
