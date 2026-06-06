-- Workshop sample markets (fake-money Yes/No questions)

insert into public.markets (id, title, description, status, close_date)
values
  (
    'a1000001-0000-4000-8000-000000000001',
    'Will it rain in Quito during the workshop weekend?',
    'Resolves Yes if measurable rain is recorded at Mariscal Sucre International Airport on any workshop day.',
    'open',
    '2026-06-08 23:59:59+00'
  ),
  (
    'a1000001-0000-4000-8000-000000000002',
    'Will MarketLab ship buy/sell before the workshop ends?',
    'Resolves Yes if participants can place a fake-money trade on at least one open market before the final demo.',
    'open',
    '2026-06-06 22:00:00+00'
  ),
  (
    'a1000001-0000-4000-8000-000000000003',
    'Will Ecuador qualify for the 2026 World Cup?',
    'Resolves Yes if Ecuador is listed among the qualified teams for the 2026 FIFA World Cup.',
    'open',
    '2026-11-30 23:59:59+00'
  ),
  (
    'a1000001-0000-4000-8000-000000000004',
    'Will Bitcoin close above $100k on June 30, 2026?',
    'Uses the BTC/USD daily close on a major exchange. Workshop fiction — do not trade real money.',
    'open',
    '2026-06-30 23:59:59+00'
  ),
  (
    'a1000001-0000-4000-8000-000000000005',
    'Will Cursor announce a major agent update in June 2026?',
    'Resolves Yes if Cursor publishes a public blog or changelog entry describing a major agent capability update in June 2026.',
    'open',
    '2026-07-01 05:59:59+00'
  ),
  (
    'a1000001-0000-4000-8000-000000000006',
    'Will the workshop group finish all 10 prompts?',
    'Resolves Yes if the facilitator confirms the room completed every MarketLab build prompt during the session.',
    'closed',
    '2026-06-06 18:00:00+00'
  )
on conflict (id) do nothing;
