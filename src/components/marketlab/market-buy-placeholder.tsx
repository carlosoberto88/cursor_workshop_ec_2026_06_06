import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isMarketBuyable } from "@/lib/markets/is-market-buyable";
import type { Market } from "@/lib/markets/types";

type MarketBuyPlaceholderProps = {
  market: Pick<Market, "status" | "close_date">;
};

export function MarketBuyPlaceholder({ market }: MarketBuyPlaceholderProps) {
  const buyable = isMarketBuyable(market);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Trade</CardTitle>
        <CardDescription>
          {buyable
            ? "Buying and selling will be available in a later workshop step."
            : "This market is closed or resolved, so trading is unavailable."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button disabled className="w-full sm:w-auto">
          {buyable ? "Trading coming soon" : "Buying unavailable"}
        </Button>
      </CardContent>
    </Card>
  );
}
