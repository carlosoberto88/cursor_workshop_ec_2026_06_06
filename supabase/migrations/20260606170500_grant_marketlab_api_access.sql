-- Grant table access for Supabase API roles (RLS still applies per row).

grant select on table public.markets to anon, authenticated;

grant select on table public.profiles to authenticated;
grant select on table public.positions to authenticated;
grant select on table public.ledger_entries to authenticated;
