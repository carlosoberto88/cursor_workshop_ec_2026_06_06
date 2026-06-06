import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatFakeAmount, totalFakeSharesCents } from "@/lib/fake-money";
import { formatCloseDate, formatMarketStatus } from "@/lib/markets/format";

type PositionCardPreviewProps = {
  marketId: string;
  title: string;
  status: string;
  closeDate: string | null;
  yesSharesCents: number;
  noSharesCents: number;
};

export function PositionCardPreview({
  marketId,
  title,
  status,
  closeDate,
  yesSharesCents,
  noSharesCents,
}: PositionCardPreviewProps) {
  const statusLabel = formatMarketStatus(status);
  const totalShares = totalFakeSharesCents(yesSharesCents, noSharesCents);

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <CardTitle className="text-lg">
              <Link
                href={`/markets/${marketId}`}
                className="transition-colors hover:text-primary"
              >
                {title}
              </Link>
            </CardTitle>
            <CardDescription>
              Closes {formatCloseDate(closeDate)}
            </CardDescription>
          </div>
          <Badge variant={statusLabel.variant}>{statusLabel.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <dt className="text-sm text-muted-foreground">Yes shares</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">
              {formatFakeAmount(yesSharesCents)}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <dt className="text-sm text-muted-foreground">No shares</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">
              {formatFakeAmount(noSharesCents)}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <dt className="text-sm text-muted-foreground">Total shares</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">
              {formatFakeAmount(totalShares)}
            </dd>
          </div>
          <div className="flex items-end">
            <Button asChild variant="outline" className="w-full">
              <Link href={`/markets/${marketId}`}>View market</Link>
            </Button>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
