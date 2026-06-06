import { BarChart3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MarketsEmptyState() {
  return (
    <Card className="border-dashed">
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
          <BarChart3 className="size-6 text-muted-foreground" />
        </div>
        <CardTitle>No markets yet</CardTitle>
        <CardDescription className="max-w-md">
          Browse fictional Yes/No markets using fake money. Markets will appear
          here once they are added to the database.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center text-sm text-muted-foreground">
        Check back soon or ask your workshop host to seed sample markets.
      </CardContent>
    </Card>
  );
}
