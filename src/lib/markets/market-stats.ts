import type { ChartPoint } from "@/lib/markets/probability";
import {
  buildLedgerChartPoints,
  calculateYesChance,
  isMarketWidePositionAggregate,
  NEUTRAL_YES_CHANCE,
} from "@/lib/markets/probability";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type YesChanceResult = {
  yesChance: number;
  source: "aggregate" | "neutral";
};

export type ChartDataResult = {
  points: ChartPoint[];
  isHistorical: boolean;
};

export async function getMarketYesChance(
  marketId: string,
): Promise<YesChanceResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("positions")
    .select("user_id, yes_shares_cents, no_shares_cents")
    .eq("market_id", marketId);

  if (error || !data) {
    return { yesChance: NEUTRAL_YES_CHANCE, source: "neutral" };
  }

  if (!isMarketWidePositionAggregate(data, user?.id ?? null)) {
    return { yesChance: NEUTRAL_YES_CHANCE, source: "neutral" };
  }

  const yesTotal = data.reduce((sum, row) => sum + row.yes_shares_cents, 0);
  const noTotal = data.reduce((sum, row) => sum + row.no_shares_cents, 0);

  return {
    yesChance: calculateYesChance(yesTotal, noTotal),
    source: "aggregate",
  };
}

export async function getMarketChartData(
  marketId: string,
  marketCreatedAt: string,
  yesChance: number,
): Promise<ChartDataResult> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("ledger_entries")
    .select("created_at, entry_type, description, amount_cents")
    .eq("market_id", marketId)
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) {
    const endAt = new Date().toISOString();
    return {
      points: [
        { at: marketCreatedAt, yesChance },
        { at: endAt, yesChance },
      ],
      isHistorical: false,
    };
  }

  const { points, isHistorical } = buildLedgerChartPoints(
    data,
    marketCreatedAt,
    yesChance,
  );

  return { points, isHistorical };
}
