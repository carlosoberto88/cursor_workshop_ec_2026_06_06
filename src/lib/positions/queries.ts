import type { PositionWithMarket } from "@/lib/positions/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type UserMarketPosition = {
  yesSharesCents: number;
  noSharesCents: number;
};

type PositionMarketRow = {
  yes_shares_cents: number;
  no_shares_cents: number;
  markets: {
    id: string;
    title: string;
    status: string;
    close_date: string | null;
  } | null;
};

export async function getUserPositionForMarket(
  marketId: string,
): Promise<UserMarketPosition> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("positions")
    .select("yes_shares_cents, no_shares_cents")
    .eq("market_id", marketId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    yesSharesCents: data?.yes_shares_cents ?? 0,
    noSharesCents: data?.no_shares_cents ?? 0,
  };
}

export async function listUserPositions(): Promise<PositionWithMarket[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("positions")
    .select(
      "yes_shares_cents, no_shares_cents, markets ( id, title, status, close_date )",
    )
    .or("yes_shares_cents.gt.0,no_shares_cents.gt.0")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as unknown as PositionMarketRow[];

  return rows.flatMap((row) => {
    const market = row.markets;

    if (!market || Array.isArray(market)) {
      return [];
    }

    return [
      {
        marketId: market.id,
        title: market.title,
        status: market.status,
        closeDate: market.close_date,
        yesSharesCents: row.yes_shares_cents,
        noSharesCents: row.no_shares_cents,
      },
    ];
  });
}
