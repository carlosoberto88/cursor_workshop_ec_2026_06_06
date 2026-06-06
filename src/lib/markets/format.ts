import type { VariantProps } from "class-variance-authority";

import type { badgeVariants } from "@/components/ui/badge";
import type { MarketStatus } from "@/lib/markets/types";

export function formatMarketStatus(status: string): {
  label: string;
  variant: NonNullable<VariantProps<typeof badgeVariants>["variant"]>;
} {
  switch (status as MarketStatus) {
    case "open":
      return { label: "Open", variant: "open" };
    case "closed":
      return { label: "Closed", variant: "closed" };
    case "resolved":
      return { label: "Resolved", variant: "resolved" };
    default:
      return { label: status, variant: "outline" };
  }
}

export function formatCloseDate(closeDate: string | null): string {
  if (!closeDate) {
    return "No close date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(closeDate));
}

export function formatYesChance(yesChance: number): string {
  return `${yesChance.toFixed(1)}%`;
}
