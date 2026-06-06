import type { Market } from "@/lib/markets/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function listMarkets(): Promise<Market[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .order("close_date", { ascending: true, nullsFirst: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getMarketById(id: string): Promise<Market | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
