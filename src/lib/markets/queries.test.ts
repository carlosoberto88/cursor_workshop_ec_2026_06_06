import { beforeEach, describe, expect, it, vi } from "vitest";

import { getMarketById, listMarkets } from "./queries";

const fromMock = vi.fn();
const createServerSupabaseClientMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: () => createServerSupabaseClientMock(),
}));

describe("market queries", () => {
  beforeEach(() => {
    fromMock.mockReset();
    createServerSupabaseClientMock.mockReset();
    createServerSupabaseClientMock.mockResolvedValue({ from: fromMock });
  });

  it("lists markets", async () => {
    const orderMock = vi.fn().mockResolvedValue({
      data: [
        {
          id: "market-1",
          title: "Sample market",
          description: "Desc",
          status: "open",
          close_date: null,
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: "2026-01-01T00:00:00.000Z",
        },
      ],
      error: null,
    });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    fromMock.mockReturnValue({ select: selectMock });

    const markets = await listMarkets();

    expect(markets).toHaveLength(1);
    expect(markets[0]?.title).toBe("Sample market");
  });

  it("returns null when a market is missing", async () => {
    const eqMock = vi.fn().mockReturnValue({
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    fromMock.mockReturnValue({ select: selectMock });

    const market = await getMarketById("missing");

    expect(market).toBeNull();
  });
});
