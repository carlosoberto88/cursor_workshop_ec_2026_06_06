import { describe, expect, it } from "vitest";

import { getHeaderAuthState } from "@/lib/profile/header-state";

describe("getHeaderAuthState", () => {
  it("shows sign-in and sign-up actions when signed out", () => {
    const state = getHeaderAuthState({ user: null, profile: null });

    expect(state.kind).toBe("signed_out");
    expect(state.showSignIn).toBe(true);
    expect(state.showSignUp).toBe(true);
    expect(state.showSignOut).toBe(false);
    expect(state.showBalance).toBe(false);
    expect(state.balanceLabel).toBeNull();
  });

  it("shows balance and sign-out when signed in with profile", () => {
    const state = getHeaderAuthState({
      user: { id: "user-1" },
      profile: {
        balance_cents: 100_000,
        first_name: "Ada",
        last_name: "Lovelace",
      },
    });

    expect(state.kind).toBe("signed_in");
    expect(state.showSignIn).toBe(false);
    expect(state.showSignUp).toBe(false);
    expect(state.showSignOut).toBe(true);
    expect(state.showBalance).toBe(true);
    expect(state.balanceLabel).toBe("$1,000.00 fake");
  });

  it("handles missing profile state when signed in", () => {
    const state = getHeaderAuthState({
      user: { id: "user-1" },
      profile: null,
    });

    expect(state.kind).toBe("signed_in");
    expect(state.showSignOut).toBe(true);
    expect(state.balanceLabel).toBe("Balance unavailable");
  });
});
