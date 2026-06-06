import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCloseDate, formatMarketStatus } from "@/lib/markets/format";
import type { Market } from "@/lib/markets/types";

type MarketCardProps = {
  market: Market;
};

export function MarketCard({ market }: MarketCardProps) {
  const status = formatMarketStatus(market.status);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">{market.title}</CardTitle>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <CardDescription className="line-clamp-3">
          {market.description || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-4 pt-0">
        <p className="text-sm text-muted-foreground">
          Closes {formatCloseDate(market.close_date)}
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/markets/${market.id}`}>View details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
