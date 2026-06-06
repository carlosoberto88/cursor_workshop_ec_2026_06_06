import { MarketBuyForm } from "@/components/marketlab/market-buy-form";
import { isMarketBuyable } from "@/lib/markets/is-market-buyable";
import type { Market } from "@/lib/markets/types";
import { getUserPositionForMarket } from "@/lib/positions/queries";
import { getCurrentUserProfile } from "@/lib/profile/queries";

type MarketBuySectionProps = {
  market: Pick<Market, "id" | "status" | "close_date">;
};

export async function MarketBuySection({ market }: MarketBuySectionProps) {
  const { user, profile } = await getCurrentUserProfile();
  const position = user
    ? await getUserPositionForMarket(market.id)
    : { yesSharesCents: 0, noSharesCents: 0 };

  return (
    <MarketBuyForm
      marketId={market.id}
      marketBuyable={isMarketBuyable(market)}
      isSignedIn={Boolean(user)}
      balanceCents={profile?.balance_cents ?? null}
      yesSharesCents={position.yesSharesCents}
      noSharesCents={position.noSharesCents}
      loginHref="/login"
    />
  );
}
