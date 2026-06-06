import Link from "next/link";

import { PositionsEmptyState } from "@/components/marketlab/positions-empty-state";
import { PositionCardPreview } from "@/components/marketlab/positions-list-preview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listUserPositions } from "@/lib/positions/queries";
import { getCurrentUser } from "@/lib/profile/queries";

export default async function PositionsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              My Positions
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to view the fake-money shares you hold across markets.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sign in required</CardTitle>
              <CardDescription>
                Your positions are private. Sign in to see markets where you
                hold Yes or No shares.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const positions = await listUserPositions();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            My Positions
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Markets where you hold fake-money Yes or No shares. Amounts are
            workshop play money only.
          </p>
        </div>

        {positions.length === 0 ? (
          <PositionsEmptyState />
        ) : (
          <div className="grid gap-4">
            {positions.map((position) => (
              <PositionCardPreview
                key={position.marketId}
                marketId={position.marketId}
                title={position.title}
                status={position.status}
                closeDate={position.closeDate}
                yesSharesCents={position.yesSharesCents}
                noSharesCents={position.noSharesCents}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
