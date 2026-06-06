import type { Market } from "@/lib/markets/types";

export function isMarketBuyable(
  market: Pick<Market, "status" | "close_date">,
  now: Date = new Date(),
): boolean {
  if (market.status !== "open") {
    return false;
  }
  if (!market.close_date) {
    return true;
  }
  return new Date(market.close_date) > now;
}
