import Link from "next/link";
import { notFound } from "next/navigation";

import { MarketBuySection } from "@/components/marketlab/market-buy-section";
import { ProbabilityChart } from "@/components/marketlab/probability-chart";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatCloseDate,
  formatMarketStatus,
  formatYesChance,
} from "@/lib/markets/format";
import {
  getMarketChartData,
  getMarketYesChance,
} from "@/lib/markets/market-stats";
import { getMarketById } from "@/lib/markets/queries";

type MarketDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketDetailPage({
  params,
}: MarketDetailPageProps) {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) {
    notFound();
  }

  const { yesChance, source } = await getMarketYesChance(market.id);
  const { points, isHistorical } = await getMarketChartData(
    market.id,
    market.created_at,
    yesChance,
  );
  const status = formatMarketStatus(market.status);
  const noChance = Math.round((100 - yesChance) * 10) / 10;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/markets"
        className="mb-6 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to markets
      </Link>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{market.title}</CardTitle>
                <CardDescription className="text-base">
                  {market.description || "No description provided."}
                </CardDescription>
              </div>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Closes {formatCloseDate(market.close_date)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Outcomes</CardTitle>
            <CardDescription>
              Current Yes/No balance
              {source === "neutral"
                ? " uses a neutral 50% baseline when market-wide activity is unavailable."
                : " from aggregate positions across traders."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium text-muted-foreground">Yes</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums">
                {formatYesChance(yesChance)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium text-muted-foreground">No</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums">
                {formatYesChance(noChance)}
              </p>
            </div>
          </CardContent>
        </Card>

        <ProbabilityChart
          yesChance={yesChance}
          points={points}
          isHistorical={isHistorical}
        />

        <MarketBuySection market={market} />
      </div>
    </main>
  );
}
