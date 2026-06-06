-- Atomic fake-money buy: deduct balance, upsert position, insert ledger entry.
-- Uses auth.uid() only; no client-supplied user_id.

create or replace function public.buy_market_shares(
  p_market_id uuid,
  p_side text,
  p_amount_cents bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_balance_cents bigint;
  v_market_status text;
  v_close_date timestamptz;
  v_yes_shares_cents bigint;
  v_no_shares_cents bigint;
  v_entry_type text;
  v_description text;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'Sign in required.');
  end if;

  if p_amount_cents is null or p_amount_cents <= 0 then
    return jsonb_build_object('ok', false, 'error', 'Enter a valid fake dollar amount.');
  end if;

  if p_side is distinct from 'yes' and p_side is distinct from 'no' then
    return jsonb_build_object('ok', false, 'error', 'Choose Yes or No.');
  end if;

  select m.status, m.close_date
  into v_market_status, v_close_date
  from public.markets as m
  where m.id = p_market_id;

  if v_market_status is null then
    return jsonb_build_object('ok', false, 'error', 'Market not found.');
  end if;

  if v_market_status <> 'open' then
    return jsonb_build_object(
      'ok',
      false,
      'error',
      'This market is not open for buying fake shares.'
    );
  end if;

  if v_close_date is not null and v_close_date <= now() then
    return jsonb_build_object(
      'ok',
      false,
      'error',
      'This market has passed its close date.'
    );
  end if;

  select p.balance_cents
  into v_balance_cents
  from public.profiles as p
  where p.id = v_user_id
  for update;

  if v_balance_cents is null then
    return jsonb_build_object('ok', false, 'error', 'Profile not found.');
  end if;

  if v_balance_cents < p_amount_cents then
    return jsonb_build_object(
      'ok',
      false,
      'error',
      'Insufficient fake balance for this purchase.'
    );
  end if;

  update public.profiles
  set balance_cents = balance_cents - p_amount_cents
  where id = v_user_id;

  if p_side = 'yes' then
    insert into public.positions (user_id, market_id, yes_shares_cents, no_shares_cents)
    values (v_user_id, p_market_id, p_amount_cents, 0)
    on conflict (user_id, market_id) do update
    set yes_shares_cents = public.positions.yes_shares_cents + excluded.yes_shares_cents;

    v_entry_type := 'buy_yes';
    v_description := 'Bought Yes shares with fake money';
  else
    insert into public.positions (user_id, market_id, yes_shares_cents, no_shares_cents)
    values (v_user_id, p_market_id, 0, p_amount_cents)
    on conflict (user_id, market_id) do update
    set no_shares_cents = public.positions.no_shares_cents + excluded.no_shares_cents;

    v_entry_type := 'buy_no';
    v_description := 'Bought No shares with fake money';
  end if;

  insert into public.ledger_entries (
    user_id,
    market_id,
    amount_cents,
    entry_type,
    description
  )
  values (
    v_user_id,
    p_market_id,
    -p_amount_cents,
    v_entry_type,
    v_description
  );

  select p.balance_cents
  into v_balance_cents
  from public.profiles as p
  where p.id = v_user_id;

  select pos.yes_shares_cents, pos.no_shares_cents
  into v_yes_shares_cents, v_no_shares_cents
  from public.positions as pos
  where pos.user_id = v_user_id
    and pos.market_id = p_market_id;

  return jsonb_build_object(
    'ok',
    true,
    'balance_cents',
    v_balance_cents,
    'yes_shares_cents',
    coalesce(v_yes_shares_cents, 0),
    'no_shares_cents',
    coalesce(v_no_shares_cents, 0)
  );
end;
$$;

grant execute on function public.buy_market_shares(uuid, text, bigint) to authenticated;
