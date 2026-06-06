import { beforeEach, describe, expect, it, vi } from "vitest";

import { listUserPositions } from "./queries";

const mockOrder = vi.fn();
const mockOr = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => ({
    from: mockFrom,
  })),
}));

describe("listUserPositions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ or: mockOr });
    mockOr.mockReturnValue({ order: mockOrder });
  });

  it("returns joined market data for held positions", async () => {
    mockOrder.mockResolvedValue({
      data: [
        {
          yes_shares_cents: 150,
          no_shares_cents: 0,
          markets: {
            id: "22222222-2222-4222-8222-222222222222",
            title: "Sample market",
            status: "open",
            close_date: "2026-12-31T00:00:00.000Z",
          },
        },
      ],
      error: null,
    });

    await expect(listUserPositions()).resolves.toEqual([
      {
        marketId: "22222222-2222-4222-8222-222222222222",
        title: "Sample market",
        status: "open",
        closeDate: "2026-12-31T00:00:00.000Z",
        yesSharesCents: 150,
        noSharesCents: 0,
      },
    ]);

    expect(mockFrom).toHaveBeenCalledWith("positions");
    expect(mockOr).toHaveBeenCalledWith(
      "yes_shares_cents.gt.0,no_shares_cents.gt.0",
    );
  });
});
