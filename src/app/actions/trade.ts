"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  type BuyRpcResult,
  mapBuyRpcResult,
  validateBuyFormInput,
} from "@/lib/trade/validation";

export type BuyActionState = {
  error?: string;
  status?: "success";
  balanceCents?: number;
  yesSharesCents?: number;
  noSharesCents?: number;
};

export async function buyMarketShares(
  _prevState: BuyActionState,
  formData: FormData,
): Promise<BuyActionState> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign in required." };
  }

  const validated = validateBuyFormInput({
    marketId: String(formData.get("market_id") ?? ""),
    side: String(formData.get("side") ?? ""),
    amount: String(formData.get("amount") ?? ""),
  });

  if (!validated.ok) {
    return { error: validated.error };
  }

  const { marketId, side, amountCents } = validated.data;

  const { data, error } = await supabase.rpc("buy_market_shares", {
    p_market_id: marketId,
    p_side: side,
    p_amount_cents: amountCents,
  });

  if (error) {
    return { error: error.message };
  }

  const mapped = mapBuyRpcResult(data as BuyRpcResult);
  if (!mapped.ok) {
    return { error: mapped.error };
  }

  revalidatePath(`/markets/${marketId}`);
  revalidatePath("/positions");
  revalidatePath("/", "layout");

  return {
    status: "success",
    balanceCents: mapped.balanceCents,
    yesSharesCents: mapped.yesSharesCents,
    noSharesCents: mapped.noSharesCents,
  };
}
