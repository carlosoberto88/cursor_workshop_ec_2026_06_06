"use client";

import Link from "next/link";
import { useActionState } from "react";

import { type BuyActionState, buyMarketShares } from "@/app/actions/trade";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatFakeAmount, totalFakeSharesCents } from "@/lib/fake-money";

const initialState: BuyActionState = {};

type MarketBuyFormProps = {
  marketId: string;
  marketBuyable: boolean;
  isSignedIn: boolean;
  balanceCents: number | null;
  yesSharesCents: number;
  noSharesCents: number;
  loginHref: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </p>
  );
}

function SuccessMessage({
  balanceCents,
  yesSharesCents,
  noSharesCents,
}: {
  balanceCents: number;
  yesSharesCents: number;
  noSharesCents: number;
}) {
  return (
    <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
      Purchase complete. Your fake balance is now{" "}
      {formatFakeAmount(balanceCents)}. You hold{" "}
      {formatFakeAmount(yesSharesCents)} in Yes shares and{" "}
      {formatFakeAmount(noSharesCents)} in No shares for this market.
    </p>
  );
}

export function MarketBuyForm({
  marketId,
  marketBuyable,
  isSignedIn,
  balanceCents,
  yesSharesCents,
  noSharesCents,
  loginHref,
}: MarketBuyFormProps) {
  const [state, formAction, pending] = useActionState(
    buyMarketShares,
    initialState,
  );

  const displayBalance =
    state.status === "success" && state.balanceCents !== undefined
      ? state.balanceCents
      : balanceCents;
  const displayYesShares =
    state.status === "success" && state.yesSharesCents !== undefined
      ? state.yesSharesCents
      : yesSharesCents;
  const displayNoShares =
    state.status === "success" && state.noSharesCents !== undefined
      ? state.noSharesCents
      : noSharesCents;
  const totalShares = totalFakeSharesCents(displayYesShares, displayNoShares);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Buy fake shares</CardTitle>
        <CardDescription>
          Spend workshop fake money to add Yes or No shares. This is not real
          money and not financial advice.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSignedIn ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Sign in to buy fake shares with your workshop balance.
            </p>
            <Button asChild className="w-full sm:w-auto">
              <Link href={loginHref}>Sign in</Link>
            </Button>
          </div>
        ) : null}

        {isSignedIn && !marketBuyable ? (
          <p className="text-sm text-muted-foreground">
            This market is closed, resolved, or past its close date, so buying
            fake shares is unavailable.
          </p>
        ) : null}

        {isSignedIn && marketBuyable ? (
          <>
            {displayBalance !== null ? (
              <p className="text-sm text-muted-foreground">
                Available fake balance:{" "}
                <span className="font-medium text-foreground">
                  {formatFakeAmount(displayBalance)}
                </span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Fake balance unavailable.
              </p>
            )}

            {totalShares > 0 ? (
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
                <p className="font-medium text-foreground">Your position</p>
                <dl className="mt-2 grid gap-2 sm:grid-cols-3">
                  <div>
                    <dt className="text-muted-foreground">Yes shares</dt>
                    <dd className="font-medium tabular-nums">
                      {formatFakeAmount(displayYesShares)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">No shares</dt>
                    <dd className="font-medium tabular-nums">
                      {formatFakeAmount(displayNoShares)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Total shares</dt>
                    <dd className="font-medium tabular-nums">
                      {formatFakeAmount(totalShares)}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : null}

            <form action={formAction} className="space-y-4">
              <input type="hidden" name="market_id" value={marketId} />

              <FieldError message={state.error} />

              {state.status === "success" &&
              state.balanceCents !== undefined &&
              state.yesSharesCents !== undefined &&
              state.noSharesCents !== undefined ? (
                <SuccessMessage
                  balanceCents={state.balanceCents}
                  yesSharesCents={state.yesSharesCents}
                  noSharesCents={state.noSharesCents}
                />
              ) : null}

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Choose a side</legend>
                <div className="flex flex-wrap gap-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm has-checked:border-primary has-checked:bg-primary/5">
                    <input
                      type="radio"
                      name="side"
                      value="yes"
                      defaultChecked
                      required
                    />
                    Yes
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm has-checked:border-primary has-checked:bg-primary/5">
                    <input type="radio" name="side" value="no" required />
                    No
                  </label>
                </div>
              </fieldset>

              <div className="space-y-2">
                <Label htmlFor="amount">Fake dollars to spend</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="10.00"
                  autoComplete="off"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter an amount like 1, 1.50, or 10.00. One fake cent spent
                  equals one share cent.
                </p>
              </div>

              <Button
                type="submit"
                disabled={pending || displayBalance === null}
                className="w-full sm:w-auto"
              >
                {pending ? "Buying..." : "Buy fake shares"}
              </Button>
            </form>
          </>
        ) : null}

        {isSignedIn && !marketBuyable ? (
          <Button disabled className="w-full sm:w-auto">
            Buying unavailable
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
