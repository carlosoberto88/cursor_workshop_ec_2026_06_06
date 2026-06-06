import type { Database } from "@/lib/supabase/database.types";

export type Market = Database["public"]["Tables"]["markets"]["Row"];
export type MarketStatus = "open" | "closed" | "resolved";

export type PositionRow = Pick<
  Database["public"]["Tables"]["positions"]["Row"],
  "user_id" | "yes_shares_cents" | "no_shares_cents"
>;

export type LedgerRow = Pick<
  Database["public"]["Tables"]["ledger_entries"]["Row"],
  "created_at" | "entry_type" | "description" | "amount_cents"
>;
