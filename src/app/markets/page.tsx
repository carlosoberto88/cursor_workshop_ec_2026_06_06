import { MarketCard } from "@/components/marketlab/market-card";
import { MarketsEmptyState } from "@/components/marketlab/markets-empty-state";
import { listMarkets } from "@/lib/markets/queries";

export default async function MarketsPage() {
  const markets = await listMarkets();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Markets</h1>
        <p className="max-w-2xl text-muted-foreground">
          Browse fictional Yes/No markets using fake money. Pick a market to
          view details and current sentiment.
        </p>
      </div>

      {markets.length === 0 ? (
        <MarketsEmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </main>
  );
}
